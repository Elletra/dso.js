import DSOToken from '~/DSOToken/DSOToken.js';


class DSOReturnToken extends DSOToken
{
	constructor ( returnsValue )
	{
		super ('OpcodeReturn');
		this.returnsValue = returnsValue;
	}
}


export default DSOReturnToken;
