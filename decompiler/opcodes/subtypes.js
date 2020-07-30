import { createOpset } from '~/common/opcodes.js';


const opcodeSubtypes =
{
	OpcodeConvert: createOpset (
	[
		'OP_STR_TO_UINT',
		'OP_STR_TO_FLT',

		'OP_FLT_TO_UINT',
		'OP_FLT_TO_STR',

		'OP_UINT_TO_FLT',
		'OP_UINT_TO_STR',
	]),

	OpcodeTypeToNone: createOpset (
	[
		'OP_STR_TO_NONE',
		'OP_STR_TO_NONE_2',
		'OP_FLT_TO_NONE',
		'OP_UINT_TO_NONE',
	]),

	OpcodeLoadImmed: createOpset (
	[
		'OP_LOADIMMED_UINT',
		'OP_LOADIMMED_FLT',
		'OP_LOADIMMED_STR',
		'OP_LOADIMMED_IDENT',
		'OP_TAG_TO_STR',
	]),

	OpcodeJump: createOpset (
	[
		'OP_JMP',
	]),

	OpcodeLoopJump: createOpset (
	[
		'OP_JMPIF',
		'OP_JMPIFF',
	]),

	OpcodeJumpIfNot: createOpset (
	[
		'OP_JMPIFNOT',
		'OP_JMPIFFNOT',
	]),

	OpcodeLogicJump: createOpset (
	[
		'OP_JMPIF_NP',
		'OP_JMPIFNOT_NP',
	]),

	OpcodeUnary: createOpset (
	[
		'OP_NOT',
		'OP_NOTF',
		'OP_ONESCOMPLEMENT',
		'OP_NEG',
	]),

	OpcodeBinary: createOpset (
	[
		'OP_ADD',
		'OP_SUB',
		'OP_DIV',
		'OP_MUL',
		'OP_MOD',

		'OP_BITAND',
		'OP_BITOR',
		'OP_XOR',
		'OP_SHL',
		'OP_SHR',

		'OP_CMPLT',
		'OP_CMPGR',
		'OP_CMPGE',
		'OP_CMPLE',
		'OP_CMPEQ',
		'OP_CMPNE',

		'OP_OR',
		'OP_AND',
	]),

	OpcodeCompareStr: createOpset (
	[
		'OP_COMPARE_STR',
	]),

	OpcodeSaveVar: createOpset (
	[
		'OP_SAVEVAR_STR',
		'OP_SAVEVAR_UINT',
		'OP_SAVEVAR_FLT',
	]),

	OpcodeLoadVar: createOpset (
	[
		'OP_LOADVAR_STR',
		'OP_LOADVAR_UINT',
		'OP_LOADVAR_FLT',
	]),

	OpcodeSaveField: createOpset (
	[
		'OP_SAVEFIELD_STR',
		'OP_SAVEFIELD_UINT',
		'OP_SAVEFIELD_FLT',
	]),

	OpcodeLoadField: createOpset (
	[
		'OP_LOADFIELD_STR',
		'OP_LOADFIELD_UINT',
		'OP_LOADFIELD_FLT',
	]),

	OpcodeSetCurVar: createOpset (
	[
		'OP_SETCURVAR',
		'OP_SETCURVAR_CREATE',
	]),

	OpcodeSetCurField: createOpset (
	[
		'OP_SETCURFIELD',
	]),

	OpcodeSetVarArr: createOpset (
	[
		'OP_SETCURVAR_ARRAY',
		'OP_SETCURVAR_ARRAY_CREATE',
	]),

	OpcodeSetFieldArr: createOpset (
	[
		'OP_SETCURFIELD_ARRAY',
	]),

	OpcodeSetCurObject: createOpset (
	[
		'OP_SETCUROBJECT',
		'OP_SETCUROBJECT_NEW',
	]),

	OpcodeStringStart: createOpset (
	[
		'OP_ADVANCE_STR',
		'OP_ADVANCE_STR_APPENDCHAR',
		'OP_ADVANCE_STR_COMMA',
	]),

	OpcodeStringEnd: createOpset (
	[
		'OP_REWIND_STR',
		'OP_TERMINATE_REWIND_STR',
	]),

	OpcodeFuncDecl: createOpset (
	[
		'OP_FUNC_DECL',
	]),

	OpcodeFuncCall: createOpset (
	[
		'OP_CALLFUNC',
		'OP_CALLFUNC_RESOLVE',
	]),

	OpcodeCreateObj: createOpset (
	[
		'OP_CREATE_OBJECT',
	]),

	OpcodeObjSection: createOpset (
	[
		'OP_ADD_OBJECT',
		'OP_END_OBJECT',
	]),

	OpcodePushFrame: createOpset (
	[
		'OP_PUSH_FRAME',
	]),

	OpcodePush: createOpset (
	[
		'OP_PUSH',
	]),

	OpcodeReturn: createOpset (
	[
		'OP_RETURN',
	]),

	// Opcodes we can skip.
	OpcodeSkip: createOpset (
	[
		'OP_ADVANCE_STR_NUL',
	]),

	// Opcodes that throw an error should we come across them.
	OpcodeError: createOpset (
	[
		'OP_INVALID',
	]),

	OpcodeMisc: createOpset (
	[
		'OP_BREAK',
	]),
};


export default opcodeSubtypes;
