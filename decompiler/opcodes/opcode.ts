export enum ReturnValueChange
{
	ToFalse,
	ToTrue,
	NoChange,
};

export enum TypeReq
{
	Invalid = -1,
	None,
	UInt,
	Float,
	String,
};

// For function call instructions.
export enum CallType
{
	Invalid = -1,
	FunctionCall,
	MethodCall,
	ParentCall,
};

export class Opcode
{
	#value: number | null;
	#stringValue: string | null;
	#returnValue: ReturnValueChange;
	#typeReq: TypeReq;

	constructor(value: number | null, stringValue: string | null, returnValue: ReturnValueChange, typeReq: TypeReq)
	{
		this.#value = value;
		this.#stringValue = stringValue;
		this.#returnValue = returnValue;
		this.#typeReq = typeReq;
	}

	public get value(): number { return this.#value ?? 0; }
	public get stringValue(): string { return this.#stringValue; }
	public get returnValue(): ReturnValueChange { return this.#returnValue; }
	public get typeReq(): TypeReq { return this.#typeReq; }

	public get hasValue(): boolean { return this.#value !== null; }
	public get isValid(): boolean { return this.hasValue && this.#stringValue !== null; }
};
