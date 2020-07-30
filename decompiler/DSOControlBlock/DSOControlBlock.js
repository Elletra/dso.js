import DSOJumpInfo from '~/DSOControlBlock/DSOJumpInfo.js';

import assert from '~/util/assert.js';

import * as scan         from '~/DSOControlBlock/scan.js';
import * as loops        from '~/DSOControlBlock/loops.js';
import * as analyzeJumps from '~/DSOControlBlock/analyzeJumps.js';


/**
 * For sorting out various code ambiguities (e.g. loops vs. conditionals, what OP_JMPs are, etc.)
 *
 * @usage Create a DSOControlBlock instance with 0 and code.length as the arguments, then call
 *        .scan(code) and .analyzeJumps()
 */
class DSOControlBlock
{
	/**
	 * @param {integer}              start
	 * @param {integer}              end
	 * @param {DSOControlBlock|null} [parent=null]
	 */
	constructor ( start, end, parent = null )
	{
		this.start  = start;
		this.end    = end;
		this.parent = parent;
		this.type   = (parent === null ? 'root' : 'conditional');

		this.jumps         = (this.type === 'root' ? new Map () : null);
		this.blocks        = (this.type === 'root' ? new Map () : null);
		this.continuePoint = null;
	}

	/**
	 * @param {integer} start
	 * @param {integer} end
	 * @param {string}  [type="conditional"]
	 */
	addBlock ( start, end, parent = null )
	{
		let block;

		if ( this.type === 'root' )
		{
			block = new DSOControlBlock (start, end, parent);

			this.blocks.set (start, block);
		}
		else
		{
			block = this.parent.addBlock (start, end, parent);
		}

		return block;
	}

	/**
	 * @param {integer}         sourceIP
	 * @param {integer}         destIP
	 * @param {DSOControlBlock} block
	 *
	 * @returns {DSOJumpInfo}
	 */
	addJump ( sourceIP, destIP, block )
	{
		let jump;

		if ( this.type === 'root' )
		{
			jump = new DSOJumpInfo (sourceIP, destIP, block);

			this.jumps.set (sourceIP, jump);
		}
		else
		{
			jump = this.parent.addJump (sourceIP, destIP, block);
		}

		return jump;
	}

	/**
	 * @param {integer} ip
	 */
	setContinuePoint ( ip )
	{
		if ( this.type === 'loop' )
		{
			const check = (this.continuePoint === null || ip === this.continuePoint);

			assert (check, `Multiple continue points for control block starting at ${this.start}`);

			this.continuePoint = ip;
		}
		else
		{
			const loop = this.getOuterLoop ();

			assert (loop !== null, `Continue point ${ip} not in a loop`);
			assert (loop.isInBounds (ip), `Continue point ${ip} past loop end ${loop.end}`);

			loop.setContinuePoint (ip);
		}
	}

	/**
	 * @param   {integer} start
	 * @returns {boolean}
	 */
	hasBlock ( start )
	{
		if ( this.type === 'root' )
		{
			return this.blocks.has (start);
		}

		return this.parent.hasBlock (start);
	}

	/**
	 * @param   {integer} sourceIP
	 * @returns {boolean}
	 */
	hasJump ( sourceIP )
	{
		if ( this.type === 'root' )
		{
			return this.jumps.has (sourceIP);
		}

		return this.parent.hasJump (sourceIP);
	}

	/**
	 * @param   {integer} start
	 * @returns {DSOControlBlock|null} null if not found
	 */
	getBlock ( start )
	{
		if ( this.type === 'root' )
		{
			return this.hasBlock (start) ? this.blocks.get (start) : null;
		}

		return this.parent.getBlock (start);
	}

	/**
	 * @param   {integer} sourceIP
	 * @returns {DSOJumpInfo|null} null if not found
	 */
	getJump ( sourceIP )
	{
		if ( this.type === 'root' )
		{
			return this.hasJump (sourceIP) ? this.jumps.get (sourceIP) : null;
		}

		return this.parent.getJump (sourceIP);
	}

	/**
	 * Whether or not an ip falls within this control block.
	 *
	 * @param   {integer} ip
	 * @returns {boolean}
	 */
	isInBounds ( ip )
	{
		return ip >= this.start && ip <= this.end;
	}
}

Object.assign (DSOControlBlock.prototype, { ...scan, ...loops, ...analyzeJumps });


export default DSOControlBlock;
