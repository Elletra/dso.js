import DSOObjectDeclNode from '~/DSONode/DSOObjectDeclNode.js';
import DSOFuncCallNode   from '~/DSONode/DSOFuncCallNode.js';

import assert from '~/util/assert.js';


const parsePushFrame = function ()
{
	const startPos = this.currPos - 1;
	const args     = [];

	let currToken = this.peek ();

	while ( currToken.type !== 'OpcodeCreateObj' && currToken.type !== 'OpcodeFuncCall' )
	{
		const arg = this.parseUntil ('OpcodePush');

		assert (arg.length <= 1, `Argument has more than one expression at ${startPos}`);

		args.push (arg[0]);
		currToken = this.peek ();
	}

	this.advance ();

	if ( currToken.type === 'OpcodeCreateObj' )
	{
		return this.parseObjectDecl (currToken, args);
	}

	return this.parseFuncCall (currToken.value, args);
};

const parseObjectDecl = function ( token, args )
{
	const classExpr = args.shift ();
	const nameExpr  = args.shift ();

	const node = new DSOObjectDeclNode (classExpr, nameExpr, args);

	node.parentName  = token.value[0];
	node.isDataBlock = token.value[1];

	node.slots       = this.parseUntil ('OpcodeObjSection', this.controlBlock, false);
	node.placeAtRoot = this.advance ().value;
	node.subObjects  = this.parseUntil ('OpcodeObjSection');

	if ( node.placeAtRoot )
	{
		// If this is a root object, it'll have a preceding 0 for some reason, so we drop that.
		this.popNode ();
	}

	return node;
};

const parseFuncCall = function ( values, args )
{
	const funcName = values[0];
	const callType = values[2];

	let namespace = values[1];

	if ( namespace === null && callType === 1 )
	{
		namespace = args.shift ();
	}

	return new DSOFuncCallNode (funcName, namespace, callType, args);
};


export { parsePushFrame, parseObjectDecl, parseFuncCall };
