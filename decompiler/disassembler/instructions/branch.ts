import { BytecodeReader } from "../bytecodeReader";
import { Instruction, Opcode, ReturnValueChange } from "./instruction";

/* Base class for branch instructions. */
export abstract class BranchInstruction extends Instruction
{
	#targetAddress: number;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#targetAddress = reader.read();
	}

	public get targetAddress(): number { return this.#targetAddress; }

	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToFalse; }

	protected _getToStringValues(): any[] { return super._getToStringValues().concat(this.#targetAddress); }
};

export class UnconditionalBranchInstruction extends BranchInstruction {};

export class ConditionalBranchInstruction extends BranchInstruction
{
	public get isInverse(): boolean
	{
		return this.opcode.stringValue === "OP_JMPIFNOT" || this.opcode.stringValue === "OP_JMPIFFNOT";
	}

	public get isLoopEnd(): boolean { return this.targetAddress <= this.address; }
};

export class LogicalBranchInstruction extends BranchInstruction
{
	public get operator(): string
	{
		switch(this.opcode.stringValue)
		{
			case "OP_JMPIF_NP":
				return "OR";

			case "OP_JMPIFNOT_NP":
				return "AND";

			default:
				return "INVALID";
		}
	}

	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.NoChange; }
};
