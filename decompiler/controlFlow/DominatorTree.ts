import { ControlFlowGraph, CfgNode } from "./ControlFlowGraph";


/**
 * For control flow analysis.
 */
export class DominatorTree
{
	private _doms: Map<CfgNode, CfgNode>;
	public root: CfgNode;

	constructor ( graph: ControlFlowGraph )
	{
		this._init (graph);
	}

	getDominator ( node: CfgNode ): CfgNode
	{
		return this._doms.get (node)
	}

	setDominator ( node: CfgNode, dominator: CfgNode )
	{
		this._doms.set (node, dominator);
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
