import { Instruction } from "../disassembler/Instruction";


export class Node
{
	public addr: number;
	public instructions: Instruction[];
	public children: Node[];
	public parents: Node[];

	constructor ( addr: number, ...instructions: Instruction[] )
	{
		this.addr = addr;
		this.instructions = instructions;
		this.children = [];
		this.parents = [];
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

	addChild ( child: Node )
	{
		if ( child instanceof Node && !this.children.includes (child) )
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
	public entryPoint: Node

	constructor ( entryPoint: Node )
	{
		this.entryPoint = entryPoint;
	}
};
