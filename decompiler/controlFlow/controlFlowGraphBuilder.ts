import { Disassembly } from "../disassembler/disassembly";
import { BranchInstruction, FunctionInstruction, Instruction } from "../disassembler/instructions/instruction";
import { ControlFlowGraph } from "./controlFlowGraph";
import { ControlFlowNode } from "./controlFlowNode";

export class ControlFlowGraphBuilder
{
	#graphs: ControlFlowGraph[] = [];

	public build(disassembly: Disassembly): ControlFlowGraph[]
	{
		this.#graphs = [];

		for (const block of disassembly.getSplitInstructions())
		{
			this.#buildInitialGraph(disassembly, block);
		}

		this.#connectBranches();

		return this.#graphs.sort((graph1, graph2) => graph1.entryAddress - graph2.entryAddress);
	}

	#buildInitialGraph(disassembly: Disassembly, block: Instruction[]): void
	{
		const graph = this.#createGraph();
		let currNode: ControlFlowNode = null;

		for (const instruction of block)
		{
			if (currNode === null)
			{
				/* Start of the code block. */

				currNode = graph.addNode(instruction.address);
				graph.entryAddress = currNode.address;
			}
			else if (disassembly.hasBranchTarget(instruction.address))
			{
				/* Branch targets start CFG nodes. */

				const newNode = graph.addNode(instruction.address);

				currNode.addEdgeTo(newNode);

				currNode = newNode;
			}
			else if (currNode.lastInstruction instanceof BranchInstruction)
			{
				/* Branch instructions end CFG nodes. */

				const newNode = graph.addNode(instruction.address);

				currNode.addEdgeTo(newNode);

				currNode = newNode;
			}

			if (instruction instanceof FunctionInstruction)
			{
				if (graph.functionInstruction !== null)
				{
					// TODO: Maybe support nested functions someday??
					throw new Error(`Nested function detected at ${instruction.address}`);
				}
			}

			currNode.addInstruction(instruction);
		}
	}

	#createGraph(): ControlFlowGraph
	{
		const graph = new ControlFlowGraph();

		this.#graphs.push(graph);

		return graph;
	}

	// Connect branch nodes to their targets. It's much easier to do this in a second pass.
	#connectBranches(): void
	{
		for (const graph of this.#graphs)
		{
			for (const node of graph.getNodes())
			{
				if (node.lastInstruction instanceof BranchInstruction)
				{
					const branch = node.lastInstruction;

					// Gross hack
					if (!graph.hasNode(branch.targetAddress))
					{
						this.#createDummyNode(graph, branch.targetAddress);
					}

					graph.addEdge(node.address, branch.targetAddress);
				}
			}
		}
	}

	// A hack for an edge case where a function declaration follows a conditional. We insert a
	// dummy node for the next address so they connect properly.
	#createDummyNode(graph: ControlFlowGraph, address: number)
	{
		graph.addNode(address).isDummyNode = true;
	}
};
