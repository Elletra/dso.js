import DSOAssignNode   from '~/DSONode/DSOAssignNode.js';
import DSOVariableNode from '~/DSONode/DSOVariableNode.js';
import DSOSlotNode     from '~/DSONode/DSOSlotNode.js';

import { enums } from '~/common/opcodes.js';

const { OP_SETCUROBJECT } = enums;


const parseAssign = function ( operator = null )
{
	return new DSOAssignNode (this.popNode (), this.popNode (), operator);
};

const parseVariable = function ( token, isArray = false )
{
	let varName;
	let arrayExpr = null;

	if ( isArray )
	{
		arrayExpr = this.popNode ();
		varName   = this.popNode ().value;
	}
	else
	{
		varName = token.value;
	}

	this.advanceIfType ('OpcodeLoadVar');

	return new DSOVariableNode (varName, arrayExpr);
};

const parseSlot = function ( op, isArray = false )
{
	let node;

	if ( isArray )
	{
		node = this.popNode ();
		node.arrayExpr = this.popNode ();
	}
	else
	{
		const slotName = this.advance ().value;
		node = new DSOSlotNode (slotName, op === OP_SETCUROBJECT ? this.popNode () : null);
	}

	this.advanceIfType ('OpcodeLoadField');

	return node;
};


export { parseAssign, parseVariable, parseSlot };
