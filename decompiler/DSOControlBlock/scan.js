import assert    from '~/util/assert.js';
import getOpSize from '~/decompiler/opcodes/getOpSize.js';

import { getOpcodeSubtype } from '~/decompiler/opcodes/getOpcodeType.js';
import { enums }            from '~/common/opcodes.js';

const { OP_JMPIF_NP, OP_JMPIFNOT_NP } = enums;


/**
 * Initial scan to add jump sources and determine the control block's type.
 *
 * @param {integer[]} code
 */
const scan = function ( code )
{
	const { end } = this;

	let ip = this.start;

	if ( this.type === 'root' )
	{
		this.jumps.clear ();
		this.blocks.clear ();
	}
	else
	{
		ip += 2;
	}

	while ( ip < end )
	{
		const op      = code[ip];
		const subtype = getOpcodeSubtype (op);

		if ( subtype === 'OpcodeJumpIfNot' )
		{
			this.addBlock (ip, code[ip + 1], this).scan (code);
			ip = code[ip + 1];
		}
		else
		{
			if ( subtype === 'OpcodeJump' || subtype === 'OpcodeLogicJump' )
			{
				const jump = this.addJump (ip, code[ip + 1], this);

				if ( op === OP_JMPIF_NP )
				{
					jump.setType ('OR');
				}
				else if ( op === OP_JMPIFNOT_NP )
				{
					jump.setType ('AND');
				}
			}
			else if ( subtype === 'OpcodeLoopJump' )
			{
				assert (this.type !== 'root', `OP_JMPIF(F) outside of loop at ${ip}`);

				this.type = 'loop';
			}

			const size = getOpSize (code, ip);

			assert (size > 0, `Invalid opcode ${op} at ${ip}`);

			ip += size;
		}
	}
};


export { scan };
