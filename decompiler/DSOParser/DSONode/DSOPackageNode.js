import { DSOStmtNode } from '~/DSONode/DSONode.js';


class DSOPackageNode extends DSOStmtNode
{
	constructor ( name, ...funcNodes )
	{
		super ();

		this.name      = name;
		this.funcNodes = funcNodes;
	}

	addFunction ( funcNode )
	{
		this.funcNodes.push (funcNode);
	}
}


export default DSOPackageNode;
