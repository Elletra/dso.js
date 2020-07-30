import DSOConditionalNode from '~/DSONode/DSOConditionalNode.js';
import DSOLoopNode        from '~/DSONode/DSOLoopNode.js';

import assert from '~/util/assert.js';

import { DSOElseNode } from '~/DSONode/DSOJumpNode.js';

import { DSOParserError } from '~/decompiler/errors.js';


const parseBlock = function ( token )
{
	const { controlBlock } = this;

	const start = token.value[0];
	const end   = token.value[1];

	assert (controlBlock.hasBlock (start), `Control block at ${start} not found!`);

	const subBlock = controlBlock.getBlock (start);

	if ( subBlock.type === 'conditional' )
	{
		return this.parseConditional (subBlock);
	}

	return this.parseLoop (subBlock);
};

const parseConditional = function ( block )
{
	const ifBlock = this.parseUntil ('MarkerCondEnd', block);

	const { length } = ifBlock;

	let elseBlock = null;

	if ( length > 0 )
	{
		const last = ifBlock[length - 1];

		if ( last instanceof DSOElseNode )
		{
			ifBlock.pop ();

			elseBlock = this.parseUntil ('MarkerElseEnd', block);
		}
	}

	return new DSOConditionalNode (this.popNode (), ifBlock, elseBlock);
};

const parseLoop = function ( block )
{
	const contPoint = block.continuePoint;

	const endToken = (contPoint === null ? 'MarkerLoopEnd' : 'MarkerContinuePoint');
	const loopBody = this.parseUntil (endToken, block, false);

	const marker = this.advance ();

	const testExpr = this.popNode ();

	let initialExpr = null;
	let endExpr     = null;

	if ( contPoint === null )
	{
		// Drop repeat test expression.
		loopBody.pop ();
	}
	else
	{
		const destIP = marker.value;
		const check  = (destIP === contPoint);

		assert (check, `Mistmatched continue points (loop: ${contPoint} jump: ${destIP})`);

		const endBody = this.parseUntil ('MarkerLoopEnd', block);

		// Drop repeat test expression.
		endBody.pop ();

		if ( endBody.length == 1 )
		{
			initialExpr = this.popNode ();
			endExpr     = endBody.pop ();
		}
		else if ( endBody.length > 1 )
		{
			throw new DSOParserError (`Too many expressions after continue point ${contPoint}`);
		}
	}

	return new DSOLoopNode (testExpr, loopBody, initialExpr, endExpr);
};


export { parseBlock, parseConditional, parseLoop };
