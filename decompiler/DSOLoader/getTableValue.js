import { DSOLoaderError } from '~/decompiler/errors.js';

import { has }   from '~/util/has.js';
import { enums } from '~/common/opcodes.js';

const
{
	OP_LOADIMMED_UINT,
	OP_LOADIMMED_FLT,
	OP_LOADIMMED_STR,
	OP_LOADIMMED_IDENT,
	OP_TAG_TO_STR,
}
= enums;


const getString = function ( index, isFunction = false )
{
	const table = isFunction ? this.functionStringTable : this.globalStringTable;

	return has (table, index) ? table[index] : null;
};

const getFloat = function ( index, isFunction = false )
{
	const table = isFunction ? this.functionFloatTable : this.globalFloatTable;

	return has (table, index) ? table[index] : null;
};

const getTableValue = function ( op, value, inFunction )
{
	let tableValue = null;

	switch ( op )
	{
		case OP_LOADIMMED_STR:
		case OP_TAG_TO_STR:
		{
			tableValue = this.getString (value, inFunction);
			break;
		}

		case OP_LOADIMMED_IDENT:
		{
			tableValue = this.getString (value, false);
			break;
		}

		case OP_LOADIMMED_FLT:
		{
			tableValue = this.getFloat (value, inFunction);
			break;
		}

		case OP_LOADIMMED_UINT:
		{
			tableValue = value;
			break;
		}
	}

	if ( tableValue === null )
	{
		throw new DSOLoaderError (`Could not find ${value} (op: ${op} | in func: ${inFunction})`);
	}

	return tableValue;
};


export { getString, getFloat, getTableValue };
