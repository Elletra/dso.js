import DSOStrConcatNode from '~/DSONode/DSOStrConcatNode.js';
import DSOCommaCatNode  from '~/DSONode/DSOCommaCatNode.js';

import assert from '~/util/assert.js';

import { enums } from '~/common/opcodes.js';

const { OP_ADVANCE_STR_COMMA } = enums;


const parseString = function ( token, controlBlock = this.controlBlock )
{
	const startPos = this.currPos - 1;
	const body     = this.parseUntil ('OpcodeStringEnd', controlBlock);

	assert (body.length === 1, `Strings can only have one expression (start pos: ${startPos})`);

	if ( token.op === OP_ADVANCE_STR_COMMA )
	{
		return new DSOCommaCatNode (this.popNode (), body[0]);
	}

	switch ( this.peek ().type )
	{
		case 'OpcodeSetVarArr':
		case 'OpcodeSetFieldArr':
		case 'OpcodeSaveVar':
		case 'OpcodeSaveField':
		{
			return body[0];
		}
	}

	return new DSOStrConcatNode (this.popNode (), body[0], token.value);
};


export { parseString };
