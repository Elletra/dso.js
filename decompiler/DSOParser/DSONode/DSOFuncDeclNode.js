import { DSOStmtNode } from '~/DSONode/DSONode.js';


class DSOFuncDeclNode extends DSOStmtNode
{
	constructor ( funcName, namespace, packageName, args )
	{
		super ();

		this.funcName    = funcName;
		this.namespace   = namespace;
		this.packageName = packageName;
		this.args        = args;

		this.body = null;
	}
}


export default DSOFuncDeclNode;
