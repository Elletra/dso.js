import { createOpset } from '~/common/opcodes.js';


const associative = createOpset (
[
	'OP_ADD',
	'OP_MUL',
	'OP_BITAND',
	'OP_BITOR',
	'OP_XOR',
	'OP_AND',
	'OP_OR',
	'OP_JMPIFNOT_NP',
	'OP_JMPIF_NP',
]);


/**
 * @param   {integer} op
 * @returns {boolean}
 */
const isOpAssociative = op =>
{
	return associative.has (op);
};


export { isOpAssociative };
