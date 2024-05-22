export const TYPE_SIZE =
{
	U8: 1,
	U32: 4,
	F64: 8,
};

export class FileReader
{
	#buffer: any;
	#position: number;

	constructor(buffer: any = null)
	{
		if (buffer === null)
		{
			throw new Error("`buffer` is null");
		}

		this.#buffer = buffer;
		this.#position = 0;
	}

	get isEOF(): boolean { return this.#position >= this.#buffer.size; }

	readU8(): number
	{
		const value = this.#buffer.readUInt8(this.#position);

		this.#position += TYPE_SIZE.U8;

		return value;
	}

	readU32(): number
	{
		const value = this.#buffer.readUInt32LE(this.#position);

		this.#position += TYPE_SIZE.U32;

		return value;
	}

	readF64(): number
	{
		const value = this.#buffer.readDoubleLE(this.#position);

		this.#position += TYPE_SIZE.F64;

		return value;
	}

	readOp(): number
	{
		const op = this.readU8();

		return op == 0xFF ? this.readU32() : op;
	}

	readString(length: number): string
	{
		let str = "";

		for (let i = 0; i < length; i++)
		{
			str += String.fromCharCode(this.readU8());
		}

		return str;
	}
};
