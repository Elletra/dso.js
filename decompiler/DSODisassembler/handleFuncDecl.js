import DSOFuncDeclToken from '~/DSOToken/DSOFuncDeclToken.js';


const handleFuncDecl = function ()
{
	const funcName    = this.advanceIdent ();
	const namespace   = this.advanceIdent ();
	const packageName = this.advanceIdent ();

	// has arguments
	this.advance ();

	this.funcEndIP = this.advance ();

	const token   = new DSOFuncDeclToken (funcName, namespace, packageName);
	const numArgs = this.advance ();

	for ( let i = 0; i < numArgs; i++ )
	{
		token.addArgument (this.advanceIdent ());
	}

	return token;
};


export { handleFuncDecl };
