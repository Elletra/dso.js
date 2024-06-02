import { Instruction, ReturnValueChange, Opcode } from "./instruction";
import { BytecodeReader } from "../bytecodeReader";

/* Base class for immediate instructions. */
export abstract class ImmediateInstruction<T> extends Instruction
{
	#value: T;

	public get value(): T { return this.#value; }
	protected set _value(value: T) { this.#value = value; }

	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToTrue; }
};

export class UIntInstruction extends ImmediateInstruction<number>
{
	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this._value = reader.read();
	}
};

export class FloatInstruction extends ImmediateInstruction<number>
{
	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this._value = reader.readFloat();
	}
};

export class IdentifierInstruction extends ImmediateInstruction<string>
{
	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this._value = reader.readIdentifier();
	}
};

export class StringInstruction extends ImmediateInstruction<string>
{
	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this._value = reader.readString();
	}
};

export class TaggedStringInstruction extends ImmediateInstruction<string>
{
	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this._value = reader.readString();
	}
};
