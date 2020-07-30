/**
 * @param {number} number
 * @param {number} min
 * @param {number} max
 *
 * @returns {number} Number clamped to range [min, max]
 */
const clamp = ( number, min, max ) =>
{
	return Math.min (Math.max (number, min), max);
};


export default clamp;
