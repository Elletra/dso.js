export class StringTable
{
	protected _table: Map<number, string>;
	protected _rawString: string;

	constructor(rawString: string)
	{
		this._table = new Map();
		this._rawString = rawString;

		let index = 0;
		let str = "";

		const { length } = rawString;

		for (let i = 0; i < length; i++)
		{
			const ch = rawString.at(i);

			if (ch === '\0')
			{
				this._table.set(index, str);
				str = "";
				index = i + 1;
			}
			else
			{
				str += ch;
			}
		}
	}

	get(index: number): string | null { return this.has(index) ? this._table.get(index) : null; }
	has(index: number): boolean { return this._table.has(index); }
}

export class FileData
{
	protected _version: number;
	protected _code: number[];
	protected _globalStrings: StringTable;
	protected _functionStrings: StringTable;
	protected _globalFloats: number[];
	protected _functionFloats: number[];
	protected _identifierTable: Map<number, number>;
	protected _lineBreakPairs: [number, number][];

	constructor(version: number)
	{
		this._version = version;
		this._code = [];
		this._globalStrings = null;
		this._functionStrings = null;
		this._globalFloats = [];
		this._functionFloats = [];
		this._identifierTable = new Map();
		this._lineBreakPairs = [];
	}

	get version(): number { return this._version; }
	get codeSize(): number { return this._code.length; }

	setIdentifier(addr: number, index: number): void { this._identifierTable.set(addr, index); }

	getIdentifier(addr: number, index: number): void
	{
		this.hasIdentifierAt(addr) ? this.getString(index, true) : null;
	}

	hasIdentifierAt(addr: number): boolean
	{
		return this._identifierTable.has(addr);
	}

	getString(index: number, global: boolean): string | null
	{
		return (global ? this._globalStrings : this._functionStrings).get(index);
	}

	setFloat(index: number, value: number, global: boolean): void
	{
		(global ? this._globalFloats : this._functionFloats)[index] = value;
	}

	getFloat(index: number, global: boolean): number | null
	{
		return (global ? this._globalFloats : this._functionFloats)[index] ?? null;
	}

	setOp(index: number, op: number): void { this._code[index] = op; }
	getOp(index: number): number { return this._code[index] ?? null; }

	addLineBreakPair(line: number, addr: number): void { this._lineBreakPairs.push([line, addr]); }

	createStringTable(table: string, global: boolean): void
	{
		if (global)
		{
			this._globalStrings = new StringTable(table);
		}
		else
		{
			this._functionStrings = new StringTable(table);
		}
	}
}
