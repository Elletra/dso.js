import { DSOStmtNode } from '~/DSONode/DSONode.js';


class DSOLoopNode extends DSOStmtNode
{
	constructor ( testExpr, body, initialExpr = null, endExpr = null )
	{
		super ();

		if ( initialExpr !== null && endExpr === null )
		{
			throw new Error ('Loop has initial expression but no end expression!');
		}
		else if ( endExpr !== null && initialExpr === null )
		{
			throw new Error ('Loop has end expression but no initial expression!');
		}

		this.testExpr    = testExpr;
		this.body        = body;
		this.initialExpr = initialExpr;
		this.endExpr     = endExpr;
	}
}


export default DSOLoopNode;
