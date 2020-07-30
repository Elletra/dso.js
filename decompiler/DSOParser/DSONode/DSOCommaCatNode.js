import { DSOExprNode } from '~/DSONode/DSONode.js';


class DSOCommaCatNode extends DSOExprNode
{
	constructor ( left, right )
	{
		super ();

		this.left  = left;
		this.right = right;

		this.inParens = false;
	}
}


export default DSOCommaCatNode;
