import { FileData } from "./fileData";
import { FileReader } from "./fileReader";

export class FileLoader
{
	#reader: FileReader;

	constructor()
	{
		this.#reader = null;
	}

	public loadFile(buffer: any, version: number): FileData
	{
		this.#reader = new FileReader(buffer);

		const data = new FileData(version);

		this.#readHeader(data);
		this.#readStringTable(data, true);
		this.#readFloatTable(data, true);
		this.#readStringTable(data, false);
		this.#readFloatTable(data, false);

		const [codeSize, lineBreaks] = this.#readCode(data);

		this.#readLineBreaks(data, codeSize, lineBreaks);
		this.#readIdentifierTable(data);

		return data;
	}

	#readHeader(data: FileData): void
	{
		const version = this.#reader.readU32();

		if (version !== data.version)
		{
			throw new Error(`Invalid DSO version: Expected ${data.version}, got ${version}`);
		}
	}

	#readStringTable(data: FileData, global: boolean): void
	{
		const table = this.#reader.readString(this.#reader.readU32());

		data.createStringTable(this.#unencryptStrings(table), global);
	}

	#readFloatTable(data: FileData, global: boolean): void
	{
		const size = this.#reader.readU32();

		for (let i = 0; i < size; i++)
		{
			data.setFloat(i, this.#reader.readF64(), global);
		}
	}

	#readCode(data: FileData): [number, number]
	{
		const codeSize = this.#reader.readU32();
		const lineBreaks = this.#reader.readU32();

		for (let i = 0; i < codeSize; i++)
		{
			data.setOp(i, this.#reader.readOp());
		}

		return [codeSize, lineBreaks];
	}

	#readLineBreaks(data: FileData, codeSize: number, count: number): void
	{
		const totalSize = codeSize + count;

		for (let i = codeSize; i < totalSize; i++)
		{
			data.addLineBreakPair(this.#reader.readU32(), this.#reader.readU32());
		}
	}

	#readIdentifierTable(data: FileData): void
	{
		let identifiers = this.#reader.readU32();

		while (identifiers-- > 0)
		{
			const index = this.#reader.readU32();
			let count = this.#reader.readU32();

			while(count-- > 0)
			{
				const ip = this.#reader.readU32();

				data.setOp(ip, index);
				data.setIdentifier(ip, index);
			}
		}
	}

	#unencryptStrings(str: string): string
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
