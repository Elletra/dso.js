/**
 * @param {boolean} test
 * @param {string}  message
 *
 * @throws {Error} If `test` is falsy.
 */
const assert = ( test, message ) =>
{
	if ( !test )
	{
		throw new Error (`Assertion Error: ${message}`);
	}
};


export default assert;
