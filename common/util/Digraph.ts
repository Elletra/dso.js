import { Queue } from "./Queue";


/**
 * A directed graph utility class.
 */
export class Digraph<K, V>
{
	private _edgesFrom: Map<K, K[]>;
	private _edgesTo: Map<K, K[]>;
	private _nodes: Map<K, V>;

	constructor ()
	{
		this._edgesTo = new Map ();
		this._edgesFrom = new Map ();
		this._nodes = new Map ();
	}

	addVertex ( key: K, value: V )
	{
		const existing = this.node (key);

		if ( existing === null || existing !== value )
		{
			this._nodes.set (key, value);
		}

		if ( !this._edgesTo.has (key) )
		{
			this._edgesTo.set (key, []);
		}

		if ( !this._edgesFrom.has (key) )
		{
			this._edgesFrom.set (key, []);
		}
	}

	addEdge ( from: K, to: K ): boolean
	{
		if ( !this.hasKey (from) || !this.hasKey (to) )
		{
			return false;
		}

		const edgesFrom = this._edgesFrom.get (from);
		const edgesTo = this._edgesTo.get (to);

		if ( !edgesFrom.includes (to) )
		{
			edgesFrom.push (to);
		}

		if ( !edgesTo.includes (from) )
		{
			edgesTo.push (from);
		}

		return true;
	}

	hasKey ( key: K ): boolean
	{
		return this._nodes.has (key);
	}

	node ( key: K ): V | null
	{
		return this.hasKey (key) ? this._nodes.get (key) : null;
	}

	edgesFrom ( key: K ): K[] | null
	{
		return this.hasKey (key) ? this._edgesFrom.get (key).slice () : null;
	}

	edgesTo ( key: K ): K[] | null
	{
		return this.hasKey (key) ? this._edgesTo.get (key).slice () : null;
	}

	/**
	 * Returns a generator that does a depth-first search (DFS) over the graph.
	 */
	*dfs ( startKey: K )
	{
		if ( !this.hasKey (startKey) )
		{
			return;
		}

		const visited = new Set<K> ();
		const stack = [];

		stack.push (startKey);
		visited.add (startKey);

		while ( stack.length > 0 )
		{
			const key = stack.pop ();
			const node = this.node (key);

			// The edges must be reversed so they're iterated over in the proper order.
			const edgesFrom = this.edgesFrom (key).reverse ();

			edgesFrom.forEach (edgeKey =>
			{
				if ( !visited.has (edgeKey) )
				{
					stack.push (edgeKey);
					visited.add (edgeKey);
				}
			});

			yield [key, node] as [K, V];
		}
	}

	get size (): number
	{
		return this._nodes.size;
	}

	[Symbol.iterator] ()
	{
		return this._nodes.values ();
	}
};
