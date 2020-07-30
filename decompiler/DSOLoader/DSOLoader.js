import assert from '~/util/assert.js';

import { DSOLoaderError } from '~/decompiler/errors.js';

import { DSO_VERSION } from '~/common/constants.js';

import * as getTableValue from '~/DSOLoader/getTableValue.js';
import * as readNumber    from '~/DSOLoader/readNumber.js';
import * as readString    from '~/DSOLoader/readString.js';


/**
 * Reads raw DSO file buffer and unencrypts string tables -- does not parse opcodes.
 *
 * @usage Create a DSOLoader instance with a file buffer as the argument, then call .read()
 */
class DSOLoader
{
	/**
	 * @param {Buffer} buffer - File buffer for open DSO file.
	 */
	constructor ( buffer = null )
	{
		if ( buffer === null )
		{
			throw new DSOLoaderError ('Missing required argument: `buffer`');
		}

		this.buffer  = buffer;
		this.currPos = 0;

		this.code = [];

		this.globalStringTable   = null;
		this.functionStringTable = null;

		this.globalFloatTable   = null;
		this.functionFloatTable = null;

		this.lineBreakPairs = [];
		this.identTable     = {};
	}

	read ()
	{
		const fileVersion = this.readInteger (true);

		if ( fileVersion !== DSO_VERSION )
		{
			throw new DSOLoaderError (`Invalid DSO version: Expected ${DSO_VERSION}, got ${fileVersion}`);
		}

		this.globalStringTable   = this.readStringTable ();
		this.globalFloatTable    = this.readFloatTable ();
		this.functionStringTable = this.readStringTable ();
		this.functionFloatTable  = this.readFloatTable ();

		const codeSize          = this.readInteger (true);
		const numLineBreakPairs = this.readInteger (true);

		for ( let i = 0; i < codeSize; i++ )
		{
			this.code.push (this.readCodeByte ());
		}

		const totalSize = codeSize + numLineBreakPairs * 2;

		for ( let i = codeSize; i < totalSize; i++ )
		{
			this.lineBreakPairs.push (this.readInteger (true));
		}

		let numIdent = this.readInteger (true);

		while ( numIdent-- )
		{
			let index = this.readInteger (true);
			let count = this.readInteger (true);

			while ( count-- )
			{
				const ip = this.readInteger (true);

				this.code[ip]       = index;
				this.identTable[ip] = index;
			}
		}
	}

	advance ( amount = 1 )
	{
		if ( amount < 1 )
		{
			throw new DSOLoaderError (`Cannot advance ${amount} bytes - must be greater than 0`);
		}

		if ( this.currPos + amount > this.buffer.length )
		{
			throw new DSOLoaderError (`Cannot advance ${amount} bytes - exceeds buffer length`);
		}

		this.currPos += amount;

		return this.buffer[this.currPos - amount];
	}
}

Object.assign (DSOLoader.prototype, { ...getTableValue, ...readNumber, ...readString });


export default DSOLoader;
