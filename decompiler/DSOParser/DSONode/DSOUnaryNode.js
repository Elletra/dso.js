import { DSOExprNode } from '~/DSONode/DSONode.js';


class DSOUnaryNode extends DSOExprNode
{
	constructor ( op, expr )
	{
		super ();

		this.op   = op;
		this.expr = expr;

		this.inParens = false;
	}
}


export default DSOUnaryNode;
