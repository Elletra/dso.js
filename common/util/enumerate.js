/**
 * @param {string[]} arrayOfStrings
 * @param {integer}  [startIndex=0]
 *
 * @returns {Object}
 */
const enumerate = ( arrayOfStrings = null, startIndex = 0 ) =>
{
	if ( arrayOfStrings === null || !Array.isArray (arrayOfStrings) )
	{
		return null;
	}

	const enums      = {};
	const { length } = arrayOfStrings;

	for ( let i = 0; i < length; i++ )
	{
		enums[arrayOfStrings[i]] = startIndex + i;
	}

	return Object.freeze (enums);
};


export default enumerate;
