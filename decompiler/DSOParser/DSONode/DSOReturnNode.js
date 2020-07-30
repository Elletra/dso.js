import { DSOStmtNode } from '~/DSONode/DSONode.js';


class DSOReturnNode extends DSOStmtNode
{
	constructor ( value = null )
	{
		super ();
		this.value = value;
	}
}


export default DSOReturnNode;
