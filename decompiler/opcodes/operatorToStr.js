import { names, isOpcode } from '~/common/opcodes.js';


const opToStr =
{
	'OP_NOT':            '!',
	'OP_NOTF':           '!',
	'OP_ONESCOMPLEMENT': '~',
	'OP_NEG':            '<NEG>',

	'OP_ADD': '+',
	'OP_SUB': '-',
	'OP_DIV': '/',
	'OP_MUL': '*',
	'OP_MOD': '%',

	'OP_BITAND': '&',
	'OP_BITOR':  '|',
	'OP_XOR':    '^',
	'OP_SHL':    '<<',
	'OP_SHR':    '>>',

	'OP_CMPLT': '<',
	'OP_CMPGR': '>',
	'OP_CMPGE': '>=',
	'OP_CMPLE': '<=',
	'OP_CMPEQ': '==',
	'OP_CMPNE': '!=',

	'OP_COMPARE_STR': '$=',

	'OP_OR':          '||',
	'OP_AND':         '&&',
	'OP_JMPIF_NP':    '||',
	'OP_JMPIFNOT_NP': '&&',
};


/**
 * @param   {integer} op
 * @returns {string|null} null if not a valid opcode.
 */
const operatorToStr = op =>
{
	if ( !isOpcode (op) )
	{
		return null;
	}

	return opToStr[names[op]];
};


export default operatorToStr;
