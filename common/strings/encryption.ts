import { ENCRYPTION_KEY } from "./constants";


/**
 * Blockland's two-way string encryption.
 *
 * @param {string} str - Encrypted or unencrypted string -- The opposite will be returned.
 * @returns {string}
 */
export const stringEncryption = ( str: string = "" ) =>
{
	if ( str === "" || typeof str !== "string" )
	{
		return "";
	}

	let encrypted = "";

	const { length } = str;

	for ( let i = 0; i < length; i++ )
	{
		encrypted += String.fromCharCode (str.charCodeAt (i) ^ ENCRYPTION_KEY.charCodeAt (i % 9));
	}

	return encrypted;
};
