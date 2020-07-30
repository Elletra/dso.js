import assert        from '~/util/assert.js';
import operatorToStr from '~/decompiler/opcodes/operatorToStr.js';

import { pushIfTrue } from '~/util/arrays.js';


const generateVariable = function ( node )
{
	if ( node.arrayExpr === null )
	{
		return node.varName;
	}

	return [node.varName, '[', this.generateExpr (node.arrayExpr), ']'];
};

const generateSlot = function ( node )
{
	const array = [];

	if ( node.objectExpr !== null )
	{
		array.push (this.generateExpr (node.objectExpr), '.');
	}

	array.push (node.slotName);

	if ( node.arrayExpr !== null )
	{
		array.push ('[', this.generateExpr (node.arrayExpr), ']');
	}

	return array;
};

const generateAssign = function ( node )
{
	const array = [this.generateExpr (node.varSlot)];

	if ( node.operator === null )
	{
		array.push ('=');
	}
	else
	{
		const operator = operatorToStr (node.operator);

		assert (operator !== null, 'Invalid binary operator');

		array.push (operator + '=');
	}

	array.push (this.generateExpr (node.valueExpr));

	return array;
};


export { generateVariable, generateSlot, generateAssign };
