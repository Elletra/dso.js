import { DSONode } from '~/DSONode/DSONode.js';


class DSOSlotNode extends DSONode
{
	constructor ( slotName, objectExpr = null, arrayExpr = null )
	{
		super ();

		this.slotName   = slotName;
		this.objectExpr = objectExpr;
		this.arrayExpr  = arrayExpr;
	}
}


export default DSOSlotNode;
