import DSOToken      from '~/DSOToken/DSOToken.js';
import DSOValueToken from '~/DSOToken/DSOValueToken.js';

import { DSODisassemblerError } from '~/decompiler/errors.js';

import jumpTypeToMarker from '~/DSODisassembler/jumpTypeToMarker.js';


const handleMarkers = function ( ip )
{
	if ( ip === this.funcEndIP )
	{
		// Drop extra OP_RETURN that's at the end of every function.
		this.popToken ();

		this.pushMarker ('MarkerFuncEnd');
		this.funcEndIP = null;
	}

	while ( this.currBlock.type !== 'root' && ip === this.currBlock.end )
	{
		this.currBlock = this.popBlock () || null;
	}

	const { jumpEnds } = this;

	while ( jumpEnds.count (ip) > 0 )
	{
		const markerType = jumpTypeToMarker (jumpEnds.pop (ip));

		this.pushMarker (markerType, ip);
	}

	if ( ip === this.currBlock.continuePoint )
	{
		this.pushMarker ('MarkerContinuePoint', ip);
	}
};

const pushMarker = function ( type, ...args )
{
	if ( type === 'MarkerFuncEnd' )
	{
		this.pushToken (new DSOToken (type));
	}
	else
	{
		this.pushToken (new DSOValueToken (type, ...args));
	}
};


export { handleMarkers, pushMarker };
