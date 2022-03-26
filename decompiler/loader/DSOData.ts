import { Opcode } from "../../common/opcodes";


export type StringTable = Map<number, string>;
export type FloatTable = Map<number, number>;
export type IdentTable = Map<number, number>;


/**
 * Stores and retrieves DSO file data.
 */
export class DSOData
{
	static Error = class extends Error {};

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
		switch ( op )
		{
			case Opcode.OP_LOADIMMED_STR:
			case Opcode.OP_TAG_TO_STR:
				return this.stringTableValue (value, inFunc);

			case Opcode.OP_LOADIMMED_IDENT:
				return this.stringTableValue (value, false);

			case Opcode.OP_LOADIMMED_FLT:
				return this.floatTableValue (value, inFunc);

			case Opcode.OP_LOADIMMED_UINT:
				return value;

			default:
				throw new DSOData.Error (`Could not find \`${value}\` (op: ${op} | in func: ${inFunc})`);
		}
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

	/**
	 * @returns {number} Opcode at `addr`. If `addr` is invalid, returns -1.
	 */
	opcodeAt ( addr: number ): number
	{
		return Number.isInteger (addr) && addr >= 0 && addr < this.code.length ? this.code[addr] : -1;
	}

	get codeSize (): number
	{
		return this.code.length;
	}
};
