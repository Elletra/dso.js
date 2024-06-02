import { Instruction, ReturnValueChange } from "./instruction";

export enum TypeReq
{
	Invalid = -1,
	None,
	UInt,
	Float,
	String,
};

export class ConvertToTypeInstruction extends Instruction
{
	public get typeReq(): TypeReq
	{
		switch(this.opcode.stringValue)
		{
			case "OP_FLT_TO_UINT":
			case "OP_STR_TO_UINT":
				return TypeReq.UInt;
				
			case "OP_UINT_TO_FLT":
			case "OP_STR_TO_FLT":
				return TypeReq.Float;

			case "OP_UINT_TO_STR":
			case "OP_FLT_TO_STR":
				return TypeReq.String;

			case "OP_FLT_TO_NONE":
			case "OP_UINT_TO_NONE":
			case "OP_STR_TO_NONE":
				return TypeReq.None;
			
			default:
				return TypeReq.Invalid;
		}
	}

	public get returnValueChange(): ReturnValueChange
	{
		switch(this.typeReq)
		{
			case TypeReq.None:
				return ReturnValueChange.ToFalse;

			case TypeReq.String:
				return ReturnValueChange.ToTrue;

			default:
				return ReturnValueChange.NoChange;
		}
	}
};
