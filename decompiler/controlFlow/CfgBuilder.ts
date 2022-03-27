import { Disassembly } from "../disassembler/Disassembly";
import { Instruction } from "../disassembler/Instruction";
import { Queue } from "../../common/util/Queue";

import { ControlFlowGraph, CfgNode } from "./ControlFlowGraph";


/**
 * Creates a control flow graph (CFG) from DSO disassembly.
 */
export class CfgBuilder
{
	private _disassembly: Disassembly;
	private _nodes: Map<number, CfgNode>;
	private _visited: Set<Instruction>;
	private _connections: Map<number, Set<number>>;
	private _order: number;

	build ( disassembly: Disassembly ): ControlFlowGraph
	{
		this._init (disassembly);

		const entryPoint = disassembly.entryPoint ();

		this._buildNode (entryPoint);
		this._connectNodes ();

		const graph = new ControlFlowGraph (this._getNode (entryPoint.addr), this._nodes);

		this._calcNodeOrder (graph.root, new Set ());

		return graph;
	}

	/**
	 * Private methods
	 */

	private _init ( disassembly: Disassembly )
	{
		this._disassembly = disassembly;
		this._nodes = new Map ();
		this._visited = new Set ();
		this._connections = new Map ();
		this._order = 0;
	}

	private _createNode ( addr: number, ...instructions: Instruction[] ): CfgNode
	{
		const node = new CfgNode (addr, ...instructions);

		this._nodes.set (addr, node);

		return node;
	}

	private _getNode ( addr: number ): CfgNode
	{
		return this._nodes.has (addr) ? this._nodes.get (addr) : null;
	}

	private _addConnection ( fromAddr: number, toAddr: number )
	{
		if ( !this._connections.has (fromAddr) )
		{
			this._connections.set (fromAddr, new Set ());
		}

		this._connections.get (fromAddr).add (toAddr);
	}

	private _visitInstruction ( instruction: Instruction, queue: Queue<Instruction>, node: CfgNode )
	{
		if ( this._disassembly.hasCfgNodeAddr (instruction.addr) )
		{
			this._addConnection (node.addr, instruction.addr);
			this._buildNode (instruction);
		}
		else
		{
			node.addInstruction (instruction);
			this._visitChildren (instruction, queue, node);
		}
	}

	private _visitChildren ( instruction: Instruction, queue: Queue<Instruction>, node: CfgNode )
	{
		if ( instruction.numChildren > 1 && !this._disassembly.hasJump (instruction.addr) )
		{
			throw new Error (`Non-jump instruction at ${instruction.addr} with multiple children`);
		}

		const visited = this._visited;
		const { cfgNodeAddrs } = this._disassembly;

		instruction.children.forEach (child =>
		{
			if ( !visited.has (child) )
			{
				visited.add (child);
				queue.enqueue (child);
			}
			else if ( cfgNodeAddrs.has (child.addr) )
			{
				this._addConnection (node.addr, child.addr);
			}
		});
	}

	private _buildNode ( instruction: Instruction ): CfgNode
	{
		if ( this._nodes.has (instruction.addr) )
		{
			return this._nodes.get (instruction.addr);
		}

		const node = this._createNode (instruction.addr, instruction);
		const queue = new Queue<Instruction> ();

		this._visitChildren (instruction, queue, node);

		while ( !queue.isEmpty () )
		{
			this._visitInstruction (queue.dequeue (), queue, node);
		}

		return node;
	}

	private _connectNodes ()
	{
		const connections = this._connections;

		for ( const [fromAddr, toAddrs] of connections )
		{
			for ( const toAddr of toAddrs )
			{
				this._connect (fromAddr, toAddr);
			}
		}
	}

	private _connect ( fromAddr: number, toAddr: number )
	{
		this._getNode (fromAddr).addChild (this._getNode (toAddr));
	}

	/**
	 * Traverse graph in postorder and set each node's `.order` field.
	 *
	 * TODO: It would be good to figure out how to do this iteratively to prevent call stack related
	 *       crashes on larger files. It works fine on Blockland's largest script files, but there
	 *       might be larger ones out there that will crash.
	 */
	private _calcNodeOrder ( node: CfgNode, visited: Set<CfgNode> )
	{
		visited.add (node);

		const { children } = node;
		const { length } = children;

		for ( let i = 0; i < length; i++ )
		{
			const child = children[i];

			if ( !visited.has (child) )
			{
				this._calcNodeOrder (child, visited);
			}
		}

		node.order = this._order++;
	}
};
