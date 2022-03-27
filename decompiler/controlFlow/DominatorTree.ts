import { ControlFlowGraph, CfgNode } from "./ControlFlowGraph";


/**
 * For control flow analysis.
 */
export class DominatorTree
{
	public root: CfgNode;
	private _doms: Map<CfgNode, CfgNode>;

	constructor ( graph: ControlFlowGraph )
	{
		this._init (graph);
	}

	getDominator ( node: CfgNode ): CfgNode
	{
		return this._doms.has (node) ? this._doms.get (node) : null;
	}

	setDominator ( node: CfgNode, dominator: CfgNode )
	{
		this._doms.set (node, dominator);
	}

	dominates ( node: CfgNode, checkDom: CfgNode ): boolean
	{
		if ( !(node instanceof CfgNode) || !(checkDom instanceof CfgNode) )
		{
			return false;
		}

		const { root } = this;

		// The root dominates all.
		if ( checkDom === root )
		{
			return true;
		}

		// Nothing can dominate the root except the root itself.
		if ( node === root )
		{
			return false;
		}

		let dom = this.getDominator (node);

		while ( dom !== checkDom && dom !== root && dom !== null )
		{
			dom = this.getDominator (dom);
		}

		return dom === checkDom;
	}

	[Symbol.iterator] ()
	{
		return this._doms.entries ();
	}

	/**
	 * Private methods
	 */

	private _init ( graph: ControlFlowGraph )
	{
		this.root = graph.root;
		this._doms = new Map ();

		for ( const [, node] of graph )
		{
			this.setDominator (node, null);
		}

		// Entry point always dominates itself.
		this.setDominator (graph.root, graph.root);
	}
};
