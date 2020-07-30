import DSOPackageNode  from '~/DSONode/DSOPackageNode.js';
import DSOFuncDeclNode from '~/DSONode/DSOFuncDeclNode.js';
import DSOReturnNode   from '~/DSONode/DSOReturnNode.js';

import assert from '~/util/assert.js';

import { DSOParserError } from '~/decompiler/errors.js';
import { DSOStmtNode }    from '~/DSONode/DSONode.js';

import { DSOElseNode, DSOBreakNode, DSOContinueNode } from '~/DSONode/DSOJumpNode.js';


const parseFuncDecl = function ( token )
{
	const { funcName, namespace, packageName, args } = token;

	let node  = new DSOFuncDeclNode (funcName, namespace, packageName, args);
	node.body = this.parseUntil ('MarkerFuncEnd');

	if ( packageName !== null )
	{
		const prevNode = this.peekNode ();

		if ( prevNode instanceof DSOPackageNode && prevNode.name === packageName )
		{
			prevNode.addFunction (node);
			node = null;
		}
		else
		{
			node = new DSOPackageNode (packageName, node);
		}
	}

	return node;
};

const parseReturn = function ( returnsValue )
{
	const prevNode = this.peekNode ();

	if ( returnsValue && prevNode !== null && prevNode.isReturnable () )
	{
		return new DSOReturnNode (this.popNode ());
	}

	return new DSOReturnNode ();
};

const parseJump = function ( token )
{
	const { controlBlock } = this;

	const sourceIP = token.value[0];
	const destIP   = token.value[1];

	assert (controlBlock.hasJump (sourceIP), `Jump at ${sourceIP} not found!`);

	const jumpInfo = controlBlock.getJump (sourceIP);

	switch ( jumpInfo.type )
	{
		case 'ifElse':   return new DSOElseNode (sourceIP, destIP);
		case 'break':    return new DSOBreakNode (sourceIP, destIP);
		case 'continue': return new DSOContinueNode (sourceIP, destIP);
	}

	throw new DSOParserError (`Unknown jump type \`${jumpInfo.type}\``);
};


export { parseFuncDecl, parseReturn, parseJump };
