import { ControlFlowNode } from "./controlFlowNode";
import { FunctionDeclarationInstruction } from "../disassembler/instructions/functionDeclaration";

export class ControlFlowGraph
{
	// There must be a better way than to make this a public, settable value...
	// TODO: Maybe fix someday?
	public entryAddress: number = 0;

	#nodes: Map<number, ControlFlowNode> = new Map();

	public get entryPoint(): ControlFlowNode | null { return this.getNode(this.entryAddress); }

	public get functionInstruction(): FunctionDeclarationInstruction | null
	{
		return this.getNode(this.entryAddress)?.functionInstruction ?? null;
	}

	public get isFunction(): boolean
	{
		return this.getNode(this.entryAddress)?.isFunction ?? false;
	}

	public addNode(nodeOrAddr: ControlFlowNode | number): ControlFlowNode
	{
		const node = nodeOrAddr instanceof ControlFlowNode ? nodeOrAddr : new ControlFlowNode(nodeOrAddr);

		this.#nodes.set(node.address, node);

		return node;
	}

	public removeNode(node: ControlFlowNode): void
	{
		for (const successor of node.successors.slice())
		{
			this.removeEdge(node, successor);
		}

		for (const predecessor of node.predecessors.slice())
		{
			this.removeEdge(predecessor, node);
		}

		this.#nodes.delete(node.address);
	}

	public hasNode(nodeOrAddr: ControlFlowNode | number): boolean
	{
		return nodeOrAddr instanceof ControlFlowNode
			? this.#nodes.has(nodeOrAddr.address)
			: this.#nodes.has(nodeOrAddr);
	}

	public getNode(address: number): ControlFlowNode | null
	{
		return this.hasNode(address) ? this.#nodes.get(address) : null;
	}

	public getNodes(): ControlFlowNode[]
	{
		const nodes = [...this.#nodes.values()];

		// TODO: Again, if recursive descent disassembly is ever implemented, this will not work.
		return nodes.sort((node1, node2) => node1.address - node2.address);
	}

	public addEdge(from: ControlFlowNode | number, to: ControlFlowNode | number): boolean
	{
		const fromNode = from instanceof ControlFlowNode ? from : this.getNode(from);
		const toNode = to instanceof ControlFlowNode ? to : this.getNode(to);

		if (!this.hasNode(fromNode) || !this.hasNode(toNode))
		{
			return false;
		}

		fromNode.addEdgeTo(toNode);

		return true;
	}

	public removeEdge(from: ControlFlowNode | number, to: ControlFlowNode | number): boolean
	{
		const fromNode = from instanceof ControlFlowNode ? from : this.getNode(from);
		const toNode = to instanceof ControlFlowNode ? to : this.getNode(to);

		if (!this.hasNode(fromNode) || !this.hasNode(toNode))
		{
			return false;
		}

		fromNode.removeEdgeTo(toNode);

		return true;
	}

	/**
	 * Iterative postorder traversal on a cyclic graph... Good lord.
	 *
	 * I did not come up with this algorithm, though I certainly tried.
	 *
	 * Full credit goes to Hans Olsson on Stack Overflow (https://stackoverflow.com/a/50646181).
	 */
	public postorderDFS(entryPoint: ControlFlowNode | number = this.entryAddress): ControlFlowNode[]
	{
		const entry = entryPoint instanceof ControlFlowNode ? entryPoint : this.getNode(entryPoint);

		if (!(entry instanceof ControlFlowNode))
		{
			return [];
		}

		const nodes: ControlFlowNode[] = [];
		const visited: Set<ControlFlowNode> = new Set();
		const stack: [ControlFlowNode, boolean][] = [];

		stack.push([entry, false]);

		while (stack.length > 0)
		{
			const [node, visitNode] = stack.pop();

			if (visitNode)
			{
				nodes.push(node);
			}
			else if (!visited.has(node))
			{
				visited.add(node);
				stack.push([node, true]);

				const { length } = node.successors;

				for (let i = length - 1; i >= 0; i--)
				{
					stack.push([node.successors[i], false]);
				}
			}
		}

		return nodes;
	}
};
