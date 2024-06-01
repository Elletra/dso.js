import { FileData } from "../loader/fileData";
import { Opcode } from "../opcodes/opcode";
import { OpcodeFactory } from "../opcodes/opcodeFactory";
import { BytecodeReader } from "./bytecodeReader";
import { Disassembly } from "./disassembly";
import { BranchInstruction, FunctionInstruction, Instruction } from "./instructions/instruction";
import { InstructionFactory } from "./instructions/instructionFactory";

export class Disassembler
{
	#opcodeFactory: OpcodeFactory;
	#instructionFactory: InstructionFactory;
	#reader: BytecodeReader;
	#disassembly: Disassembly;

	public disassemble(fileData: FileData, opcodeFactory: OpcodeFactory, instructionFactory: InstructionFactory): Disassembly
	{
		this.#reader = new BytecodeReader(fileData);
		this.#opcodeFactory = opcodeFactory;
		this.#instructionFactory = instructionFactory;
		this.#disassembly = new Disassembly();

		this.#disassemble();
		this.#markBranchTargets();

		return this.#disassembly;
	}

	#disassemble(): void
	{
		/**
		 * Right now we're just doing a linear sweep, but that doesn't handle certain anti-disassembly
		 * techniques like jumping to the middle of an instruction.
		 * 
		 * No DSO file currently does this to my knowledge, and probably never will, but it would be
		 * nice to support it eventually. At the moment, the goal is to just write a functional
		 * decompiler and worry about edge cases later.
		 * 
		 * TODO: Maybe someday.
		 */
		while (!this.#reader.isAtEnd)
		{
			this.#disassembleNext();
		}
	}

	#disassembleNext(): void
	{
		const address = this.#reader.index;

		this.#processAddress(address);

		const value = this.#reader.read();
		const opcode = this.#opcodeFactory.create(value);

		if (opcode === null || !opcode.isValid)
		{
			throw new Error(`Invalid opcode ${value} at ${address}`);
		}

		const instruction = this.#disassembleOpcode(opcode, address);

		if (instruction === null)
		{
			throw new Error(`Failed to disassemble opcode ${opcode.value} at ${address}`);
		}

		this.#processInstruction(instruction);
	}

	#processAddress(address: number): void
	{
		if (this.#reader.inFunction && address >= this.#reader.function?.endAddress)
		{
			this.#reader.function = null;
		}
	}

	#disassembleOpcode(opcode: Opcode, address: number): Instruction | null
	{
		return this.#instructionFactory.create(opcode, address, this.#reader);
	}

	#processInstruction(instruction: Instruction): void
	{
		this.#validateInstruction(instruction);
		this.#addInstruction(instruction);
	}

	#validateInstruction(instruction: Instruction): void
	{
		if (instruction instanceof FunctionInstruction)
		{
			if (instruction.hasBody)
			{
				// TODO: Maybe support nested functions someday??
				if (this.#reader.inFunction)
				{
					throw new Error(`Nested function at ${instruction.address}`);
				}

				if (instruction.endAddress >= this.#reader.size)
				{
					throw new Error(`Function at ${instruction.address} has invalid end address ${instruction.endAddress}`);
				}

				this.#reader.function = instruction;
			}
		}
		else if (instruction instanceof BranchInstruction)
		{
			if (this.#reader.inFunction)
			{
				const { address, targetAddress } = instruction;
				const { function: func } = this.#reader;

				if (targetAddress <= func.address || targetAddress >= func.endAddress)
				{
					throw new Error(`Branch at ${address} jumps out of function to ${targetAddress}`);
				}
			}
		}
	}

	#addInstruction(instruction: Instruction): void { this.#disassembly.addInstruction(instruction); }

	#markBranchTargets(): void
	{
		for (const instruction of this.#disassembly.getInstructions())
		{
			if (instruction instanceof BranchInstruction)
			{
				this.#disassembly.addBranchTarget(instruction.targetAddress);
			}
		}
	}
};
