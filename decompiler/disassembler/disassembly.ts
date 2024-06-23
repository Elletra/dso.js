import { BranchInstruction } from "./instructions/branch";
import { Instruction } from "./instructions/instruction";

export class Disassembly
{
	#array: Instruction[] = [];
	#map = new Map<number, Instruction>();
	#branches = new Set<BranchInstruction>();

	public get firstInstruction(): Instruction | null { return this.#array.at(0) ?? null; }
	public get lastInstruction(): Instruction | null { return this.#array.at(-1) ?? null; }

	public addInstruction(instruction: Instruction): Instruction
	{
		this.#array.push(instruction);
		this.#map.set(instruction.address, instruction);

		if (instruction instanceof BranchInstruction)
		{
			this.#branches.add(instruction);
		}

		return instruction;
	}

	public getInstruction(address: number): Instruction
	{
		return this.hasInstruction(address) ? this.#map.get(address) : null;
	}

	public hasInstruction(address: number): boolean { return this.#map.has(address); }
	public getInstructions(): Instruction[] { return this.#array.slice(); }

	public getBranches(): IterableIterator<BranchInstruction>
	{
		return this.#branches.values();
	}
};
