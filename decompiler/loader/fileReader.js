export const TYPE_SIZE =
{
	U8: 1,
	U32: 4,
	F64: 8,
};

export class FileReader
{
	constructor(buffer = null)
	{
		if (buffer === null)
		{
			throw new Error("`buffer` is null");
		}

		this._buffer = buffer;
		this._position = 0;
	}

	get isEOF() { this._position >= this._buffer.size; }

	readU8()
	{
		const value = this._buffer.readUInt8(this._position);

		this._position += TYPE_SIZE.U8;

		return value;
	}

	readU32()
	{
		const value = this._buffer.readUInt32LE(this._position);

		this._position += TYPE_SIZE.U32;

		return value;
	}

	readF64()
	{
		const value = this._buffer.readDoubleLE(this._position);

		this._position += TYPE_SIZE.F64;

		return value;
	}

	readOp()
	{
		const op = this.readU8();

		return op == 0xFF ? this.readU32() : op;
	}

	readString(chars)
	{
		let str = "";

		for (let i = 0; i < chars; i++)
		{
			str += String.fromCharCode(this.readU8());
		}

		return str;
	}
};
