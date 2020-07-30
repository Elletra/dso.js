import assert from '~/util/assert.js';

import DSOConditionalNode from '~/DSONode/DSOConditionalNode.js';


const generateTernary = function ( node )
{
	const array = [this.generateExpr (node.testExpr), '?'];

	assert (node.ifBlock.length === 1, 'Ternary if block should have only one node');
	assert (node.elseBlock.length === 1, 'Ternary else block should have only one node');

	array.push (this.generateExpr (node.ifBlock[0]), ':', this.generateExpr (node.elseBlock[0]));

	return array;
};

const generateIfStmt = function ( node )
{
	const array = ['if', '(', this.generateExpr (node.testExpr), ')'];

	array.push ('{', this.generateCodeArray (node.ifBlock), '}');

	const { elseBlock } = node;

	if ( elseBlock !== null )
	{
		array.push ('else');

		if ( elseBlock.length === 1 && elseBlock[0] instanceof DSOConditionalNode )
		{
			array.push (this.generateIfStmt (elseBlock[0]));
		}
		else
		{
			array.push ('{', this.generateCodeArray (elseBlock), '}');
		}
	}

	return array;
};


export { generateTernary, generateIfStmt };
