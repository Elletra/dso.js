import assert from '~/util/assert.js';

import { DSOExprNode } from '~/DSONode/DSONode.js';

import { getOpPrecedence } from '~/decompiler/opcodes/precedence.js';
import { isOpAssociative } from '~/decompiler/opcodes/associativity.js';


class DSOBinaryNode extends DSOExprNode
{
	constructor ( left, right, op )
	{
		super ();

		this.left  = left;
		this.right = right;
		this.op    = op;
	}

	isAssociative ()
	{
		return isOpAssociative (this.op);
	}

	getPrecedence ()
	{
		return getOpPrecedence (this.op);
	}
}


export default DSOBinaryNode;
