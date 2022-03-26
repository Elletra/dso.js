import { Disassembly } from "../disassembler/Disassembly";
import { Instruction } from "../disassembler/Instruction";
import { Queue } from "../../common/util/Queue";

import { ControlFlowGraph, Node } from "./ControlFlowGraph";


/**
 * Creates a control flow graph (CFG) from DSO disassembly.
 */
export class Builder
{
	private _nodes: Map<number, Node>;
	private _visited: Set<Instruction>;
	private _connections: Map<number, Set<number>>;
	private _disassembly: Disassembly;

	constructor ()
	{
		this._nodes = new Map ();
		this._visited = new Set ();
		this._connections = new Map ();
		this._disassembly = null;
	}

	build ( disassembly: Disassembly ): ControlFlowGraph
	{
		this._nodes = new Map ();
		this._visited = new Set ();
		this._connections = new Map ();
		this._disassembly = disassembly;

		const entryPoint = disassembly.entryPoint ();

		this._buildNode (entryPoint);
		this._connectNodes ();

		return new ControlFlowGraph (this._getNode (entryPoint.addr));
	}

	/**
	 * Private methods
	 */

	private _createNode ( addr: number, ...instructions: Instruction[] ): Node
	{
		const node = new Node (addr, ...instructions);

		this._nodes.set (addr, node);

		return node;
	}

	private _getNode ( addr: number ): Node
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

	private _visitInstruction ( instruction: Instruction, queue: Queue<Instruction>, node: Node )
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

	private _visitChildren ( instruction: Instruction, queue: Queue<Instruction>, node: Node )
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

	private _buildNode ( instruction: Instruction ): Node
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
};
