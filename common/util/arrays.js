/**
 * @param {Array}   array
 * @param {boolean} test
 * @param {...*}    values
 */
const pushIfTrue = ( array, test, ...values ) =>
{
	if ( test )
	{
		array.push (...values);
	}
};

/**
 * @param {Array}   array
 * @param {Integer} index
 *
 * @returns {*|null} null if at end of the array.
 */
const arrayPeek = ( array, index ) =>
{
	return index >= 0 && index < array.length ? array[index] : null;
};


export { pushIfTrue, arrayPeek };
