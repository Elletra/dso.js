import DSOAssignNode from '~/DSONode/DSOAssignNode.js';
import DSOBinaryNode from '~/DSONode/DSOBinaryNode.js';

import assert        from '~/util/assert.js';
import operatorToStr from '~/decompiler/opcodes/operatorToStr.js';

import { enums } from '~/common/opcodes.js';

const { OP_COMPARE_STR } = enums;


const generateUnary = function ( node )
{
	let operator = operatorToStr (node.op);

	assert (operator !== null, 'Invalid unary operator');

	const { expr } = node;

	if ( operator === '!' && expr instanceof DSOBinaryNode && expr.op === OP_COMPARE_STR )
	{
		return [this.generateBranch (expr, expr.left), '!$=', this.generateBranch (expr, expr.right)];
	}

	return [operator, this.generateParens (expr)];
};

const generateBinary = function ( node )
{
	const operator = operatorToStr (node.op);

	assert (operator !== null, 'Invalid binary operator');

	return [this.generateBranch (node, node.left), operator, this.generateBranch (node, node.right)];
};


export { generateUnary, generateBinary };
