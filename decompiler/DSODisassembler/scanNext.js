import { DSODisassemblerError } from '~/decompiler/errors.js';

import { getOpcodeType, getOpcodeSubtype } from '~/decompiler/opcodes/getOpcodeType.js';


const scanNext = function ()
{
	const { ip } = this;

	const op      = this.advance ();
	const type    = getOpcodeType (op);
	const subtype = getOpcodeSubtype (op);

	this.handleMarkers (ip);

	switch ( type )
	{
		case 'OpcodeSingle':
		case 'OpcodeStringEnd':
		{
			return this.handleSingle (op, subtype);
		}

		case 'OpcodeSinglePrefix':
		{
			return this.handleSinglePrefix (op, subtype, ip);
		}

		case 'OpcodeTriplePrefix':
		{
			return this.handleTriplePrefix (op, subtype, ip);
		}

		case 'OpcodeJumpIfNot':
		{
			return this.handleJumpIfNot (op, subtype, ip);
		}

		case 'OpcodeStringStart':
		{
			return this.handleStringStart (op, subtype, ip);
		}

		case 'OpcodeFuncDecl':
		{
			return this.handleFuncDecl ();
		}

		case 'OpcodeError':
		{
			throw new DSODisassemblerError (`Invalid opcode ${op} at ${ip}`);
		}

		case null:
		{
			throw new DSODisassemblerError (`Non-existent opcode ${op} at ${ip}`);
		}

		default:
		{
			throw new DSODisassemblerError (`Unhandled opcode ${op} at ${ip}`);
		}
	}
};


export { scanNext };
