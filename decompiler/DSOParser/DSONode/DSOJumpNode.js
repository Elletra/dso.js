import { DSOStmtNode } from '~/DSONode/DSONode.js';


class DSOJumpNode extends DSOStmtNode
{
	constructor ( sourceIP, destIP )
	{
		super ();

		this.sourceIP = sourceIP;
		this.destIP   = destIP;
	}
}

class DSOElseNode extends DSOJumpNode {}

class DSOBreakNode extends DSOJumpNode {}
class DSOContinueNode extends DSOJumpNode {}


export { DSOJumpNode, DSOElseNode, DSOBreakNode, DSOContinueNode };
