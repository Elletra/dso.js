import DSOBinaryNode from '~/DSONode/DSOBinaryNode.js';

import assert from '~/util/assert.js';


const parseBinary = function ( op, type )
{
	let left;
	let right;

	if ( type === 'OpcodeLogicJump' )
	{
		left  = this.popNode ();
		right = this.parseUntil ('MarkerLogicEnd');

		assert (right.length === 1, `Binary can only have one right expr (${this.currPos - 1})`);

		right = right[0];
	}
	else if ( type === 'OpcodeCompareStr' )
	{
		right = this.popNode ();
		left  = this.popNode ();
	}
	else
	{
		left  = this.popNode ();
		right = this.popNode ();
	}

	return new DSOBinaryNode (left, right, op);
};


export { parseBinary };
