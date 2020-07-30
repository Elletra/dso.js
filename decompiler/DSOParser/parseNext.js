import DSOConstantNode from '~/DSONode/DSOConstantNode.js';
import DSOUnaryNode    from '~/DSONode/DSOUnaryNode.js';

import { DSOParserError } from '~/decompiler/errors.js';


const parseNext = function ()
{
	const tokenPos = this.currPos;
	const token    = this.advance ();

	const { type } = token;

	switch ( type )
	{
		case 'OpcodeLoadImmed':
		{
			return new DSOConstantNode (token.op, token.value);
		}

		case 'OpcodeUnary':
		{
			return new DSOUnaryNode (token.op, this.popNode ());
		}

		case 'OpcodeReturn':
		{
			return this.parseReturn (token.returnsValue);
		}

		case 'OpcodeJump':
		{
			return this.parseJump (token);
		}

		case 'OpcodeJumpIfNot':
		{
			return this.parseBlock (token);
		}

		case 'OpcodeSetCurVar':
		case 'OpcodeSetVarArr':
		{
			return this.parseVariable (token, type === 'OpcodeSetVarArr');
		}

		case 'OpcodeSetCurObject':
		case 'OpcodeSetFieldArr':
		{
			return this.parseSlot (token.op, type === 'OpcodeSetFieldArr');
		}

		case 'OpcodeSaveVar':
		case 'OpcodeSaveField':
		{
			return this.parseAssign ();
		}

		case 'OpcodeBinary':
		case 'OpcodeCompareStr':
		case 'OpcodeLogicJump':
		{
			if ( this.advanceIfType ('OpcodeSaveVar') || this.advanceIfType ('OpcodeSaveField') )
			{
				return this.parseAssign (token.op);
			}

			return this.parseBinary (token.op, type);
		}

		case 'OpcodeStringStart':
		{
			return this.parseString (token);
		}

		case 'OpcodePushFrame':
		{
			return this.parsePushFrame ();
		}

		case 'OpcodeFuncDecl':
		{
			return this.parseFuncDecl (token);
		}

		default:
		{
			throw new DSOParserError (`Unhandled token type \`${type}\` at ${tokenPos}`);
		}
	}
};


export { parseNext };
