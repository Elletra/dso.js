import DSOToken from '~/DSOToken/DSOToken.js';

import { getOpcodeSubtype } from '~/decompiler/opcodes/getOpcodeType.js';


class DSOOpValueToken extends DSOToken
{
	constructor ( op, value )
	{
		super (getOpcodeSubtype (op));

		this.op    = op;
		this.value = value;
	}
}


export default DSOOpValueToken;
