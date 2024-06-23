import { Instruction, Opcode, ReturnValueChange } from "./instruction";
import { BytecodeReader } from "../bytecodeReader";

export class VariableInstruction extends Instruction
{
	#name: string;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#name = reader.readIdentifier();
	}

	public get(): string { return this.#name; }

	protected _getToStringValues(): any[] { return super._getToStringValues().concat(this.#name); }
};

export class VariableArrayInstruction extends Instruction {};

/* OP_LOADVAR_* */
export class LoadVariableInstruction extends Instruction
{
	public get returnValueChange(): ReturnValueChange
	{
		return this.opcode.stringValue === "OP_LOADVAR_STR"
			? ReturnValueChange.ToTrue
			: ReturnValueChange.NoChange;
	}
};

/* OP_SAVEVAR_* */
export class SaveVariableInstruction extends Instruction
{
	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToTrue; }
};
