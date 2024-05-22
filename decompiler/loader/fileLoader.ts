import { FileData } from "./fileData";
import { FileReader } from "./fileReader";

export class FileLoader
{
	protected _reader: FileReader;

	constructor()
	{
		this._reader = null;
	}

	loadFile(buffer: any, version: number): FileData
	{
		this._reader = new FileReader(buffer);

		const data = new FileData(version);

		this._readHeader(data);
		this._readStringTable(data, true);
		this._readFloatTable(data, true);
		this._readStringTable(data, false);
		this._readFloatTable(data, false);

		const [codeSize, lineBreaks] = this._readCode(data);

		this._readLineBreaks(data, codeSize, lineBreaks);
		this._readIdentifierTable(data);

		return data;
	}

	_readHeader(data: FileData): void
	{
		const version = this._reader.readU32();

		if (version !== data.version)
		{
			throw new Error(`Invalid DSO version: Expected ${data.version}, got ${version}`);
		}
	}

	_readStringTable(data: FileData, global: boolean): void
	{
		const table = this._reader.readString(this._reader.readU32());

		data.createStringTable(this._unencryptStrings(table), global);
	}

	_readFloatTable(data: FileData, global: boolean): void
	{
		const size = this._reader.readU32();

		for (let i = 0; i < size; i++)
		{
			data.setFloat(i, this._reader.readF64(), global);
		}
	}

	_readCode(data: FileData): [number, number]
	{
		const codeSize = this._reader.readU32();
		const lineBreaks = this._reader.readU32();

		for (let i = 0; i < codeSize; i++)
		{
			data.setOp(i, this._reader.readOp());
		}

		return [codeSize, lineBreaks];
	}

	_readLineBreaks(data: FileData, codeSize: number, count: number): void
	{
		const totalSize = codeSize + count;

		for (let i = codeSize; i < totalSize; i++)
		{
			data.addLineBreakPair(this._reader.readU32(), this._reader.readU32());
		}
	}

	_readIdentifierTable(data: FileData): void
	{
		let identifiers = this._reader.readU32();

		while (identifiers-- > 0)
		{
			const index = this._reader.readU32();
			let count = this._reader.readU32();

			while(count-- > 0)
			{
				const ip = this._reader.readU32();

				data.setOp(ip, index);
				data.setIdentifier(ip, index);
			}
		}
	}

	_unencryptStrings(str: string): string
	{
		const key = "cl3buotro";
		let unencrypted = "";

		const { length } = str;

		for (let i = 0; i < length; i++)
		{
			unencrypted += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % 9));
		}

		return unencrypted;
	}
}
