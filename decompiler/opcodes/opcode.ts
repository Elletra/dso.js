export enum ReturnValue
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
	FunctionCall,
	MethodCall,
	ParentCall,
};

export class Opcode
{
	#value: number | null;
	#stringValue: string | null;
	#returnValue: ReturnValue;
	#typeReq: TypeReq;

	constructor(value: number | null, stringValue: string | null, returnValue: ReturnValue, typeReq: TypeReq)
	{
		this.#value = value;
		this.#stringValue = stringValue;
		this.#returnValue = returnValue;
		this.#typeReq = typeReq;
	}

	get value(): number { return this.#value ?? 0; }
	get stringValue(): string { return this.#stringValue; }
	get returnValue(): ReturnValue { return this.#returnValue; }
	get typeReq(): TypeReq { return this.#typeReq; }

	get hasValue(): boolean { return this.#value !== null; }
	get isValid(): boolean { return this.hasValue && this.#stringValue !== null; }
};
