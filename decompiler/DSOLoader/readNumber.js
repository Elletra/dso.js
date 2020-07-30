import { DSOLoaderError } from '~/decompiler/errors.js';

import
{
	SIZE_INT8,
	SIZE_INT16,
	SIZE_INT32,

	SIZE_F64,

	numberTypes,
}
from '~/common/numbers/constants.js';

const { UInt8, UInt16LE, UInt16BE, UInt32LE, UInt32BE, DoubleLE, DoubleBE } = numberTypes;


const readNumber = function ( type )
{
	let number;
	let size;

	switch ( type )
	{
		case UInt8:
		{
			number = this.buffer.readUInt8 (this.currPos);
			size   = SIZE_INT8;

			break;
		}

		case UInt16LE:
		{
			number = this.buffer.readUInt16LE (this.currPos);
			size   = SIZE_INT16;

			break;
		}

		case UInt16BE:
		{
			number = this.buffer.readUInt16BE (this.currPos);
			size   = SIZE_INT16;

			break;
		}

		case UInt32LE:
		{
			number = this.buffer.readUInt32LE (this.currPos);
			size   = SIZE_INT32;

			break;
		}

		case UInt32BE:
		{
			number = this.buffer.readUInt32BE (this.currPos);
			size   = SIZE_INT32;

			break;
		}

		case DoubleLE:
		{
			number = this.buffer.readDoubleLE (this.currPos);
			size   = SIZE_F64;

			break;
		}

		case DoubleBE:
		{
			number = this.buffer.readDoubleBE (this.currPos);
			size   = SIZE_F64;

			break;
		}

		default:
		{
			throw new DSOLoaderError (`Invalid number type \`${type}\``);
		}
	}

	this.advance (size);

	return number;
};

const readInteger = function ( littleEndian = true )
{
	if ( littleEndian )
	{
		return this.readNumber (UInt32LE);
	}

	return this.readNumber (UInt32BE);
};

const readFloat = function ( littleEndian = true )
{
	if ( littleEndian )
	{
		return this.readNumber (DoubleLE);
	}

	return this.readNumber (DoubleBE);
};

const readFloatTable = function ()
{
	const table = [];
	const size  = this.readInteger (true);

	for ( let i = 0; i < size; i++ )
	{
		table.push (this.readFloat ());
	}

	return table;
};

const readCodeByte = function ()
{
	let op = this.readNumber (UInt8);

	if ( op === 0xFF )
	{
		op = this.readNumber (UInt32LE);
	}

	return op;
};


export { readNumber, readInteger, readFloat, readFloatTable, readCodeByte };
