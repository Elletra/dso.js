import { Instruction } from "../disassembler/Instruction";
import { Digraph } from "../../common/util/Digraph";


export class CfgNode
{
	public addr: number;
	public instructions: Instruction[];
	public postorder: number;

	constructor ( addr: number, ...instructions: Instruction[] )
	{
		this.addr = addr;
		this.instructions = instructions;
		this.postorder = -1;
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

	*[Symbol.iterator] ()
	{
		const { instructions } = this;
		const { length } = instructions;

		for ( let i = 0; i < length; i++ )
		{
			yield instructions[i] as Instruction;
		}
	}
};

export class ControlFlowGraph extends Digraph<number, CfgNode>
{
	public root: number;

	constructor ( root: number )
	{
		super ();
		this.root = root;
	}

	rootNode (): CfgNode
	{
		return this.node (this.root);
	}
};
