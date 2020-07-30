import { createOpset } from '~/common/opcodes.js';


const opcodeTypes =
{
	// Opcodes with no additional values.
	OpcodeSingle: createOpset (
	[
		'OP_STR_TO_UINT',
		'OP_STR_TO_FLT',
		'OP_STR_TO_NONE',
		'OP_STR_TO_NONE_2',
		'OP_FLT_TO_UINT',
		'OP_FLT_TO_STR',
		'OP_FLT_TO_NONE',
		'OP_UINT_TO_FLT',
		'OP_UINT_TO_STR',
		'OP_UINT_TO_NONE',
		'OP_NOT',
		'OP_NOTF',
		'OP_ONESCOMPLEMENT',
		'OP_NEG',
		'OP_ADD',
		'OP_SUB',
		'OP_DIV',
		'OP_MUL',
		'OP_XOR',
		'OP_MOD',
		'OP_BITAND',
		'OP_BITOR',
		'OP_CMPLT',
		'OP_CMPGR',
		'OP_CMPGE',
		'OP_CMPLE',
		'OP_CMPEQ',
		'OP_CMPNE',
		'OP_OR',
		'OP_AND',
		'OP_SHR',
		'OP_SHL',
		'OP_COMPARE_STR',
		'OP_SAVEVAR_STR',
		'OP_SAVEVAR_UINT',
		'OP_SAVEVAR_FLT',
		'OP_LOADVAR_STR',
		'OP_LOADVAR_UINT',
		'OP_LOADVAR_FLT',
		'OP_SAVEFIELD_STR',
		'OP_SAVEFIELD_UINT',
		'OP_SAVEFIELD_FLT',
		'OP_LOADFIELD_STR',
		'OP_LOADFIELD_UINT',
		'OP_LOADFIELD_FLT',
		'OP_ADVANCE_STR_NUL',
		'OP_SETCURVAR_ARRAY',
		'OP_SETCURVAR_ARRAY_CREATE',
		'OP_SETCURFIELD_ARRAY',
		'OP_SETCUROBJECT',
		'OP_SETCUROBJECT_NEW',
		'OP_PUSH_FRAME',
		'OP_PUSH',
		'OP_RETURN',
		'OP_BREAK',
	]),

	// Opcodes with a single value after them.
	OpcodeSinglePrefix: createOpset (
	[
		'OP_LOADIMMED_UINT',
		'OP_LOADIMMED_FLT',
		'OP_LOADIMMED_STR',
		'OP_LOADIMMED_IDENT',
		'OP_TAG_TO_STR',

		'OP_JMP',

		'OP_JMPIF',
		'OP_JMPIFF',

		'OP_JMPIF_NP',
		'OP_JMPIFNOT_NP',

		'OP_SETCURVAR',
		'OP_SETCURVAR_CREATE',
		'OP_SETCURFIELD',

		'OP_ADD_OBJECT',
		'OP_END_OBJECT',
	]),

	// Opcodes with three values after them.
	OpcodeTriplePrefix: createOpset (
	[
		'OP_CALLFUNC',
		'OP_CALLFUNC_RESOLVE',
		'OP_CREATE_OBJECT',
	]),

	// Opcodes that start a string section.
	OpcodeStringStart: createOpset (
	[
		'OP_ADVANCE_STR',
		'OP_ADVANCE_STR_APPENDCHAR',
		'OP_ADVANCE_STR_COMMA',
	]),

	// Opcodes that end a string section.
	OpcodeStringEnd: createOpset (
	[
		'OP_REWIND_STR',
		'OP_TERMINATE_REWIND_STR',
	]),

	// Opcodes that start a loop or conditional.
	OpcodeJumpIfNot: createOpset (
	[
		'OP_JMPIFNOT',
		'OP_JMPIFFNOT',
	]),

	// Special type for the function declaration opcode just because it's so different.
	OpcodeFuncDecl: createOpset (
	[
		'OP_FUNC_DECL',
	]),

	// Opcodes that throw an error should we come across them.
	OpcodeError: createOpset (
	[
		'OP_INVALID',
	]),
};


export default opcodeTypes;
