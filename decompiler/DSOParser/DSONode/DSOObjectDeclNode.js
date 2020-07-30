import DSOConstantNode from '~/DSONode/DSOConstantNode.js';

import { DSOExprNode } from '~/DSONode/DSONode.js';
import { enums }       from '~/common/opcodes.js';

const { OP_LOADIMMED_IDENT } = enums;


class DSOObjectDeclNode extends DSOExprNode
{
	constructor ( classExpr, nameExpr, args = [] )
	{
		super ();

		classExpr.inParens = !(classExpr instanceof DSOConstantNode) ||
		                       classExpr.op !== OP_LOADIMMED_IDENT;

		this.classExpr = classExpr;
		this.nameExpr  = nameExpr;
		this.args      = args;

		this.parentName  = null;
		this.isDataBlock = false;
		this.placeAtRoot = true;

		this.slots      = null;
		this.subObjects = null;

		this.inParens = false;
	}
}


export default DSOObjectDeclNode;
