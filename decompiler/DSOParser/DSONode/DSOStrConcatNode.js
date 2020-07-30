import { DSOExprNode } from '~/DSONode/DSONode.js';

import { PREC_CONCAT } from '~/DSONode/precedence.js';


class DSOStrConcatNode extends DSOExprNode
{
	constructor ( left, right, appendChar = null )
	{
		super ();

		this.left       = left;
		this.right      = right;
		this.appendChar = appendChar;
	}

	isAssociative ()
	{
		return true;
	}

	getPrecedence ()
	{
		return PREC_CONCAT;
	}
}


export default DSOStrConcatNode;
