import DSOBinaryNode from '~/DSONode/DSOBinaryNode.js';

import assert from '~/util/assert.js';

import { has } from '~/util/has.js';

import * as generateStmt        from '~/DSOCodeGenerator/generateStmt.js';
import * as generateConstant    from '~/DSOCodeGenerator/generateConstant.js';
import * as generateFuncCall    from '~/DSOCodeGenerator/generateFuncCall.js';
import * as generateObjectDecl  from '~/DSOCodeGenerator/generateObjectDecl.js';
import * as generateAssign      from '~/DSOCodeGenerator/generateAssign.js';
import * as generateLoop        from '~/DSOCodeGenerator/generateLoop.js';
import * as generateExpr        from '~/DSOCodeGenerator/generateExpr.js';
import * as generateCode        from '~/DSOCodeGenerator/generateCode.js';
import * as generateNary        from '~/DSOCodeGenerator/generateNary.js';
import * as generateConcat      from '~/DSOCodeGenerator/generateConcat.js';
import * as generateConditional from '~/DSOCodeGenerator/generateConditional.js';
import * as generateFuncDecl    from '~/DSOCodeGenerator/generateFuncDecl.js';


/**
 * Generates TorqueScript code from DSONodes.
 *
 * @usage Create a DSOCodeGenerator instance with an array of DSONodes, then call .generateCode()
 */
class DSOCodeGenerator
{
	/**
	 * @param {DSONode[]} nodes
	 */
	constructor ( nodes )
	{
		this.nodes       = nodes;
		this.indentation = 0;
	}

	/**
	 * @param   {DSONode[]} [nodes=this.nodes]
	 * @returns {string}
	 */
	generateCode ( nodes = this.nodes )
	{
		return this.generateCodeString (this.generateCodeArray (nodes));
	}

	/**
	 * @param {DSONode} node1
	 * @param {DSONode} node2
	 *
	 * @returns {boolean}
	 */
	shouldAddParens ( node1, node2 )
	{
		if ( node1.constructor === node2.constructor && node1.isAssociative () &&
			 node2.isAssociative () )
		{
			if ( node1 instanceof DSOBinaryNode )
			{
				return node1.op !== node2.op;
			}

			return false;
		}

		return node2.inParens && node2.getPrecedence () >= node1.getPrecedence ();
	}

	/**
	 * @param {Array} array
	 */
	indent ( array )
	{
		array.push (++this.indentation);
	}

	/**
	 * @param {Array} array
	 */
	unindent ( array )
	{
		array.push (--this.indentation);
	}
}

Object.assign (DSOCodeGenerator.prototype,
{
	...generateStmt,        ...generateConstant,
	...generateFuncCall,    ...generateObjectDecl,
	...generateAssign,      ...generateLoop,
	...generateExpr,        ...generateCode,
	...generateNary,        ...generateConcat,
	...generateConditional, ...generateFuncDecl,
});


export default DSOCodeGenerator;
