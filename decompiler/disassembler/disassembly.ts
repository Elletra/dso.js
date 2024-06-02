import { Instruction } from "./instructions/instruction";
import { FunctionDeclarationInstruction } from "./instructions/functionDeclaration";

export class Disassembly
{
	#instructions: Map<number, Instruction> = new Map();
	#branchTargets: Set<number> = new Set();

	public addInstruction(instruction: Instruction): Instruction
	{
		this.#instructions.set(instruction.address, instruction);

		return instruction;
	}

	public getInstruction(address: number): Instruction
	{
		return this.hasInstruction(address) ? this.#instructions.get(address) : null;
	}

	public hasInstruction(address: number): boolean { return this.#instructions.has(address); }

	public getInstructions(): Instruction[]
	{
		const instructions = [...this.#instructions.values()];

		// TODO: If recursive descent disassembly is ever implemented, this will not work.
		return instructions.sort((insn1, insn2) => insn1.address - insn2.address);
	}

	// Split instructions by function/block.
	public getSplitInstructions(): Instruction[][]
	{
		const split: Instruction[][] = [];
		let instructions: Instruction[] = [];
		let functionEnd = -1;

		for (const instruction of this.getInstructions())
		{
			if (functionEnd >= 0 && instruction.address >= functionEnd)
			{
				split.push(instructions);

				instructions = [];
				functionEnd = -1;
			}

			if (instruction instanceof FunctionDeclarationInstruction)
			{
				if (instructions.length > 0)
				{
					split.push(instructions);
				}

				instructions = [];
				functionEnd = instruction.endAddress;
			}

			instructions.push(instruction);
		}

		if (instructions.length > 0)
		{
			split.push(instructions);
		}

		return split;
	}

	public addBranchTarget(address: number): void { this.#branchTargets.add(address); }
	public hasBranchTarget(address: number): boolean { return this.#branchTargets.has(address); }
};
