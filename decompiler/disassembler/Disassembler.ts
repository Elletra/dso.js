import { DsoData } from "../loader/DsoData";
import { BytecodeReader } from "./BytecodeReader";
import { Instruction } from "./Instruction";
import { Disassembly } from "./Disassembly";
import { Queue } from "../../common/util/Queue";

import { Opcode, isValidOpcode, isJumpOpcode } from "../../common/opcodes";


/**
 * Disassembles DSO bytecode into instructions and data for creating a control flow graph.
 */
export class Disassembler
{
	static Error = class extends Error {};

	private _reader: BytecodeReader;
	private _queue: Queue<number>;
	private _disassembly: Disassembly;

	disassemble ( data: DsoData ): Disassembly
	{
		this._init (data);

		this._enqueueAddr (0);

		// The queue should typically only have 1 item in it. The reason we use a queue at all is
		// to disassemble jumps that jump in the middle of an instruction to avoid disassembly.
		//
		// I don't think there are any DSO files that actually do that, but it doesn't hurt to be
		// thorough...
		while ( !this._queue.isEmpty () )
		{
			this._disassembleFrom (this._dequeueAddr ());
		}

		this._fixJumps ();

		return this._disassembly;
	}

	/**
	 * Private methods
	 */

	private _init ( data: DsoData )
	{
		this._reader = new BytecodeReader (data);
		this._queue = new Queue<number> ();
		this._disassembly = new Disassembly ();
	}

	private _advance (): number
	{
		return this._reader.read ();
	}

	private _enqueueAddr ( addr: number )
	{
		this._queue.enqueue (addr);
	}

	private _dequeueAddr (): number
	{
		return this._queue.dequeue ();
	}

	private _disassembleFrom ( startAddr: number )
	{
		this._reader.ip = startAddr;

		let prevInsn = null;

		while ( !this._reader.isAtEnd () )
		{
			const { ip } = this._reader;

			// Check if we've already disassembled this instruction to prevent an infinite loop.
			if ( this._disassembly.hasInstruction (ip) )
			{
				// Connect our previous instruction to the rest of the code, if necessary.
				if ( prevInsn !== null )
				{
					this._disassembly.addEdge (prevInsn.addr, ip);
				}

				break;
			}

			const instruction = this._disassembleOp (this._advance (), ip);

			if ( prevInsn !== null )
			{
				this._disassembly.addEdge (prevInsn.addr, instruction.addr);
			}

			prevInsn = instruction;
		}
	}

	private _disassembleOp ( op: Opcode, addr: number ): Instruction
	{
		if ( !isValidOpcode (op) )
		{
			throw new Disassembler.Error (`Invalid opcode \`${op}\` at ${addr}`);
		}

		const size = this._reader.opcodeSize (addr);
		const instruction = new Instruction (op, addr);

		for ( let i = 1; i < size; i++ )
		{
			instruction.addOperand (this._advance ());
		}

		this._disassembly.addInstruction (addr, instruction);
		this._handleInstruction (instruction);

		return instruction;
	}

	private _handleInstruction ( instruction: Instruction )
	{
		switch ( instruction.op )
		{
			case Opcode.OP_FUNC_DECL:
				this._handleFuncDecl (instruction);
				break;

			case Opcode.OP_RETURN:
				this._handleReturn (instruction);
				break;

			default:
				if ( isJumpOpcode (instruction.op) )
				{
					this._handleJump (instruction);
				}

				break;
		}
	}

	private _handleJump ( instruction: Instruction )
	{
		const jumpTarget = instruction.operands[0];
		const disassembly = this._disassembly;

		if ( !disassembly.hasInstruction (jumpTarget) )
		{
			// We do this just in case there's some "jump in the middle of an instruction" funny business.
			this._enqueueAddr (jumpTarget);
		}

		disassembly.addJump (instruction.addr, jumpTarget);
		disassembly.addCfgNodeAddrs (jumpTarget);

		if ( !this._reader.isAtEnd () )
		{
			disassembly.addCfgNodeAddrs (this._reader.ip);
		}
	}

	private _handleFuncDecl ( instruction: Instruction )
	{
		if ( !this._reader.isAtEnd () )
		{
			// Add function declaration and function end to CFG node addresses.
			this._disassembly.addCfgNodeAddrs (instruction.addr, instruction.operands[4]);
		}
	}

	private _handleReturn ( instruction: Instruction )
	{
		if ( !this._reader.isAtEnd () )
		{
			this._disassembly.addCfgNodeAddrs (this._reader.ip);
		}
	}

	/**
	 * Adds jump targets as children of jump instructions.
	 */
	private _fixJumps ()
	{
		const { jumps } = this._disassembly;

		for ( const [jumpAddr, targetAddr] of jumps )
		{
			this._fixJump (jumpAddr, targetAddr);
		}
	}

	private _fixJump ( jumpAddr: number, targetAddr: number )
	{
		const disassembly = this._disassembly;

		if ( !disassembly.hasInstruction (jumpAddr) )
		{
			throw new Disassembler.Error (`No instruction found at ${jumpAddr}`);
		}

		if ( !disassembly.hasInstruction (targetAddr) )
		{
			throw new Disassembler.Error (`No instruction found at ${targetAddr}`);
		}

		this._disassembly.addEdge (jumpAddr, targetAddr);
	}
};
