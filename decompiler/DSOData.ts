import { Opcode } from "../common/opcodes";


export type StringTable = Map<number, string>;
export type FloatTable = Map<number, number>;
export type IdentTable = Map<number, number>;


/**
 * Stores and retrieves DSO file data.
 */
export class DSOData
{
	static Error = class extends Error {}

	public version: number;

	public code: number[];

	public globalStringTable: StringTable;
	public funcStringTable: StringTable;

	public globalFloatTable: FloatTable;
	public funcFloatTable: FloatTable;

	public identTable: IdentTable;
	public lineBreakPairs: number[];

	constructor ( version: number )
	{
		this.version = version;

		this.code = [];
		this.lineBreakPairs = [];

		this.globalStringTable = new Map ();
		this.funcStringTable = new Map ();

		this.globalFloatTable = new Map ();
		this.funcFloatTable = new Map ();

		this.identTable = new Map ();
	}

	tableValue ( op: Opcode, value: number, inFunc: boolean )
	{
		let tableValue = null;

		switch ( op )
		{
			case Opcode.OP_LOADIMMED_STR:
			case Opcode.OP_TAG_TO_STR:
				tableValue = this.stringTableValue (value, inFunc);
				break;

			case Opcode.OP_LOADIMMED_IDENT:
				tableValue = this.stringTableValue (value, false);
				break;

			case Opcode.OP_LOADIMMED_FLT:
				tableValue = this.floatTableValue (value, inFunc);
				break;

			case Opcode.OP_LOADIMMED_UINT:
				tableValue = value;
				break;
		}

		if ( tableValue === null )
		{
			throw new DSOData.Error (`Could not find ${value} (op: ${op} | in func: ${inFunc})`);
		}

		return tableValue;
	}

	stringTableValue ( index: number, inFunc: boolean = false ): string
	{
		const table = inFunc ? this.funcStringTable : this.globalStringTable;

		return table.has (index) ? table.get (index) : null;
	}

	floatTableValue ( index: number, inFunc: boolean = false ): number
	{
		const table = inFunc ? this.funcFloatTable : this.globalFloatTable;

		return table.has (index) ? table.get (index) : null;
	}

	opcodeAt ( ip: number ): number
	{
		return Number.isInteger (ip) && ip >= 0 && ip < this.code.length ? this.code[ip] : -1;
	}

	get codeSize (): number
	{
		return this.code.length;
	}
};
