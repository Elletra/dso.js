import { Opcode, ReturnValue, TypeReq } from "./opcode";

export class OpcodeFactory
{
	#opcodes: string[];

	constructor(opcodes: string[])
	{
		this.#opcodes = [...opcodes];
	}

	create(value: number): Opcode
	{
		const str = (value !== null && value < this.#opcodes.length) ? this.#opcodes[value] : null;

		return new Opcode(str !== null ? value : null, str, this.#getReturnValue(str), this.#getTypeReq(str));
	}

	#getReturnValue(opcodeStr: string): ReturnValue
	{
		switch (opcodeStr)
		{
			case "OP_STR_TO_NONE":
			case "OP_FLT_TO_NONE":
			case "OP_UINT_TO_NONE":
			case "OP_RETURN":
			case "OP_JMPIF":
			case "OP_JMPIFF":
			case "OP_JMPIFNOT":
			case "OP_JMPIFFNOT":
				return ReturnValue.ToFalse;

			case "OP_LOADVAR_STR":
			case "OP_SAVEVAR_UINT":
			case "OP_SAVEVAR_FLT":
			case "OP_SAVEVAR_STR":
			case "OP_LOADFIELD_STR":
			case "OP_SAVEFIELD_UINT":
			case "OP_SAVEFIELD_FLT":
			case "OP_SAVEFIELD_STR":
			case "OP_FLT_TO_STR":
			case "OP_UINT_TO_STR":
			case "OP_LOADIMMED_UINT":
			case "OP_LOADIMMED_FLT":
			case "OP_TAG_TO_STR":
			case "OP_LOADIMMED_STR":
			case "OP_LOADIMMED_IDENT":
			case "OP_CALLFUNC":
			case "OP_CALLFUNC_RESOLVE":
			case "OP_REWIND_STR":
				return ReturnValue.ToTrue;

			default:
				return ReturnValue.NoChange;
		}
	}

	#getTypeReq(opcodeStr: string): TypeReq
	{
		switch (opcodeStr)
		{
			case "OP_STR_TO_UINT":
			case "OP_FLT_TO_UINT":
				return TypeReq.UInt;

			case "OP_STR_TO_FLT":
			case "OP_UINT_TO_FLT":
				return TypeReq.Float;

			case "OP_FLT_TO_STR":
			case "OP_UINT_TO_STR":
				return TypeReq.String;

			case "OP_STR_TO_NONE":
			case "OP_FLT_TO_NONE":
			case "OP_UINT_TO_NONE":
				return TypeReq.None;

			default:
				return TypeReq.Invalid;
		}
	}
};
