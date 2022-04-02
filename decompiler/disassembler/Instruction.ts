import { Opcode } from "../../common/opcodes";


export class Instruction
{
	public op: Opcode;
	public addr: number;
	public operands: number[];

	constructor ( op: Opcode, addr: number, ...operands: number[] )
	{
		this.op = op;
		this.addr = addr;
		this.operands = operands;
	}

	addOperand ( operand: number )
	{
		this.operands.push (operand);
	}
};
