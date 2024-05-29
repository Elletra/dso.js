export class StringTable
{
	#table: Map<number, string>;
	#rawString: string;

	constructor(rawString: string)
	{
		this.#table = new Map();
		this.#rawString = rawString;

		let index = 0;
		let str = "";

		const { length } = rawString;

		for (let i = 0; i < length; i++)
		{
			const ch = rawString.at(i);

			if (ch === "\0")
			{
				this.#table.set(index, str);
				str = "";
				index = i + 1;
			}
			else
			{
				str += ch;
			}
		}
	}

	public get rawString(): string { return this.#rawString; }

	public get(index: number): string | null { return this.has(index) ? this.#table.get(index) : null; }
	public has(index: number): boolean { return this.#table.has(index); }
}

export class FileData
{
	#version: number;
	#code: number[];
	#globalStrings: StringTable;
	#functionStrings: StringTable;
	#globalFloats: number[];
	#functionFloats: number[];
	#identifierTable: Map<number, number>;
	#lineBreakPairs: [number, number][];

	constructor(version: number)
	{
		this.#version = version;
		this.#code = [];
		this.#globalStrings = null;
		this.#functionStrings = null;
		this.#globalFloats = [];
		this.#functionFloats = [];
		this.#identifierTable = new Map();
		this.#lineBreakPairs = [];
	}

	public get version(): number { return this.#version; }
	public get codeSize(): number { return this.#code.length; }

	public setIdentifier(addr: number, index: number): void { this.#identifierTable.set(addr, index); }

	public getIdentifier(addr: number, index: number): string | null
	{
		return this.hasIdentifierAt(addr) ? this.getString(index, true) : null;
	}

	public hasIdentifierAt(addr: number): boolean
	{
		return this.#identifierTable.has(addr);
	}

	public getString(index: number, global: boolean): string | null
	{
		return (global ? this.#globalStrings : this.#functionStrings).get(index);
	}

	public setFloat(index: number, value: number, global: boolean): void
	{
		(global ? this.#globalFloats : this.#functionFloats)[index] = value;
	}

	public getFloat(index: number, global: boolean): number | null
	{
		return (global ? this.#globalFloats : this.#functionFloats)[index] ?? null;
	}

	public setOp(index: number, op: number): void { this.#code[index] = op; }
	public getOp(index: number): number { return this.#code[index] ?? null; }

	public addLineBreakPair(line: number, addr: number): void { this.#lineBreakPairs.push([line, addr]); }

	public createStringTable(table: string, global: boolean): void
	{
		if (global)
		{
			this.#globalStrings = new StringTable(table);
		}
		else
		{
			this.#functionStrings = new StringTable(table);
		}
	}
}
