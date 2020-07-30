/**
 * @param   {*} obj
 * @returns {*}
 */
const deepFreeze = obj =>
{
	if ( !Object.isFrozen (obj) )
	{
		if ( Array.isArray (obj) )
		{
			const { length } = obj;

			for ( let i = 0; i < length; i++ )
			{
				deepFreeze (obj[i]);
			}

			Object.freeze (obj);
		}
		else if ( typeof obj === 'object' )
		{
			for ( let i in obj )
			{
				deepFreeze (obj[i]);
			}

			Object.freeze (obj);
		}
	}

	return obj;
};


export default deepFreeze;
