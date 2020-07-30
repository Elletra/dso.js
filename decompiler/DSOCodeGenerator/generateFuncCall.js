import { pushIfTrue } from '~/util/arrays.js';


const generateFuncCall = function ( node )
{
	const array = [];

	if ( node.namespace !== null )
	{
		if ( node.callType === 1 )
		{
			array.push (this.generateParens (node.namespace), '.');
		}
		else
		{
			array.push (node.namespace, '::');
		}
	}

	array.push (node.funcName, '(');

	const { args }   = node;
	const { length } = args;

	for ( let i = 0; i < length; i++ )
	{
		array.push (this.generateExpr (args[i]));

		pushIfTrue (array, i < length - 1, ',');
	}

	array.push (')');

	return array;
};


export { generateFuncCall };
