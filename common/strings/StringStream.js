import clamp from '~/util/clamp.js';


/**
 * A class for easily creating multiline strings.
 */
class StringStream
{
	/**
	 * @param {string}  [initialValue=""] - Initial string value.
	 * @param {integer} [intialIndent=0]  - Initial indentation amount.
	 */
	constructor ( initialValue = '', initialIndent = 0 )
	{
		this.value       = initialValue;
		this.indentation = initialIndent;

		this.lines = 0;
	}

	/**
	 * Write to the current string line.
	 *
	 * @param {string} [str=""]
	 */
	write ( str = '' )
	{
		this.value += str;
	}

	/**
	 * Write a new string line.
	 *
	 * @param {string} [line=""]
	 */
	writeLine ( line = '' )
	{
		if ( this.value !== '' )
		{
			this.value += '\n';
		}

		this.writeIndent ();
		this.value += line;

		this.lines++;
	}

	writeIndent ()
	{
		const { indentation } = this;

		for ( let i = 0; i < indentation; i++ )
		{
			this.value += '\t';
		}
	}

	/**
	 * Write string to the current string line with spaces around it.
	 *
	 * @param {string} [str=""]
	 */
	writePadded ( str = '' )
	{
		this.value += ` ${str} `;
	}

	/**
	 * Increase the indentation amount.
	 *
	 * @param {integer} [amount=1]
	 */
	indent ( amount = 1 )
	{
		this.indentation += amount;
	}

	/**
	 * Decrease the indentation amount.
	 *
	 * @param {integer} [amount=1]
	 */
	unindent ( amount = 1 )
	{
		this.indentation = Math.max (0, this.indentation - amount);
	}

	/**
	 * @returns {string} The string value.
	 */
	toString ()
	{
		return this.value;
	}
}


export default StringStream;
