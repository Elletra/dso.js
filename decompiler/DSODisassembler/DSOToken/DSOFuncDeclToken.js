import DSOToken from '~/DSOToken/DSOToken.js';


class DSOFuncDeclToken extends DSOToken
{
	constructor ( funcName, namespace, packageName )
	{
		super ('OpcodeFuncDecl');

		this.funcName    = funcName;
		this.namespace   = namespace;
		this.packageName = packageName;

		this.args = [];
	}

	addArgument ( arg )
	{
		this.args.push (arg);
	}
}


export default DSOFuncDeclToken;
