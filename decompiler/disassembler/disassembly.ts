import { Instruction } from "./instructions/instruction";

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
		instructions.sort((insn1, insn2) => insn1.address - insn2.address);

		return instructions;
	}

	public addBranchTarget(address: number): void { this.#branchTargets.add(address); }
	public hasBranchTarget(address: number): boolean { return this.#branchTargets.has(address); }
};
