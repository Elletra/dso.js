class DSONode
{
	constructor ()
	{
		this.inParens = false;
	}

	/**
	 * @returns {boolean} Whether or not it can be part of a return value.
	 */
	isReturnable ()
	{
		return true;
	}

	/**
	 * @returns {boolean} Whether or not this operation is associative.
	 */
	isAssociative ()
	{
		return false;
	}

	/**
	 * @returns {integer} Operator precedence.
	 */
	getPrecedence ()
	{
		return Infinity;
	}
}

class DSOExprNode extends DSONode
{
	constructor ()
	{
		super ();
		this.inParens = true;
	}
}

class DSOStmtNode extends DSONode
{
	isReturnable ()
	{
		return false;
	}
}


export { DSONode, DSOExprNode, DSOStmtNode };
