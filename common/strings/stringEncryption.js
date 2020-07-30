import { ENCRYPTION_KEY } from '~/common/strings/constants.js';


/**
 * Blockland's two-way string encryption.
 *
 * @param {string} string - Encrypted or unencrypted string -- the opposite will be returned.
 *
 * @returns {string|null} null if invalid string
 */
const stringEncryption = ( string = null ) =>
{
	if ( string === null || typeof string !== 'string' )
	{
		return null;
	}

	let encrypted = '';

	const { length } = string;

	for ( let i = 0; i < length; i++ )
	{
		encrypted += String.fromCharCode (string.charCodeAt (i) ^ ENCRYPTION_KEY.charCodeAt (i % 9));
	}

	return encrypted;
};


export default stringEncryption;
