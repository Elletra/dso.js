/**
 * A map of arrays.
 */
class ArrayMap
{
	constructor ()
	{
		this.map  = new Map ();
		this.size = 0;
	}

	/**
	 * Pushes a value at the key.
	 *
	 * @param {*} key
	 * @param {*} value
	 *
	 * @returns {integer} Number of values now at that key.
	 */
	push ( key, value )
	{
		const { map } = this;

		if ( !map.has (key) )
		{
			map.set (key, []);
		}

		map.get (key).push (value);
		this.size++;

		return map.get (key).length;
	}

	/**
	 * Pops a value from a key.
	 *
	 * @param   {*} key
	 * @returns {*}
	 */
	pop ( key )
	{
		const { map } = this;

		let popped = null;

		if ( map.has (key) )
		{
			const array = map.get (key);

			popped = array.pop ();
			this.size--;

			// Delete empty arrays to prevent potential memory leaks.
			if ( array.length <= 0 )
			{
				map.delete (key);
			}
		}

		return popped;
	}

	/**
	 * Deletes all values at a key.
	 *
	 * @param {*} key
	 */
	delete ( key )
	{
		const { map } = this;

		if ( map.has (key) )
		{
			this.size -= map.get (key).length;
		}

		map.delete (key);
	}

	/**
	 * Get all values at a key.
	 *
	 * @param   {*} key
	 * @returns {Array|null} An array of all the values, or null if there are no values.
	 */
	get ( key )
	{
		if ( this.map.has (key) )
		{
			return this.map.get (key).slice ();
		}

		return null;
	}

	/**
	 * @param   {*} key
	 * @returns {boolean}
	 */
	has ( key, value )
	{
		return this.map.has (key);
	}

	/**
	 * Gets number of values at a key.
	 *
	 * @param   {*} key
	 * @returns {integer}
	 */
	count ( key )
	{
		return this.map.has (key) ? this.map.get (key).length : 0;
	}

	clear ()
	{
		this.map.clear ();
		this.size = 0;
	}

	*[Symbol.iterator] ()
	{
		const { map } = this;

		for ( let [key, array] of map )
		{
			const { length } = array;

			for ( let i = 0; i < length; i++ )
			{
				yield [key, array[i]];
			}
		}
	}
}


export default ArrayMap;
