import assert from '~/util/assert.js';

import { DSONode, DSOStmtNode } from '~/DSONode/DSONode.js';

import { PREC_TERNARY } from '~/DSONode/precedence.js';


class DSOConditionalNode extends DSONode
{
	constructor ( testExpr, ifBlock, elseBlock = null )
	{
		super ();

		this.testExpr  = testExpr;
		this.ifBlock   = ifBlock;
		this.elseBlock = elseBlock;
	}

	/**
	 * A gross hack to prevent this from being returned when it's inappropriate to do so.
	 *
	 * A better way would be to determine each commands' data type from the beginning and whether
	 * or not that data type is returnable, but this'll do for now.
	 */
	isReturnable ()
	{
		const { ifBlock, elseBlock } = this;

		if ( ifBlock.length !== 1 || elseBlock === null || elseBlock.length !== 1 )
		{
			return false;
		}

		const firstIf   = ifBlock[0];
		const firstElse = elseBlock[0];

		if ( firstIf instanceof DSOStmtNode || firstElse instanceof DSOStmtNode )
		{
			return false;
		}

		let returnable = true;

		if ( firstIf instanceof DSOConditionalNode )
		{
			returnable = firstIf.isReturnable ();
		}

		if ( returnable && firstElse instanceof DSOConditionalNode )
		{
			returnable = firstElse.isReturnable ();
		}

		return returnable;
	}

	getPrecedence ()
	{
		return PREC_TERNARY;
	}
}


export default DSOConditionalNode;
