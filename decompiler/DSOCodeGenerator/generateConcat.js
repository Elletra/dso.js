import DSOAssignNode from '~/DSONode/DSOAssignNode.js';

import { DSOCodeGeneratorError } from '~/decompiler/errors.js';


const generateCommaCat = function ( node )
{
	return [this.generateExpr (node.left), ',', this.generateExpr (node.right)];
};

const generateStrConcat = function ( node )
{
	const { appendChar } = node;

	let concatOp = '@';

	if ( appendChar !== null )
	{
		switch ( appendChar )
		{
			case 32:
			{
				concatOp = 'SPC';
				break;
			}

			case 10:
			{
				concatOp = 'NL';
				break;
			}

			case 9:
			{
				concatOp = 'TAB';
				break;
			}

			default:
			{
				throw new DSOCodeGeneratorError (`Unsupported concat char \`${appendChar}\``);
			}
		}
	}

	let right;

	if ( this.shouldAddParens (node, node.right) )
	{
		right = this.generateParens (node.right);
	}
	else
	{
		right = this.generateExpr (node.right);
	}

	let left;

	if ( this.shouldAddParens (node, node.left) )
	{
		left = this.generateParens (node.left);
	}
	else
	{
		left = this.generateExpr (node.left);
	}

	return [left, concatOp, right];
};


export { generateCommaCat, generateStrConcat };
