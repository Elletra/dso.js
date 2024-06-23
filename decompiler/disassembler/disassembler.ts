import { FileData } from "../loader/fileData";
import { BytecodeReader } from "./bytecodeReader";
import { Instruction } from "./instructions/instruction";
import { BranchInstruction } from "./instructions/branch";
import { FunctionDeclarationInstruction } from "./instructions/functionDeclaration";
import { InstructionFactory } from "./instructions/instructionFactory";
import { Disassembly } from "./disassembly";

export class Disassembler
{
	#instructionFactory: InstructionFactory;
	#reader: BytecodeReader;
	#disassembly: Disassembly;
	#prevInstruction: Instruction | null;

	public disassemble(fileData: FileData, instructionFactory: InstructionFactory): Disassembly
	{
		this.#reader = new BytecodeReader(fileData);
		this.#instructionFactory = instructionFactory;
		this.#disassembly = new Disassembly();
		this.#prevInstruction = null;

		this.#disassemble();

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

		const op = this.#reader.read();
		const instruction = this.#disassembleInstruction(op, address);

		if (instruction === null)
		{
			throw new Error(`Failed to disassemble opcode ${op} at ${address}`);
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

	#disassembleInstruction(op: number, address: number): Instruction | null
	{
		return this.#instructionFactory.create(op, address, this.#reader);
	}

	#processInstruction(instruction: Instruction): void
	{
		this.#validateInstruction(instruction);
		this.#addInstruction(instruction);
	}

	#validateInstruction(instruction: Instruction): void
	{
		if (instruction instanceof FunctionDeclarationInstruction)
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

	#addInstruction(instruction: Instruction): void
	{
		const prev = this.#prevInstruction;

		if (prev !== null)
		{
			prev.next = instruction;
		}

		instruction.prev = prev;
		this.#prevInstruction = instruction;

		this.#disassembly.addInstruction(instruction);
	}
};
