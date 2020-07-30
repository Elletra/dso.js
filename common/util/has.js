const { hasOwnProperty } = Object.prototype;

/**
 * Safe wrapper for `object.hasOwnProperty()`
 *
 * @param {Object} object
 * @param {string} key
 *
 * @returns {boolean}
 */
const has = ( object, key ) =>
{
	return hasOwnProperty.call (object, key);
};

/**
 * @param {Object} object
 * @param {string} funcName
 *
 * @returns {boolean}
 */
const hasFunction = ( object, funcName ) =>
{
	return typeof object[funcName] === 'function';
}


export { has, hasFunction };
