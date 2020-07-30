import DSOOpcodeToken  from '~/DSOToken/DSOOpcodeToken.js';
import DSOOpValueToken from '~/DSOToken/DSOOpValueToken.js';
import DSOReturnToken  from '~/DSOToken/DSOReturnToken.js';


const handleSingle = function ( op, subtype )
{
	switch ( subtype )
	{
		case 'OpcodeSkip':
		case 'OpcodeConvert':
		{
			return null;
		}

		case 'OpcodeReturn':
		{
			return new DSOReturnToken (true);
		}

		case 'OpcodeTypeToNone':
		{
			const ip = this.ip;

			if ( this.advanceIfSubtype ('OpcodeReturn') )
			{
				this.handleMarkers (ip);
				return new DSOReturnToken (false);
			}

			return null;
		}

		default:
		{
			return new DSOOpcodeToken (op);
		}
	}
};

const handleSinglePrefix = function ( op, subtype, ip )
{
	if ( subtype === 'OpcodeLoopJump' )
	{
		this.advance ();
		return null;
	}

	let value;

	if ( subtype === 'OpcodeLoadImmed' )
	{
		value = this.advanceConstant (op);
	}
	else if ( subtype === 'OpcodeSetCurVar' || subtype === 'OpcodeSetCurField' )
	{
		value = this.advanceIdent ();
	}
	else
	{
		value = this.advance ();
	}

	if ( subtype === 'OpcodeJump' || subtype === 'OpcodeLogicJump' )
	{
		const jump = this.currBlock.getJump (ip);

		if ( jump.type !== 'continue' && jump.type !== 'break' )
		{
			this.jumpEnds.push (value, jump.type);
		}

		// [sourceIP, destIP]
		value = [ip, value];
	}
	else if ( subtype === 'OpcodeObjSection' )
	{
		value = !!value;
	}

	return new DSOOpValueToken (op, value);
};


export { handleSingle, handleSinglePrefix };
