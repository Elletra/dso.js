import { pushIfTrue } from '~/util/arrays.js';


const generateObjectDecl = function ( node )
{
	const { args, slots, subObjects } = node;

	const array =
	[
		node.isDataBlock ? 'datablock' : 'new',
		this.generateParens (node.classExpr),

		'(', this.generateParens (node.nameExpr),
	];

	pushIfTrue (array, node.parentName !== '', ':', node.parentName);

	for ( let i = 0; i < args.length; i++ )
	{
		array.push (',', this.generateExpr (args[i]));
	}

	array.push (')');

	const hasBody = slots.length > 0 || subObjects.length > 0;

	if ( hasBody )
	{
		array.push ('{');

		for ( let i = 0; i < slots.length; i++ )
		{
			array.push (this.generateExpr (slots[i]), ';');
		}

		for ( let i = 0; i < subObjects.length; i++ )
		{
			array.push (this.generateExpr (subObjects[i]), ';');
		}

		array.push ('}');
	}

	return array;
};


export { generateObjectDecl };
