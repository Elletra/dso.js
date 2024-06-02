import { Opcode } from "./opcode";
import { BytecodeReader } from "../bytecodeReader";

import
{
	Instruction,
	FunctionInstruction,

	CreateObjectInstruction, AddObjectInstruction, EndObjectInstruction,
	UnconditionalBranchInstruction, ConditionalBranchInstruction, LogicalBranchInstruction,

	ReturnInstruction,

	BinaryInstruction, BinaryStringInstruction,
	UnaryInstruction,

	VariableInstruction, VariableArrayInstruction,
	LoadVariableInstruction, SaveVariableInstruction,

	ObjectInstruction, ObjectNewInstruction,

	FieldInstruction, FieldArrayInstruction,
	LoadFieldInstruction, SaveFieldInstruction,

	ConvertToTypeInstruction,

	UIntInstruction, FloatInstruction, IdentifierInstruction, StringInstruction, TaggedStringInstruction,

	FunctionCallInstruction,

	AdvanceStringInstruction, AdvanceAppendInstruction, AdvanceCommaInstruction, AdvanceNullInstruction,
	RewindStringInstruction, TerminateRewindInstruction,

	PushInstruction, PushFrameInstruction,

	DebugBreakInstruction,
	UnusedInstruction,

}
from "./instruction";

export class InstructionFactory
{
	#opcodes: string[];

	constructor(opcodes: string[])
	{
		this.#opcodes = [...opcodes];
	}

	create(op: number, address: number, reader: BytecodeReader): Instruction
	{
		let opcode: Opcode = null;
		let instruction: Instruction = null;

		opcode = this.#createOpcode(op, address);

		if (opcode !== null)
		{
			const instructionClass = this._getClass(opcode);

			if (instructionClass !== null)
			{
				instruction = new instructionClass(opcode, address, reader);
			}
		}

		return instruction;
	}

	#createOpcode(op: number, address: number): Opcode | null
	{
		return (Number.isInteger(op) && op >= 0 && op < this.#opcodes.length)
			? new Opcode(op, this.#opcodes.at(op))
			: null;
	}

	protected _getClass(opcode: Opcode): typeof Instruction | null
	{
		switch (opcode.stringValue)
		{
			case "OP_FUNC_DECL": return FunctionInstruction;
			case "OP_CREATE_OBJECT": return CreateObjectInstruction;
			case "OP_ADD_OBJECT": return AddObjectInstruction;
			case "OP_END_OBJECT": return EndObjectInstruction;

			case "OP_JMP": return UnconditionalBranchInstruction;

			case "OP_JMPIF":
			case "OP_JMPIFF":
			case "OP_JMPIFNOT":
			case "OP_JMPIFFNOT":
				return ConditionalBranchInstruction;

			case "OP_JMPIF_NP":
			case "OP_JMPIFNOT_NP":
				return LogicalBranchInstruction;

			case "OP_RETURN": return ReturnInstruction;

			case "OP_ADD":
			case "OP_SUB":
			case "OP_MUL":
			case "OP_DIV":
			case "OP_XOR":
			case "OP_MOD":
			case "OP_BITAND":
			case "OP_BITOR":
			case "OP_SHR":
			case "OP_SHL":
			case "OP_AND":
			case "OP_OR":
			case "OP_CMPEQ":
			case "OP_CMPGR":
			case "OP_CMPGE":
			case "OP_CMPLT":
			case "OP_CMPLE":
			case "OP_CMPNE":
				return BinaryInstruction;

			case "OP_COMPARE_STR":
				return BinaryStringInstruction;

			case "OP_NOT":
			case "OP_NOTF":
			case "OP_ONESCOMPLEMENT":
			case "OP_NEG":
				return UnaryInstruction;

			case "OP_SETCURVAR":
			case "OP_SETCURVAR_CREATE":
				return VariableInstruction;

			case "OP_SETCURVAR_ARRAY":
			case "OP_SETCURVAR_ARRAY_CREATE":
				return VariableArrayInstruction;

			case "OP_LOADVAR_UINT":
			case "OP_LOADVAR_FLT":
			case "OP_LOADVAR_STR":
				return LoadVariableInstruction;

			case "OP_SAVEVAR_UINT":
			case "OP_SAVEVAR_FLT":
			case "OP_SAVEVAR_STR":
				return SaveVariableInstruction;

			case "OP_SETCUROBJECT": return ObjectInstruction;
			case "OP_SETCUROBJECT_NEW": return ObjectNewInstruction;
			case "OP_SETCURFIELD": return FieldInstruction;
			case "OP_SETCURFIELD_ARRAY": return FieldArrayInstruction;

			case "OP_LOADFIELD_UINT":
			case "OP_LOADFIELD_FLT":
			case "OP_LOADFIELD_STR":
				return LoadFieldInstruction;

			case "OP_SAVEFIELD_UINT":
			case "OP_SAVEFIELD_FLT":
			case "OP_SAVEFIELD_STR":
				return SaveFieldInstruction;

			case "OP_STR_TO_UINT":
			case "OP_STR_TO_FLT":
			case "OP_STR_TO_NONE":
			case "OP_FLT_TO_UINT":
			case "OP_FLT_TO_STR":
			case "OP_FLT_TO_NONE":
			case "OP_UINT_TO_FLT":
			case "OP_UINT_TO_STR":
			case "OP_UINT_TO_NONE":
				return ConvertToTypeInstruction;

			case "OP_LOADIMMED_UINT": return UIntInstruction;
			case "OP_LOADIMMED_FLT": return FloatInstruction;
			case "OP_LOADIMMED_IDENT": return IdentifierInstruction;
			case "OP_LOADIMMED_STR": return StringInstruction;
			case "OP_TAG_TO_STR": return TaggedStringInstruction;

			case "OP_CALLFUNC":
			case "OP_CALLFUNC_RESOLVE":
				return FunctionCallInstruction;

			case "OP_ADVANCE_STR": return AdvanceStringInstruction;
			case "OP_ADVANCE_STR_APPENDCHAR": return AdvanceAppendInstruction;
			case "OP_ADVANCE_STR_COMMA": return AdvanceCommaInstruction;
			case "OP_ADVANCE_STR_NUL": return AdvanceNullInstruction;
			case "OP_REWIND_STR": return RewindStringInstruction;
			case "OP_TERMINATE_REWIND_STR": return TerminateRewindInstruction;

			case "OP_PUSH": return PushInstruction;
			case "OP_PUSH_FRAME": return PushFrameInstruction;

			case "OP_BREAK": return DebugBreakInstruction;

			case "OP_UNUSED1":
			case "OP_UNUSED2":
			case "OP_UNUSED3":
				return UnusedInstruction;

			case "OP_INVALID":
			default:
				return null;
		}
	}
};
