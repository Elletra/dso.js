/**
 * Goes through each jump and determines what type it is.
 *
 * The goal is to determine all the jumps that can only be made by breaks and continues, then
 * default the rest to if-elses.
 */
const analyzeJumps = function ()
{
	if ( this.type !== 'root' )
	{
		throw new Error ('analyzeJumps() should only be called on the root block');
	}

	const { jumps } = this;

	for ( let [sourceIP, jump] of jumps )
	{
		if ( !jump.assumedType )
		{
			continue;
		}

		const { destIP, block } = jump;
		const { end, parent }   = block;

		const outerLoop = block.getOuterLoop ();

		if ( block.type === 'loop' )
		{
			if ( destIP === end )
			{
				jump.setType ('break');
			}
			else
			{
				// If the OP_JMP is just directly in a loop, it's a continue.
				jump.setType ('continue');
			}
		}
		else if ( outerLoop !== null )
		{
			if ( destIP === outerLoop.end )
			{
				jump.setType ('break');
			}
			else if ( (sourceIP + 2) !== end )
			{
				// If the jump is in a conditional, but it's not at the end, it's a continue.
				jump.setType ('continue');
			}
			else if ( parent !== null && parent.type === 'conditional' && destIP > parent.end )
			{
				// If the parent is a conditional, and the destination is higher than its end ip,
				// it's a continue.
				jump.setType ('continue');
			}
		}

		if ( jump.type === 'continue' )
		{
			block.setContinuePoint (destIP);
		}
	}

	// Once the continue point has been determined (if there is one), we can set all jumps to it as
	// continues, just in case.
	for ( let [sourceIP, jump] of jumps )
	{
		const { destIP, block } = jump;

		const outerLoop = block.getOuterLoop ();

		if ( outerLoop !== null && destIP === outerLoop.continuePoint && jump.type === 'ifElse' )
		{
			jump.setType ('continue');
		}
	}
};


export { analyzeJumps };
