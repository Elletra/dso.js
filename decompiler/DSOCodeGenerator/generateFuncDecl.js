import { pushIfTrue } from '~/util/arrays.js';


const generatePackage = function ( node )
{
	const array = ['package', node.name, '{'];

	const { funcNodes } = node;
	const { length }    = funcNodes;

	for ( let i = 0; i < length; i++ )
	{
		array.push (this.generateStmt (funcNodes[i]));
	}

	array.push ('}', ';', '\n');

	return array;
};

const generateFuncDecl = function ( node )
{
	const array = ['function'];

	pushIfTrue (array, node.namespace !== null, node.namespace, '::');
	array.push (node.funcName, '(');

	const { args, body } = node;

	for ( let i = 0; i < args.length; i++ )
	{
		array.push (args[i]);
		pushIfTrue (array, i < args.length - 1, ',');
	}

	array.push (')', '{');

	for ( let i = 0; i < body.length; i++ )
	{
		array.push (this.generateStmt (body[i]));
	}

	array.push ('}', '\n');

	return array;
};


export { generatePackage, generateFuncDecl };
