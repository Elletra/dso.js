import clamp from '~/util/clamp.js';

import * as parseNext      from '~/DSOParser/parseNext.js';
import * as parseBinary    from '~/DSOParser/parseBinary.js';
import * as parseAssign    from '~/DSOParser/parseAssign.js';
import * as parsePushFrame from '~/DSOParser/parsePushFrame.js';
import * as parseBlock     from '~/DSOParser/parseBlock.js';
import * as parseString    from '~/DSOParser/parseString.js';
import * as parseMisc      from '~/DSOParser/parseMisc.js';


/**
 * Parses an array DSOTokens into DSONodes.
 *
 * @usage Create a DSOParser instance with DSOTokens array and DSOControlBlock instance, then
 *        call .parse()
 */
class DSOParser
{
	/**
	 * @param {DSOToken[]}      tokens
	 * @param {DSOControlBlock} controlBlock
	 */
	constructor ( tokens, controlBlock )
	{
		this.tokens       = tokens;
		this.controlBlock = controlBlock;

		this.currPos   = 0;
		this.untilType = null;
		this.isRunning = false;
		this.nodes     = [];
	}

	/**
	 * @param {integer}     [start=this.currPos] - The position in the token stream to start at.
	 * @param {string|null} [untilType=null]     - If not null, what type of token to stop at.
	 */
	parse ( start = this.currPos, untilType = null )
	{
		this.currPos   = start;
		this.untilType = untilType;

		this.isRunning = true;

		while ( this.isRunning && !this.isAtEnd () )
		{
			const node = this.parseNext ();

			if ( node !== null )
			{
				this.pushNode (node);
			}
		}

		this.isRunning = false;

		return this.nodes;
	}

	parseUntil ( untilType, block = this.controlBlock, skipType = true )
	{
		const parser = new DSOParser (this.tokens, block);
		const nodes  = parser.parse (this.currPos, untilType);

		// +1 if we want to skip past the `untilType` token.
		this.seek (skipType ? parser.currPos + 1 : parser.currPos);

		return nodes;
	}

	isAtEnd ()
	{
		if ( this.currPos >= this.tokens.length )
		{
			return true;
		}

		if ( this.untilType !== null && this.peek ().type === this.untilType )
		{
			return true;
		}

		return false;
	}

	seek ( amount )
	{
		this.currPos = clamp (amount, 0, this.tokens.length);
	}

	peek ()
	{
		return this.tokens[this.currPos];
	}

	advance ()
	{
		return this.tokens[this.currPos++];
	}

	advanceIfType ( type )
	{
		if ( this.peek ().type === type )
		{
			this.advance ();
			return true;
		}

		return false;
	}

	pushNode ( node )
	{
		this.nodes.push (node);
	}

	popNode ()
	{
		return this.nodes.pop ();
	}

	peekNode ()
	{
		return this.nodes.length > 0 ? this.nodes[this.nodes.length - 1] : null;
	}
}

Object.assign (DSOParser.prototype,
{
	...parseNext,   ...parseBinary,
	...parseAssign, ...parsePushFrame,
	...parseBlock,  ...parseString,
	...parseMisc,
});


export default DSOParser;
