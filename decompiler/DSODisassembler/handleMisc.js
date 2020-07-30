import DSOValueToken   from '~/DSOToken/DSOValueToken.js';
import DSOOpValueToken from '~/DSOToken/DSOOpValueToken.js';

import assert from '~/util/assert.js';

import { DSODisassemblerError } from '~/decompiler/errors.js';

import { enums } from '~/common/opcodes.js';

const { OP_ADVANCE_STR_APPENDCHAR } = enums;


const handleTriplePrefix = function ( op, subtype, ip )
{
	const values = [];

	if ( subtype === 'OpcodeFuncCall' )
	{
		values.push (this.advanceIdent (), this.advanceIdent (), this.advance ());
	}
	else if ( subtype === 'OpcodeCreateObj' )
	{
		values.push (this.advanceIdent (), !!this.advance (), this.advance ());
	}
	else
	{
		throw new DSODisassemblerError (`Unhandled OpcodeTriplePrefix at ${ip}`);
	}

	return new DSOOpValueToken (op, values);
};

const handleJumpIfNot = function ( op, subtype, ip )
{
	assert (this.currBlock.hasBlock (ip), `Missing control block at ${ip}`);

	this.pushBlock (this.currBlock);
	this.currBlock = this.currBlock.getBlock (ip);

	const endIP = this.advance ();

	this.jumpEnds.push (endIP, this.currBlock.type);

	return new DSOValueToken (subtype, [ip, endIP]);
};

const handleStringStart = function ( op, subtype, ip )
{
	let appendChar = null;

	if ( op === OP_ADVANCE_STR_APPENDCHAR )
	{
		appendChar = this.advance ();
	}

	return new DSOOpValueToken (op, appendChar);
};


export { handleTriplePrefix, handleJumpIfNot, handleStringStart };
