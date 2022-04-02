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
	private _graph: ControlFlowGraph;

	build ( disassembly: Disassembly ): ControlFlowGraph
	{
		this._init (disassembly);
		this._buildGraph ();
		this._connectJumps ();
		this._calcPostorder ();

		return this._graph;
	}

	/**
	 * Private methods
	 */

	private _init ( disassembly: Disassembly )
	{
		this._disassembly = disassembly;
		this._graph = new ControlFlowGraph (disassembly.entryPoint ().addr);
	}

	private _buildGraph ()
	{
		let node = this._buildNode (this._disassembly.entryPoint ());

		for ( const instruction of this._disassembly.dfs () )
		{
			node = this._handleInstruction (instruction, node);
		}
	}

	private _buildNode ( instruction: Instruction ): CfgNode
	{
		let node;

		if ( this._graph.hasKey (instruction.addr) )
		{
			node = this._graph.node (instruction.addr);
		}
		else
		{
			node = new CfgNode (instruction.addr, instruction);
			this._graph.addVertex (node.addr, node);
		}

		return node;
	}

	private _handleInstruction ( instruction: Instruction, node: CfgNode ): CfgNode
	{
		let newNode = node;

		if ( this._disassembly.hasCfgNodeAddr (instruction.addr) )
		{
			newNode = this._buildNode (instruction);
			this._graph.addEdge (node.addr, newNode.addr);
		}
		else
		{
			node.addInstruction (instruction);
		}

		return newNode;
	}

	private _connectJumps ()
	{
		for ( const node of this._graph )
		{
			this._connectJump (node);
		}
	}

	private _connectJump ( node: CfgNode )
	{
		const last = node.lastInstruction ();

		if ( this._disassembly.hasJump (last.addr) )
		{
			this._graph.addEdge (node.addr, last.operands[0]);
		}
	}

	/**
	 * Calculates the postorder of the graph, which we need to make the dominator tree.
	 */
	private _calcPostorder ()
	{
		let postorder = this._graph.size - 1;

		for ( const [, node] of this._graph.dfs (this._graph.root) )
		{
			node.postorder = postorder--;
		}
	}
};
