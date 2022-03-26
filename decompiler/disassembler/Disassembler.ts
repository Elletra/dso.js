import { DSOData } from "../loader/DSOData";
import { BytecodeReader } from "./BytecodeReader";
import { Instruction } from "./Instruction";
import { Disassembly } from "./Disassembly";
import { Queue } from "../../common/util/Queue";

import { Opcode, isValidOpcode } from "../../common/opcodes";


/**
 * Disassembles DSO bytecode into instructions and jump data.
 */
export class Disassembler
{
	static Error = class extends Error {};

	private _reader: BytecodeReader;
	private _queue: Queue<number>;
	private _disassembly: Disassembly;

	constructor ()
	{
		this._reader = null;
		this._queue = null;
		this._disassembly = null;
	}

	disassemble ( data: DSOData ): Disassembly
	{
		this._reader = new BytecodeReader (data);
		this._queue = new Queue<number> ();
		this._disassembly = new Disassembly ();

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
					prevInsn.addChild (this._disassembly.instructionAt (ip));
				}

				break;
			}

			const instruction = this._disassembleOp (this._advance (), ip);

			if ( prevInsn !== null )
			{
				prevInsn.addChild (instruction);
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
		this._disassembleJump (instruction);
		this._disassembleFuncDecl (instruction);
		this._disassembleReturn (instruction);

		return instruction;
	}

	private _disassembleJump ( instruction: Instruction )
	{
		switch ( instruction.op )
		{
			case Opcode.OP_JMPIFFNOT:
			case Opcode.OP_JMPIFNOT:
			case Opcode.OP_JMPIFF:
			case Opcode.OP_JMPIF:
			case Opcode.OP_JMPIFNOT_NP:
			case Opcode.OP_JMPIF_NP:
			case Opcode.OP_JMP:
				const jumpTarget = instruction.operands[0];

				if ( !this._disassembly.hasInstruction (jumpTarget) )
				{
					// We do this just in case there's some "jump in the middle of an instruction"
					// funny business.
					this._enqueueAddr (jumpTarget);
				}

				this._disassembly.addJump (instruction.addr, jumpTarget);
				this._disassembly.addCfgNodeAddrs (jumpTarget);

				if ( !this._reader.isAtEnd () )
				{
					this._disassembly.addCfgNodeAddrs (this._reader.ip);
				}

				break;

			default:
				break;
		}
	}

	private _disassembleFuncDecl ( instruction: Instruction )
	{
		if ( instruction.op === Opcode.OP_FUNC_DECL && !this._reader.isAtEnd () )
		{
			// Add function declaration and function end to CFG node address set.
			this._disassembly.addCfgNodeAddrs (instruction.addr, instruction.operands[4]);
		}
	}

	private _disassembleReturn ( instruction: Instruction )
	{
		if ( instruction.op === Opcode.OP_RETURN && !this._reader.isAtEnd () )
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
		const jump = this._disassembly.instructionAt (jumpAddr);
		const target = this._disassembly.instructionAt (targetAddr);

		if ( jump === null )
		{
			throw new Disassembler.Error (`Could not get instruction at ${jumpAddr}`);
		}

		if ( target === null )
		{
			throw new Disassembler.Error (`Could not get instruction at ${targetAddr}`);
		}

		jump.addChild (target);
	}
};
