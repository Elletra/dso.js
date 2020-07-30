const keywords = new Set (
[
	'if',
	'else',
	'package',
	'function',
	'while',
	'for',
	'datablock',
	'new',
	'break',
	'continue',
	'return',
]);


const isKeyword = str =>
{
	return keywords.has (str);
};


export { isKeyword };
