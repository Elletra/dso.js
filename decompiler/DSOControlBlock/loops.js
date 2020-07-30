import { has } from '~/util/has.js';


/**
 * Whether or not this control block is in a loop.  Not for checking if this block IS a loop.
 *
 * @returns {boolean}
 */
const isInLoop = function ()
{
	const { parent } = this;

	if ( parent === null )
	{
		return false;
	}

	if ( parent.type === 'loop' )
	{
		return true;
	}

	return parent.isInLoop ();
};

/**
 * Returns the loop this control block is in, if any, and caches the result.
 *
 * @returns {DSOControlBlock|null} null if none found.
 */
const getOuterLoop = function ()
{
	if ( has (this, 'outerLoop') )
	{
		return this.outerLoop;
	}

	const { parent } = this;

	if ( parent === null )
	{
		this.outerLoop = null;
	}
	else if ( parent.type === 'loop' )
	{
		this.outerLoop = parent;
	}
	else
	{
		this.outerLoop = parent.getOuterLoop ();
	}

	return this.outerLoop;
};


export { isInLoop, getOuterLoop };
