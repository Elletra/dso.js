import { DSONode } from '~/DSONode/DSONode.js';


class DSOConstantNode extends DSONode
{
	constructor ( op, value )
	{
		super ();

		this.op    = op;
		this.value = value;
	}
}


export default DSOConstantNode;
