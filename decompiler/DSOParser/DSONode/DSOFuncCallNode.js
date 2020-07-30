import { DSOExprNode } from '~/DSONode/DSONode.js';

import { PREC_FUNC_CALL } from '~/DSONode/precedence.js';


class DSOFuncCallNode extends DSOExprNode
{
	constructor ( funcName, namespace, callType, args = [] )
	{
		super ();

		this.funcName  = funcName;
		this.namespace = namespace;
		this.callType  = callType;
		this.args      = args;

		this.inParens = false;
	}

	getPrecedence ()
	{
		return PREC_FUNC_CALL;
	}
}


export default DSOFuncCallNode;
