import { Opcode } from "../../common/opcodes";


export class Instruction
{
	public op: Opcode;
	public addr: number;
	public operands: number[];
	public children: Instruction[];
	public parents: Instruction[];

	constructor ( op: Opcode, addr: number, ...operands: number[] )
	{
		this.op = op;
		this.addr = addr;
		this.operands = operands;
		this.children = [];
		this.parents = [];
	}

	addOperand ( operand: number )
	{
		this.operands.push (operand);
	}

	addChild ( child: Instruction )
	{
		if ( child instanceof Instruction && !this.children.includes (child) )
		{
			this.children.push (child);

			if ( !child.parents.includes (this) )
			{
				child.parents.push (this);
			}
		}
	}

	get numChildren (): number
	{
		return this.children.length;
	}

	get numParents (): number
	{
		return this.parents.length;
	}
};
