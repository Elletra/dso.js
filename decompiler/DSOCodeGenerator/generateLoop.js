const generateLoop = function ( node )
{
	let array;

	if ( node.initialExpr === null )
	{
		array = ['while', '(', this.generateExpr (node.testExpr), ')', '{'];
	}
	else
	{
		array =
		[
			'for',
			'(',
			this.generateExpr (node.initialExpr), ';\\',
			this.generateExpr (node.testExpr), ';\\',
			this.generateExpr (node.endExpr),
			')',
			'{',
		];
	}

	const { body }   = node;
	const { length } = body;

	for ( let i = 0; i < length; i++ )
	{
		array.push (this.generateStmt (body[i]));
	}

	array.push ('}');

	return array;
};


export { generateLoop };
