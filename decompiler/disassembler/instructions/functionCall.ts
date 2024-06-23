import { Instruction, Opcode, ReturnValueChange } from "./instruction";
import { BytecodeReader } from "../bytecodeReader";

// For function call instructions.
export enum CallType
{
	Invalid = -1,
	FunctionCall,
	MethodCall,
	ParentCall,
};

export class FunctionCallInstruction extends Instruction
{
	#name: string;
	#namespace: string | null;
	#callType: CallType;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#name = reader.readIdentifier();
		this.#namespace = reader.readIdentifier();

		const callType = reader.read();

		this.#callType = Object.hasOwn(CallType, callType) ? callType : CallType.Invalid;
	}

	public get name(): string { return this.#name; }
	public get namespace(): string { return this.#namespace; }
	public get callType(): CallType { return this.#callType; }
	
	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToTrue; }

	protected _getToStringValues(): any[]
	{
		const values = super._getToStringValues();

		if (this.#namespace !== null)
		{
			values.push(this.#namespace);
		}

		values.push(this.#name, CallType[this.#callType]);

		return values;
	}
};
