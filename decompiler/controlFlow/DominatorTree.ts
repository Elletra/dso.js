import { ControlFlowGraph, CfgNode } from "./ControlFlowGraph";
import { isJumpOpcode } from "../../common/opcodes";


/**
 * For control flow analysis.
 */
export class DominatorTree
{
	private _graph: ControlFlowGraph;
	private _doms: Map<CfgNode, CfgNode>;

	constructor ( graph: ControlFlowGraph )
	{
		this._init (graph);
	}

	/**
	 * Returns the immediate dominator of `node`.
	 */
	getDominator ( node: CfgNode ): CfgNode
	{
		return this._doms.has (node) ? this._doms.get (node) : null;
	}

	/**
	 * Sets the immediate dominator of `node`.
	 */
	setDominator ( node: CfgNode, dominator: CfgNode )
	{
		this._doms.set (node, dominator);
	}

	/**
	 * Checks if `checkDom` dominates `node`. If `strict` is true, it checks for strict domination.
	 */
	dominates ( checkDom: CfgNode, node: CfgNode, strict: boolean = false ): boolean
	{
		if ( !(node instanceof CfgNode) || !(checkDom instanceof CfgNode) )
		{
			return false;
		}

		// All nodes dominate themselves, unless we're checking for strict domination.
		if ( node === checkDom && !strict )
		{
			return true;
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

	/**
	 * Finds loops based on back edges, which are defined as control blocks jumping to dominators.
	 *
	 * @returns {Map<number>, number>} A map of control block addresses, indicating the start and
	 *                                 end blocks of loops.
	 */
	findLoops (): Map<number, number>
	{
		const loopAddrs = new Map ();
		const graph = this._graph;

		for ( const [addr, node] of graph )
		{
			const last = node.lastInstruction ();

			if ( isJumpOpcode (last.op) )
			{
				const jumpTarget = last.operands[0];

				if ( this.dominates (graph.nodeAt (jumpTarget), node) )
				{
					loopAddrs.set (jumpTarget, addr);
				}
			}
		}

		return loopAddrs;
	}

	get root (): CfgNode
	{
		return this._graph.root;
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
		this._graph = graph;
		this._doms = new Map ();

		for ( const [, node] of graph )
		{
			this.setDominator (node, null);
		}

		// Entry point always dominates itself.
		this.setDominator (graph.root, graph.root);
	}
};
