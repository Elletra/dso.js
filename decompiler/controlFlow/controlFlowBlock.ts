import { UnconditionalBranchInstruction } from "../disassembler/instructions/branch";
import { Instruction } from "../disassembler/instructions/instruction";

export enum UnconditionalBranchType
{
	Unknown = -1,
	IfElse,
	Continue,
	Break,
}

export type UnconditionalBranch =
{
	type: UnconditionalBranchType;
	address: number;
	targetAddress: number;
}

export enum ControlFlowBlockType
{
	Default,
	Conditional,
	LogicalOperator,
	Loop,
};

export class ControlFlowBlock
{
	public type: ControlFlowBlockType = ControlFlowBlockType.Default;
	public parent: ControlFlowBlock = null;
	public children: ControlFlowBlock[] = [];
	public branches = new Map<number, UnconditionalBranch>();
	public continuePoint: number = -1;

	#start: Instruction;
	#end: Instruction;

	constructor(start: Instruction, end: Instruction, parent: ControlFlowBlock | null = null)
	{
		this.#start = start;
		this.#end = end;
		this.parent = parent;
	}

	public get start(): Instruction { return this.#start; }
	public get end(): Instruction { return this.#end; }
	public get isRoot(): boolean { return this.parent === null; }

	public addChild(child: ControlFlowBlock): ControlFlowBlock
	{
		this.children.push(child);
		child.parent = this;

		return child;
	}

	public addBranch(instruction: UnconditionalBranchInstruction): UnconditionalBranch
	{
		const branch: UnconditionalBranch =
		{
			type: UnconditionalBranchType.Unknown,
			address: instruction.address,
			targetAddress: instruction.targetAddress,
		};

		this.branches.set(branch.address, branch);

		return branch;
	}

	public findParentLoop(): ControlFlowBlock | null
	{
		if (this.parent === null)
		{
			return null;
		}

		if (this.parent.type === ControlFlowBlockType.Loop)
		{
			return this.parent;
		}

		return this.parent.findParentLoop();
	}
};
