import { Instruction, Opcode, ReturnValueChange } from "./instruction";
import { BytecodeReader } from "../bytecodeReader";

export class ReturnInstruction extends Instruction
{
	#returnsValue: boolean;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#returnsValue = reader.returnableValue;
	}

	public get returnsValue(): boolean { return this.#returnsValue; }
	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToFalse; }

	protected _getToStringValues(): any[] { return super._getToStringValues().concat(this.#returnsValue); }
};
