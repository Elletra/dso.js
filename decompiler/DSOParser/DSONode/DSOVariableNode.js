import { DSONode } from '~/DSONode/DSONode.js';


class DSOVariableNode extends DSONode
{
	constructor ( varName, arrayExpr = null )
	{
		super ();

		this.varName   = varName;
		this.arrayExpr = arrayExpr;
	}
}


export default DSOVariableNode;
