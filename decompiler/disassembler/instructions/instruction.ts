import { BytecodeReader } from "../bytecodeReader";

export enum ReturnValueChange
{
	ToFalse,
	ToTrue,
	NoChange,
};

export class Opcode
{
	#value: number | null;
	#stringValue: string | null;

	constructor(value: number | null, stringValue: string | null)
	{
		this.#value = value;
		this.#stringValue = stringValue;
	}

	public get value(): number { return this.#value ?? -1; }
	public get stringValue(): string { return this.#stringValue; }

	public get hasValue(): boolean { return this.#value !== null; }
	public get isValid(): boolean { return this.hasValue && this.#stringValue !== null; }

	public toString(): string { return this.stringValue; }
};

/**
 * There's a bunch of empty subclasses of `Instruction` in order to let `ASTBuilder` use classes
 * instead of checking opcodes, which is much better.
 *
 * I know it's not the most elegant solution, and I feel kind of gross about it, but I think
 * it's okay...
 */

/**
 * Base instruction class.
 *
 * Instructions are doubly-linked lists to make analysis easier.
 */
export class Instruction
{
	#opcode: Opcode;
	#address: number;

	public prev: Instruction | null = null;
	public next: Instruction | null = null;

	constructor(opcode: Opcode, address: number, _reader: BytecodeReader)
	{
		this.#opcode = opcode;
		this.#address = address;
	}

	public get opcode(): Opcode { return this.#opcode; }
	public get address(): number { return this.#address; }

	public get isStart(): boolean { return this.prev === null; }
	public get isEnd(): boolean { return this.next === null; }

	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.NoChange; }

	protected _getToStringValues(): any[] { return [this.#address, this.#opcode]; }

	public toString(): string { return `[${this.constructor.name}, ${this._getToStringValues().join(", ")}]`; }
};
