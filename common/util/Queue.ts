export class ListNode<T>
{
	public value: T;
	public prev: ListNode<T> | null;
	public next: ListNode<T> | null;

	constructor ( value: T, prev: ListNode<T> = null, next: ListNode<T> = null )
	{
		this.value = value;
		this.prev = prev;
		this.next = next;
	}
};

export class Queue<T>
{
	private _head: ListNode<T> | null;
	private _tail: ListNode<T> | null;
	private _size: number;

	constructor ()
	{
		this._head = null;
		this._tail = null;
		this._size = 0;
	}

	enqueue ( value: T )
	{
		const node = new ListNode<T> (value, null, this._head);

		if ( this._head !== null )
		{
			this._head.prev = node;
		}

		this._head = node;

		if ( this._tail === null )
		{
			this._tail = node;
		}

		this._size++;
	}

	dequeue (): T | null
	{
		const node = this._tail;

		if ( !(node instanceof ListNode) )
		{
			return null;
		}

		if ( node.prev !== null )
		{
			node.prev.next = null;
		}

		this._tail = node.prev;

		if ( this._head === node )
		{
			this._head = null;
		}

		this._size--;

		return node.value;
	}

	isEmpty (): boolean
	{
		return this._size <= 0;
	}

	get size (): number
	{
		return this._size;
	}
};
