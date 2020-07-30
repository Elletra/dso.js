import DSOToken from '~/DSOToken/DSOToken.js';


class DSOValueToken extends DSOToken
{
	constructor ( type, value )
	{
		super (type);
		this.value = value;
	}
}


export default DSOValueToken;
