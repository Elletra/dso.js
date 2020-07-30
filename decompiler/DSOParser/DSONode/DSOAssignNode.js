import { DSOExprNode } from '~/DSONode/DSONode.js';

import { PREC_ASSIGN } from '~/DSONode/precedence.js';


class DSOAssignNode extends DSOExprNode
{
	constructor ( varSlot, valueExpr, operator = null )
	{
		super ();

		this.varSlot   = varSlot;
		this.valueExpr = valueExpr;
		this.operator  = operator;
	}

	getPrecedence ()
	{
		return PREC_ASSIGN;
	}
}


export default DSOAssignNode;
