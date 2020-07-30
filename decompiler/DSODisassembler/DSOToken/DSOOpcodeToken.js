import DSOToken from '~/DSOToken/DSOToken.js';

import { getOpcodeSubtype } from '~/decompiler/opcodes/getOpcodeType.js';


class DSOOpcodeToken extends DSOToken
{
	constructor ( op )
	{
		super (getOpcodeSubtype (op));
		this.op = op;
	}
}


export default DSOOpcodeToken;
