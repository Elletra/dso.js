import { enums as $ } from '~/common/opcodes.js';


const arr =
[
	[$.OP_NOT, $.OP_NOTF, $.OP_ONESCOMPLEMENT, $.OP_NEG],
	[$.OP_MUL, $.OP_DIV,  $.OP_MOD],
	[$.OP_ADD, $.OP_SUB],
	[$.OP_SHL, $.OP_SHR],
	[$.OP_COMPARE_STR],
	[$.OP_CMPLT, $.OP_CMPLE, $.OP_CMPGR, $.OP_CMPGE],
	[$.OP_CMPEQ, $.OP_CMPNE],
	[$.OP_BITAND],
	[$.OP_XOR],
	[$.OP_BITOR],
	[$.OP_AND, $.OP_JMPIFNOT_NP],
	[$.OP_OR,  $.OP_JMPIF_NP],
];

const precedence = new Map ();

for ( let prec = 0; prec < arr.length; prec++ )
{
	const row = arr[prec];

	for ( let i = 0; i < row.length; i++ )
	{
		// +1 because function calls, member access, etc. are 0
		precedence.set (row[i], prec + 1);
	}
}

/**
 * @param   {integer} op
 * @returns {integer} Infinity if no precedence specified.
 */
const getOpPrecedence = op =>
{
	if ( precedence.has (op) )
	{
		return precedence.get (op);
	}

	return Infinity;
};


export { getOpPrecedence };
