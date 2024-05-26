import { FileData } from "../loader/fileData";
import { Opcode } from "../opcodes/opcode";
import { OpcodeFactory } from "../opcodes/opcodeFactory";
import { BytecodeReader } from "./bytecodeReader";
import { Disassembly } from "./disassembly";
import { BranchInstruction, FunctionInstruction, Instruction } from "./instructions/instruction";
import { InstructionBuilder } from "./instructions/instructionBuilder";

export class Disassembler
{
	#factory: OpcodeFactory;
	#builder: InstructionBuilder;
	#reader: BytecodeReader;
	#disassembly: Disassembly;

	public disassemble(fileData: FileData, opcodes: string[], opcodeTypes: Record<string, string>): Disassembly
	{
		this.#reader = new BytecodeReader(fileData);
		this.#factory = new OpcodeFactory(opcodes);
		this.#builder = new InstructionBuilder(this.#reader, opcodeTypes);
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
		const opcode = this.#factory.create(value);

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
		if (this.#reader.inFunction && address >= (this.#reader.function as FunctionInstruction).endAddress)
		{
			this.#reader.function = null;
		}
	}

	#disassembleOpcode(opcode: Opcode, address: number): Instruction | null
	{
		return this.#builder.buildInstruction(opcode, address);
	}

	#processInstruction(instruction: Instruction): void
	{
		this.#validateInstruction(instruction);
		this.#builder.setReturnableValue(instruction);
		this.#addInstruction(instruction);
	}

	#validateInstruction(instruction: Instruction): void
	{
		switch (instruction.type)
		{
			case "FunctionDeclaration":
				const func = instruction as FunctionInstruction;

				if (func.hasBody)
				{
					// TODO: Maybe support nested functions someday??
					if (this.#reader.inFunction)
					{
						throw new Error(`Nested function at ${func.address}`);
					}

					if (func.endAddress >= this.#reader.size)
					{
						throw new Error(`Function at ${func.address} has invalid end address ${func.endAddress}`);
					}

					this.#reader.function = func;
				}

				break;
			
			case "UnconditionalBranch":
			case "ConditionalBranch":
			case "ConditionalNotBranch":
			case "ConditionalLogicalBranch":
				const branch = instruction as BranchInstruction;

				if (this.#reader.inFunction)
				{
					const { address, targetAddress } = branch;
					const { function: func } = this.#reader;

					if (targetAddress <= func.address || targetAddress >= func.endAddress)
					{
						throw new Error(`Branch at ${address} jumps out of function to ${targetAddress}`);
					}
				}

				break;
			
			default:
				break;
		}
	}

	#addInstruction(instruction: Instruction): void { this.#disassembly.addInstruction(instruction); }

	#markBranchTargets(): void
	{
		for (const instruction of this.#disassembly.getInstructions())
		{
			switch (instruction.type)
			{
				case "UnconditionalBranch":
				case "ConditionalBranch":
				case "ConditionalNotBranch":
				case "ConditionalLogicalBranch":
					this.#disassembly.addBranchTarget((instruction as BranchInstruction).targetAddress);
					break;
				
				default:
					break;
			}
		}
	}
};
