/**
 * Escapes special characters like backslashes, quotes, newlines, as well as
 * any control or non-ASCII characters.
 *
 * @param   {string} inputStr
 * @returns {string}
 */
const escapeChars = inputStr =>
{
	inputStr = inputStr.replace (/\\/g, '\\\\').replace (/\t/g, '\\t').
	                    replace (/\n/g, '\\n').replace (/\r/g, '\\r').
	                    replace (/'/g, '\\\'').replace (/"/g, '\\"').
	                    replace (/\cA/g, '\\c0').replace (/\cB/g, '\\c1').
	                    replace (/\cC/g, '\\c2').replace (/\cD/g, '\\c3').
	                    replace (/\cE/g, '\\c4').replace (/\cF/g, '\\c5').
	                    replace (/\cG/g, '\\c6').replace (/\cK/g, '\\c7').
	                    replace (/\cL/g, '\\c8').replace (/\cN/g, '\\c9').
	                    replace (/\cO/g, '\\cr').replace (/\cP/g, '\\cp').
	                    replace (/\cQ/g, '\\co');

	const { length } = inputStr;

	let escaped = '';

	for ( let i = 0; i < length; i++ )
	{
		const charCode = inputStr.charCodeAt (i);

		if ( charCode < 32 || charCode > 126 )
		{
			escaped += `\\x${charCode.toString (16)}`;
		}
		else
		{
			escaped += inputStr.charAt (i);
		}
	}

	return escaped;
};


export default escapeChars;
