import { ControlFlowGraph } from "./controlFlowGraph";
import { ControlFlowNode } from "./controlFlowNode";

/**
 * Calculates the immediate dominators of nodes in a control flow graph.
 *
 * A node D is said to dominate a node N if all paths from the entry point must go through D
 * to get to N.
 *
 * Nodes can have multiple dominators, but we only care about the immediate dominator, which
 * is the very last dominator before the node itself.
 *
 * Source: "A Simple, Fast Dominance Algorithm"
 *         by Keith Cooper, Timothy Harvey, and Ken Kennedy.
 *         https://web.archive.org/web/https://www.cs.tufts.edu/comp/150FP/archive/keith-cooper/dom14.pdf
 */
export class DominanceCalculator
{
	#reversePostorder: ControlFlowNode[] = [];
	#graph: ControlFlowGraph = new ControlFlowGraph();

	public calculate(cfg: ControlFlowGraph): void
	{
		this.#graph = cfg;

		this.#calculateReversePostorder();
		this.#calculateDominance();
	}

	#calculateReversePostorder(): void
	{
		this.#reversePostorder = [];

		for (const node of this.#graph.postorderDFS())
		{
			this.#reversePostorder.push(node);
		}

		let index = 0;

		this.#reversePostorder.reverse();
		this.#reversePostorder.forEach(node => node.reversePostorder = index++);
	}

	#calculateDominance(): void
	{
		const { entryPoint } = this.#graph;
		let changed = true;

		entryPoint.immediateDom = entryPoint;

		while (changed)
		{
			changed = false;

			for (const node of this.#reversePostorder)
			{
				if (node === entryPoint)
				{
					continue;
				}

				let newImmediateDom: ControlFlowNode = null;

				for (const predecessor of node.predecessors)
				{
					// Ignore predecessors that haven't been processed yet. Since we set the entry
					// point's immediate dominator to itself, we will always have an available predecessor.
					if (predecessor.immediateDom !== null)
					{
						if (newImmediateDom === null)
						{
							newImmediateDom = predecessor;
						}
						else
						{
							newImmediateDom = this.#findCommonDominator(predecessor, newImmediateDom);
						}
					}
				}

				if (node.immediateDom !== newImmediateDom)
				{
					node.immediateDom = newImmediateDom;
					changed = true;
				}
			}
		}
	}

	#findCommonDominator(node1: ControlFlowNode, node2: ControlFlowNode): ControlFlowNode
	{
		let finger1 = node1;
		let finger2 = node2;

		while (finger1 !== finger2)
		{
			/* Comparison operators are flipped since we're using reverse postorder values. */

			while (finger1.reversePostorder > finger2.reversePostorder)
			{
				finger1 = finger1.immediateDom;
			}

			while (finger2.reversePostorder > finger1.reversePostorder)
			{
				finger2 = finger2.immediateDom;
			}
		}

		return finger1;
	}
};
