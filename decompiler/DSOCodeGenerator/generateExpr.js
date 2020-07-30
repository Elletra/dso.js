import DSOConstantNode    from '~/DSONode/DSOConstantNode.js';
import DSOVariableNode    from '~/DSONode/DSOVariableNode.js';
import DSOSlotNode        from '~/DSONode/DSOSlotNode.js';
import DSOUnaryNode       from '~/DSONode/DSOUnaryNode.js';
import DSOBinaryNode      from '~/DSONode/DSOBinaryNode.js';
import DSOAssignNode      from '~/DSONode/DSOAssignNode.js';
import DSOStrConcatNode   from '~/DSONode/DSOStrConcatNode.js';
import DSOCommaCatNode    from '~/DSONode/DSOCommaCatNode.js';
import DSOFuncCallNode    from '~/DSONode/DSOFuncCallNode.js';
import DSOConditionalNode from '~/DSONode/DSOConditionalNode.js';
import DSOObjectDeclNode  from '~/DSONode/DSOObjectDeclNode.js';

import { DSOCodeGeneratorError } from '~/decompiler/errors.js';


const generateExpr = function ( node )
{
	const { constructor } = node;

	switch ( constructor )
	{
		case DSOConstantNode:
		{
			return this.generateConstant (node);
		}

		case DSOVariableNode:
		{
			return this.generateVariable (node);
		}

		case DSOSlotNode:
		{
			return this.generateSlot (node);
		}

		case DSOUnaryNode:
		{
			return this.generateUnary (node);
		}

		case DSOBinaryNode:
		{
			return this.generateBinary (node);
		}

		case DSOAssignNode:
		{
			return this.generateAssign (node);
		}

		case DSOStrConcatNode:
		{
			return this.generateStrConcat (node);
		}

		case DSOCommaCatNode:
		{
			return this.generateCommaCat (node);
		}

		case DSOFuncCallNode:
		{
			return this.generateFuncCall (node);
		}

		case DSOConditionalNode:
		{
			return this.generateTernary (node);
		}

		case DSOObjectDeclNode:
		{
			return this.generateObjectDecl (node);
		}

		default:
		{
			throw new DSOCodeGeneratorError (`Unhandled generator expression \`${name}\``);
		}
	}
};

const generateParens = function ( node )
{
	const generated = this.generateExpr (node);

	if ( node.inParens )
	{
		return ['(', generated, ')'];
	}

	return generated;
};

const generateBranch = function ( node, branch )
{
	if ( this.shouldAddParens (node, branch) )
	{
		return this.generateParens (branch);
	}

	return this.generateExpr (branch);
};


export { generateExpr, generateParens, generateBranch };
