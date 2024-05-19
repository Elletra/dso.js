export class StringTable
{
	constructor(rawString)
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

	get(index) { return this.has(index) ? this._table.get(index) : null; }
	has(index) { return this._table.has(index); }
}

export class FileData
{
	constructor(version)
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

	get version() { return this._version; }
	get codeSize() { return this._code.length; }

	setIdentifier(addr, index) { this._identifierTable.set(addr, index); }
	getIdentifier(addr, index) { this.hasIdentifierAt(addr) ? this.getString(index, true) : null; }
	hasIdentifierAt(addr) { return this._identifierTable.has(addr); }

	getString(index, global) { return (global ? this._globalStrings : this._functionStrings).get(index); }

	setFloat(index, value, global) { (global ? this._globalFloats : this._functionFloats)[index] = value; }
	getFloat(index, global) { return (global ? this._globalFloats : this._functionFloats)[index] ?? null; }

	setOp(index, op) { this._code[index] = op; }
	getOp(index) { return this._code[index] ?? null; }

	addLineBreakPair(value) { this._lineBreakPairs.push(value); }

	createStringTable(table, global)
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
