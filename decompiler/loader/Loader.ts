import { IBuffer } from "../../common/IBuffer";
import { NumberType } from "../../common/numbers/numberTypes";

import { DSOData, StringTable, FloatTable, IdentTable } from "./DSOData";

import { stringEncryption } from "../../common/strings/encryption";

import { DSO_VERSION } from "../../common/constants";

import { SIZE_INT8, SIZE_INT16, SIZE_INT32, SIZE_F64 } from "../../common/numbers/constants";


/**
 * Parses DSO file sections and produces a `DSOData` instance.
 */
export class Loader
{
	static Error = class extends Error {};

	private _buffer: IBuffer | null;
	private _pos: number;

	constructor ()
	{
		this._buffer = null;
		this._pos = 0;
	}

	parse ( buffer: IBuffer, version: number = DSO_VERSION ): DSOData
	{
		if ( arguments.length < 1 )
		{
			throw new Loader.Error ("Missing required argument `buffer`");
		}

		this._buffer = buffer;
		this._pos = 0;

		const data = new DSOData (version);

		this._parseHeader (data);
		this._parseStringTable (data.globalStringTable);
		this._parseFloatTable (data.globalFloatTable);
		this._parseStringTable (data.funcStringTable);
		this._parseFloatTable (data.funcFloatTable);
		this._parseCode (data);
		this._parseIdentTable (data);

		return data;
	}

	/**
	 * Private methods
	 */

	private _advance ( amount = 1 ): number
	{
		if ( amount < 1 )
		{
			throw new Loader.Error (`Cannot advance ${amount} byte(s) - must be greater than 0`);
		}

		if ( this._pos + amount > this._buffer.length )
		{
			throw new Loader.Error (`Cannot advance ${amount} byte(s) - exceeds buffer length`);
		}

		this._pos += amount;

		return this._buffer[this._pos - amount];
	}

	private _readInteger ( littleEndian: boolean = true ): number
	{
		if ( littleEndian )
		{
			return this._readNumber (NumberType.UInt32LE);
		}

		return this._readNumber (NumberType.UInt32BE);
	}

	private _readFloat ( littleEndian: boolean = true ): number
	{
		if ( littleEndian )
		{
			return this._readNumber (NumberType.DoubleLE);
		}

		return this._readNumber (NumberType.DoubleBE);
	}

	private _readCodeByte (): number
	{
		let op = this._readNumber (NumberType.UInt8);

		if ( op === 0xFF )
		{
			op = this._readNumber (NumberType.UInt32LE);
		}

		return op;
	}

	private _readNumber ( type: NumberType ): number
	{
		let number;
		let size;

		switch ( type )
		{
			case NumberType.UInt8:
				number = this._buffer.readUInt8 (this._pos);
				size = SIZE_INT8;
				break;

			case NumberType.UInt16LE:
				number = this._buffer.readUInt16LE (this._pos);
				size = SIZE_INT16;
				break;

			case NumberType.UInt16BE:
				number = this._buffer.readUInt16BE (this._pos);
				size = SIZE_INT16;
				break;

			case NumberType.UInt32LE:
				number = this._buffer.readUInt32LE (this._pos);
				size = SIZE_INT32;
				break;

			case NumberType.UInt32BE:
				number = this._buffer.readUInt32BE (this._pos);
				size = SIZE_INT32;
				break;

			case NumberType.DoubleLE:
				number = this._buffer.readDoubleLE (this._pos);
				size = SIZE_F64;
				break;

			case NumberType.DoubleBE:
				number = this._buffer.readDoubleBE (this._pos);
				size = SIZE_F64;
				break;

			default:
				throw new Loader.Error (`Invalid number type \`${type}\``);
		}

		this._advance (size);

		return number;
	}

	private _readString ( chars: number, encoding: string = "binary" ): string
	{
		const str = this._buffer.toString (encoding, this._pos, this._pos + chars);

		this._advance (chars);

		return str;
	}

	private _parseHeader ( data: DSOData )
	{
		const fileVersion = this._readInteger (true);

		if ( fileVersion !== data.version )
		{
			throw new Loader.Error (`Invalid DSO version: Expected ${data.version}, got ${fileVersion}`);
		}
	}

	private _parseStringTable ( table: StringTable )
	{
		table.clear ();

		let strings = "";

		const size = this._readInteger (true);

		if ( size > 0 )
		{
			strings = stringEncryption (this._readString (size));
		}

		let currStr = "";
		let currIndex = 0;

		const { length } = strings;

		for ( let i = 0; i < length; i++ )
		{
			const char = strings.charAt (i);

			if ( char === "\0" )
			{
				table.set (currIndex, currStr);

				currStr = "";
				currIndex = i + 1;
			}
			else
			{
				currStr += char;
			}
		}

		// TODO: Handle escape characters.
	}

	private _parseFloatTable ( table: FloatTable )
	{
		table.clear ();

		const size = this._readInteger (true);

		for ( let i = 0; i < size; i++ )
		{
			table.set (i, this._readFloat ());
		}
	}

	private _parseCode ( data: DSOData )
	{
		data.code = [];

		const codeSize = this._readInteger (true);
		const numLineBreaks = this._readInteger (true);

		for ( let i = 0; i < codeSize; i++ )
		{
			data.code.push (this._readCodeByte ());
		}

		this._parseLineBreaks (data, codeSize, numLineBreaks);
	}

	private _parseLineBreaks ( data: DSOData, codeSize: number, numLineBreaks: number )
	{
		data.lineBreakPairs = [];

		const totalSize = codeSize + numLineBreaks * 2;

		for ( let i = codeSize; i < totalSize; i++ )
		{
			data.lineBreakPairs.push (this._readInteger (true));
		}
	}

	private _parseIdentTable ( data: DSOData )
	{
		let index, count, ip;
		let numIdent = this._readInteger (true);

		while ( numIdent-- )
		{
			index = this._readInteger (true);
			count = this._readInteger (true);

			while ( count-- )
			{
				ip = this._readInteger (true);

				data.code[ip] = index;
				data.identTable.set (ip, index);
			}
		}
	}
}
