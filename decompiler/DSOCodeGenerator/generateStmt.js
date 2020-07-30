import DSOReturnNode      from '~/DSONode/DSOReturnNode.js';
import DSOConditionalNode from '~/DSONode/DSOConditionalNode.js';
import DSOLoopNode        from '~/DSONode/DSOLoopNode.js';
import DSOFuncDeclNode    from '~/DSONode/DSOFuncDeclNode.js';
import DSOPackageNode     from '~/DSONode/DSOPackageNode.js';

import { DSOCodeGeneratorError } from '~/decompiler/errors.js';
import { DSOStmtNode }           from '~/DSONode/DSONode.js';

import { DSOBreakNode, DSOContinueNode } from '~/DSONode/DSOJumpNode.js';


const generateStmt = function ( node )
{
	const { constructor } = node;

	switch ( constructor )
	{
		case DSOBreakNode:
		{
			return ['break', ';'];
		}

		case DSOContinueNode:
		{
			return ['continue', ';'];
		}

		case DSOReturnNode:
		{
			const array = ['return'];

			if ( node.value !== null )
			{
				array.push (this.generateExpr (node.value));
			}

			array.push (';');

			return array;
		}

		case DSOConditionalNode:
		{
			return [this.generateIfStmt (node)];
		}

		case DSOLoopNode:
		{
			return [this.generateLoop (node)];
		}

		case DSOFuncDeclNode:
		{
			return [this.generateFuncDecl (node)];
		}

		case DSOPackageNode:
		{
			return [this.generatePackage (node)];
		}

		default:
		{
			if ( node instanceof DSOStmtNode )
			{
				throw new DSOCodeGeneratorError (`Unhandled generator statement \`${name}\``);
			}
			else
			{
				return [this.generateExpr (node), ';'];
			}
		}
	}
};


export { generateStmt };
