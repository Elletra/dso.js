import ArrayMap        from '~/ArrayMap.js';
import DSOControlBlock from '~/DSOControlBlock/DSOControlBlock.js';

import { has } from '~/util/has.js';

import { getOpcodeSubtype } from '~/decompiler/opcodes/getOpcodeType.js';

import * as scanNext       from '~/DSODisassembler/scanNext.js';
import * as handleSingle   from '~/DSODisassembler/handleSingle.js';
import * as handleMarkers  from '~/DSODisassembler/handleMarkers.js';
import * as handleFuncDecl from '~/DSODisassembler/handleFuncDecl.js';
import * as handleMisc     from '~/DSODisassembler/handleMisc.js';


/**
 * Disassembles the DSO code into easily-parsable tokens.
 *
 * @usage Create a new DSODisassembler instance with DSOLoader and DSOControlBlock instances,
 *        then call .disassemble()
 */
class DSODisassembler
{
	/**
	 * @param {DSOLoader}       loader       - DSOLoader with the code, identifier table, etc.
	 * @param {DSOControlBlock} controlBlock - For data on loops vs. conditionals, jumps, etc.
	 */
	constructor ( loader, controlBlock )
	{
		this.loader    = loader;
		this.currBlock = controlBlock;

		this.ip = 0;

		this.blockStack = [];
		this.jumpEnds   = new ArrayMap ();
		this.funcEndIP  = null;

		this.tokens = [];
	}

	/**
	 * @returns {integer[]} A stream of easily-parsable tokens.
	 */
	disassemble ()
	{
		// First, we make an initial pass through the code to turn everything into tokens.
		while ( !this.isAtEnd () )
		{
			const token = this.scanNext ();

			if ( token !== null )
			{
				this.pushToken (token);
			}
		}

		// Drop the final OP_RETURN that's at the end of every file.
		this.popToken ();

		return this.tokens;
	}

	isAtEnd ()
	{
		return this.ip >= this.code.length;
	}

	peek ()
	{
		return this.code[this.ip];
	}

	advance ()
	{
		return this.code[this.ip++];
	}

	advanceIfSubtype ( subtype )
	{
		if ( getOpcodeSubtype (this.peek ()) === subtype )
		{
			this.advance ();
			return true;
		}

		return false;
	}

	advanceIdent ()
	{
		if ( this.hasIdent (this.ip) )
		{
			return this.loader.getString (this.advance (), false);
		}

		this.advance ();
		return null;
	}

	advanceConstant ( op )
	{
		const inFunction = this.funcEndIP !== null;
		const value      = this.advance ();

		return this.loader.getTableValue (op, value, inFunction);
	}

	hasIdent ( ip )
	{
		return has (this.identTable, ip);
	}

	pushToken ( token )
	{
		this.tokens.push (token);
	}

	popToken ()
	{
		return this.tokens.pop ();
	}

	pushBlock ( block )
	{
		this.blockStack.push (block);
	}

	popBlock ()
	{
		return this.blockStack.pop ();
	}

	get code ()
	{
		return this.loader.code;
	}

	get identTable ()
	{
		return this.loader.identTable;
	}
}

Object.assign (DSODisassembler.prototype,
{
	...scanNext,

	...handleSingle,   ...handleMarkers,
	...handleFuncDecl, ...handleMisc,
});


export default DSODisassembler;
