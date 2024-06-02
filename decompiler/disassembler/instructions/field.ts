import { Instruction, Opcode, ReturnValueChange } from "./instruction";
import { BytecodeReader } from "../bytecodeReader";

export class ObjectInstruction extends Instruction {};
export class ObjectNewInstruction extends Instruction {};

export class FieldInstruction extends Instruction
{
	#name: string;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#name = reader.readIdentifier();
	}

	public get name(): string { return this.#name; }
};

export class FieldArrayInstruction extends Instruction {};

/* OP_LOADFIELD_* */
export class LoadFieldInstruction extends Instruction
{
	public get returnValueChange(): ReturnValueChange
	{
		return this.opcode.stringValue === "OP_LOADFIELD_STR"
			? ReturnValueChange.ToTrue
			: ReturnValueChange.NoChange;
	}
};

/* OP_SAVEFIELD_* */
export class SaveFieldInstruction extends Instruction
{
	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToTrue; }
};
