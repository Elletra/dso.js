import { Instruction } from "../disassembler/Instruction";


export class CfgNode
{
	public addr: number;
	public instructions: Instruction[];
	public children: CfgNode[];
	public parents: CfgNode[];
	public order: number;

	constructor ( addr: number, ...instructions: Instruction[] )
	{
		this.addr = addr;
		this.instructions = instructions;
		this.children = [];
		this.parents = [];
		this.order = -1;
	}

	addInstruction ( instruction: Instruction )
	{
		this.instructions.push (instruction);
	}

	lastInstruction (): Instruction
	{
		const { instructions } = this;

		return instructions.length > 0 ? instructions[instructions.length - 1] : null;
	}

	addChild ( child: CfgNode )
	{
		if ( child instanceof CfgNode && !this.children.includes (child) )
		{
			this.children.push (child);

			if ( !child.parents.includes (this) )
			{
				child.parents.push (this);
			}
		}
	}
};

export class ControlFlowGraph
{
	public root: CfgNode
	private _nodes: Map<number, CfgNode>;

	constructor ( root: CfgNode, nodes: Map<number, CfgNode> )
	{
		this.root = root;
		this._nodes = nodes;
	}

	nodeAt ( addr: number ): CfgNode
	{
		return this.hasNodeAt (addr) ? this._nodes.get (addr) : null;
	}

	hasNodeAt ( addr: number )
	{
		return this._nodes.has (addr);
	}

	get size (): number
	{
		return this._nodes.size;
	}

	[Symbol.iterator] ()
	{
		return this._nodes.entries ();
	}
};
