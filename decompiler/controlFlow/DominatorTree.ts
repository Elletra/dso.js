import { ControlFlowGraph, CfgNode } from "./ControlFlowGraph";


/**
 * For control flow analysis.
 */
export class DominatorTree
{
	private _doms: Map<CfgNode, CfgNode>;

	constructor ()
	{
		this._doms = new Map ();
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
};
