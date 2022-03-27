import { DsoData } from "../loader/DsoData";
import { clamp } from "../../common/util/math";

import { Opcode, isValidOpcode } from "../../common/opcodes";


export class BytecodeReader
{
	private _data: DsoData;
	private _ip: number;

	constructor ( data: DsoData )
	{
		this._data = data;
		this._ip = 0;
	}

	reset ()
	{
		this._ip = 0;
	}

	/**
	 * Reads current byte and increments instruction pointer.
	 *
	 * @returns {number} Byte at current instruction pointer. If at end of code, returns -1.
	 */
	read (): number
	{
		return this.isAtEnd () ? -1 : this._data.opcodeAt (this._ip++);
	}

	/**
	 * Reads byte at `addr` without incrementing instruction pointer.
	 *
	 * @returns {number} Byte at `addr`. If `addr` is invalid, returns -1.
	 */
	peek ( addr: number = this.ip )
	{
		return this._data.opcodeAt (addr);
	}

	/**
	 * @returns {number} Size of opcode at `addr`. If invalid opcode, returns 0.
	 */
	opcodeSize ( addr: number ): number
	{
		const opcode = this.peek (addr);

		switch ( opcode )
		{
			case Opcode.OP_FUNC_DECL:
				return 7 + this.peek (addr + 6);

			case Opcode.OP_CALLFUNC:
			case Opcode.OP_CALLFUNC_RESOLVE:
			case Opcode.OP_CREATE_OBJECT:
				return 4;

			case Opcode.OP_LOADIMMED_UINT:
			case Opcode.OP_LOADIMMED_FLT:
			case Opcode.OP_LOADIMMED_STR:
			case Opcode.OP_LOADIMMED_IDENT:
			case Opcode.OP_TAG_TO_STR:
			case Opcode.OP_ADVANCE_STR_APPENDCHAR:
			case Opcode.OP_JMP:
			case Opcode.OP_JMPIF:
			case Opcode.OP_JMPIFF:
			case Opcode.OP_JMPIFNOT:
			case Opcode.OP_JMPIFFNOT:
			case Opcode.OP_JMPIF_NP:
			case Opcode.OP_JMPIFNOT_NP:
			case Opcode.OP_SETCURVAR:
			case Opcode.OP_SETCURVAR_CREATE:
			case Opcode.OP_SETCURFIELD:
			case Opcode.OP_ADD_OBJECT:
			case Opcode.OP_END_OBJECT:
				return 2;

			default:
				return isValidOpcode (opcode) ? 1 : 0;
		}
	}

	isAtEnd (): boolean
	{
		return this._ip >= this._data.codeSize;
	}

	set ip ( addr: number )
	{
		this._ip = clamp (~~addr, 0, this._data.codeSize - 1);
	}

	get ip (): number
	{
		return this._ip;
	}
};
