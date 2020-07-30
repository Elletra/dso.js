import StringStream from '~/common/strings/StringStream.js';

import { arrayPeek } from '~/util/arrays.js';
import { isKeyword } from '~/common/keywords.js';

import { isOperator, isUnaryOperator } from '~/common/operators.js';


// Characters that prevent a closing bracket from adding a newline.
const noNewlines = new Set (['}', ')', ']', ',', '.', '?', ':', ';']);


const generateCodeArray = function ( nodeArray = this.nodes )
{
	const { length } = nodeArray;

	const array = [];

	for ( let i = 0; i < length; i++ )
	{
		array.push (this.generateStmt (nodeArray[i]));
	}

	return array;
};

const generateCodeString = function ( array = [] )
{
	array = array.flat (Infinity);

	const codeStr = new StringStream ();

	const { length } = array;

	for ( let i = 0; i < length; i++ )
	{
		const str = array[i];

		switch ( str )
		{
			case ',':
			{
				codeStr.write (', ');
				break;
			}

			case '{':
			{
				codeStr.writeLine ('{\n');
				codeStr.indent ();
				codeStr.writeIndent ();

				break;
			}

			case '}':
			{
				codeStr.unindent ();
				codeStr.writeLine ('}');

				if ( !noNewlines.has (arrayPeek (array, i + 1)) )
				{
					codeStr.write ('\n');
					codeStr.writeIndent ();
				}

				break;
			}

			case ';':
			{
				codeStr.write (';');

				if ( arrayPeek (array, i + 1) !== '}' )
				{
					codeStr.write ('\n');
					codeStr.writeIndent ();
				}

				break;
			}

			case ';\\':
			{
				codeStr.write ('; ');
				break;
			}

			default:
			{
				if ( isUnaryOperator (str) && str !== '-' )
				{
					if ( str === '<NEG>' )
					{
						codeStr.write ('-');
					}
					else
					{
						codeStr.write (str);
					}
				}
				else if ( isOperator (str) )
				{
					codeStr.writePadded (str);
				}
				else if ( isKeyword (str) )
				{
					const peek = arrayPeek (array, i + 1);

					if ( peek === ';' )
					{
						codeStr.write (str);
					}
					else
					{
						codeStr.write (str + ' ');
					}
				}
				else
				{
					codeStr.write (str);

					if ( str !== '(' && arrayPeek (array, i + 1) === '(' )
					{
						codeStr.write (' ');
					}
				}

				break;
			}
		}
	}

	return codeStr.toString ();
};


export { generateCodeArray, generateCodeString };
