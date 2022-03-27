import { DominatorTree } from "./DominatorTree";
import { Queue } from "../../common/util/Queue";

import { ControlFlowGraph, CfgNode } from "./ControlFlowGraph";


/**
 * Creates a dominator tree for control flow analysis.
 */
export class DomTreeBuilder
{
	private _nodes: CfgNode[];
	private _domTree: DominatorTree;
	private _order: number;

	build ( graph: ControlFlowGraph ): DominatorTree
	{
		this._init (graph);
		this._buildNodeArray (graph);
		this._buildDomTree (graph);

		return this._domTree;
	}

	/**
	 * Private methods
	 */

	private _init ( graph: ControlFlowGraph )
	{
		this._nodes = new Array (graph.size);
		this._domTree = new DominatorTree ();
		this._order = 0;
	}

	/**
	 * Build an array of nodes indexed by their `.order` field.
	 */
	private _buildNodeArray ( graph: ControlFlowGraph )
	{
		for ( const [, node] of graph )
		{
			this._nodes[node.order] = node;
		}
	}

	/**
	 * "A Simple, Fast Dominance Algorithm" by Keith Cooper, Timothy Harvey, and Ken Kennedy.
	 *
	 * https://www.cs.rice.edu/~keith/EMBED/dom.pdf
	 */
	private _buildDomTree ( graph: ControlFlowGraph )
	{
		let newIDom: CfgNode;
		let changed = true;

		// Initialize dominator tree.
		this._nodes.forEach (node => this._domTree.setDominator (node, null));

		// Entry point dominates itself.
		this._domTree.setDominator (graph.entryPoint, graph.entryPoint);

		while ( changed )
		{
			changed = false;

			const numNodes = this._nodes.length;

			for ( let i = numNodes - 2; i >= 0; i-- )
			{
				const node = this._nodes[i];
				const predecessors = new Set (node.parents);

				// Find first predecessor whose dominator has been calculated.
				for ( const pred of predecessors )
				{
					if ( this._domTree.getDominator (pred) !== null )
					{
						newIDom = pred;
						predecessors.delete (pred);
						break;
					}
				}

				for ( const pred of predecessors )
				{
					if ( this._domTree.getDominator (pred) !== null )
					{
						newIDom = this._intersectDoms (pred, newIDom);
					}
				}

				if ( this._domTree.getDominator (node) !== newIDom )
				{
					this._domTree.setDominator (node, newIDom);
					changed = true;
				}
			}
		}
	}

	/**
	 * Find first common dominator between two nodes.
	 * ----------------------------------------------
	 * "A Simple, Fast Dominance Algorithm" by Keith Cooper, Timothy Harvey, and Ken Kennedy.
	 *
	 * https://www.cs.rice.edu/~keith/EMBED/dom.pdf
	 */
	private _intersectDoms ( node1: CfgNode, node2: CfgNode ): CfgNode
	{
		let finger1 = node1;
		let finger2 = node2;

		while ( finger1 !== finger2 )
		{
			while ( finger1.order < finger2.order )
			{
				finger1 = this._domTree.getDominator (finger1);
			}

			while ( finger2.order < finger1.order )
			{
				finger2 = this._domTree.getDominator (finger2);
			}
		}

		return finger1;
	}
};
