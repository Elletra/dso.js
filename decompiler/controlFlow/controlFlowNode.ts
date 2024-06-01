import { FunctionInstruction, Instruction } from "../disassembler/instructions/instruction";

export class ControlFlowNode
{
	public predecessors: ControlFlowNode[] = [];
	public successors: ControlFlowNode[] = [];
	public instructions: Instruction[] = [];
	public immediateDom: ControlFlowNode = null;
	public reversePostorder: number = -1;

	// A hack for an edge case where a function declaration follows a conditional. We insert a
	// dummy node for the next address so they connect properly.
	public isDummyNode: boolean = false;

	#address: number;

	constructor(address: number)
	{
		this.#address = address;
	}

	public get address(): number { return this.#address; }

	public get firstInstruction(): Instruction | null
	{
		return this.instructions.length > 0 ? this.instructions.at(0) : null;
	}

	public get lastInstruction(): Instruction | null
	{
		return this.instructions.length > 0 ? this.instructions.at(-1) : null;
	}

	public get functionInstruction(): FunctionInstruction | null
	{
		return this.firstInstruction instanceof FunctionInstruction ? this.firstInstruction : null;
	}

	public get isFunction(): boolean { return this.functionInstruction !== null; }

	public addInstruction(instruction: Instruction): Instruction
	{
		this.instructions.push(instruction);

		return instruction;
	}

	public addEdgeTo(node: ControlFlowNode): void
	{
		if (!this.successors.includes(node) && node !== null)
		{
			this.successors.push(node);
			node.predecessors.push(this);
		}
	}

	public removeEdgeTo(node: ControlFlowNode): void
	{
		if (this.successors.includes(node))
		{
			this.successors.splice(this.successors.indexOf(node), 1);
		}

		if (node.predecessors.includes(this))
		{
			node.predecessors.splice(node.predecessors.indexOf(this), 1);
		}
	}

	public getPredecessor(index: number): ControlFlowNode | null
	{
		return this.predecessors.length > index ? this.predecessors[index] : null;
	}

	public getSuccessor(index: number): ControlFlowNode | null
	{
		return this.successors.length > index ? this.successors[index] : null;
	}

	public hasPredecessor(node: ControlFlowNode): boolean { return this.predecessors.includes(node); }
	public hasSuccessor(node: ControlFlowNode): boolean { return this.successors.includes(node); }

	public dominates(target: ControlFlowNode, strictly: boolean = false)
	{
		if (!(target instanceof ControlFlowNode))
		{
			return false;
		}

		if (this === target)
		{
			return !strictly;
		}

		let dom = target.immediateDom;

		while (dom !== this && dom !== null && dom !== dom.immediateDom)
		{
			dom = dom.immediateDom;
		}

		return dom === this;
	}

	public isLoopStart(): boolean { return this.dominates(this.getPredecessor(1)); }
	public isLoopEnd(): boolean { return this.getSuccessor(1)?.dominates(this) ?? false; }
};
