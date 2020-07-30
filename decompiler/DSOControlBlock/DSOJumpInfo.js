/**
 * For storing information on jump sources/destinations.
 */
class DSOJumpInfo
{
	/**
	 * @param {integer}        sourceIP
	 * @param {integer}        destIP
	 * @param {DSOControlBlock} block
	 */
	constructor ( sourceIP, destIP, block )
	{
		this.sourceIP = sourceIP;
		this.destIP   = destIP;
		this.block    = block;

		// OR, AND, break, continue, or ifElse
		this.type = 'ifElse';

		// Whether the type was not set and just defaulted to ifElse.
		this.assumedType = true;
	}

	/**
	 * @param {string} type - OR, AND, break, continue, or ifElse
	 */
	setType ( type )
	{
		this.type        = type;
		this.assumedType = false;
	}
}


export default DSOJumpInfo;
