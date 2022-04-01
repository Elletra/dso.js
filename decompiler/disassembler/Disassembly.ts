import { Instruction } from "./Instruction";
import { Digraph } from "../../common/util/Digraph";


/**
 * Stores instructions, jump data, and control flow graph (CFG) data.
 */
export class Disassembly
{
	public instructions: Digraph<number, Instruction>;
	public jumps: Map<number, number>;
	public cfgNodeAddrs: Set<number>;

	constructor ()
	{
		this.instructions = new Digraph ();
		this.jumps = new Map ();
		this.cfgNodeAddrs = new Set ();
	}

	/**
	 * Jump methods
	 */

	addJump ( jumpAddr: number, targetAddr: number )
	{
		this.jumps.set (jumpAddr, targetAddr);
	}

	hasJump ( addr: number ): boolean
	{
		return this.jumps.has (addr);
	}

	/**
	 * CFG node methods
	 */

	addCfgNodeAddrs ( ...addrs: number[] )
	{
		addrs.forEach (addr => this.cfgNodeAddrs.add (addr));
	}

	hasCfgNodeAddr ( addr: number ): boolean
	{
		return this.cfgNodeAddrs.has (addr);
	}

	/**
	 * Instruction methods
	 */

	addInstruction ( addr: number, instruction: Instruction )
	{
		this.instructions.addVertex (addr, instruction);
	}

	addEdge ( fromAddr: number, toAddr: number )
	{
		this.instructions.addEdge (fromAddr, toAddr);
	}

	instructionAt ( addr: number ): Instruction
	{
		return this.instructions.hasKey (addr) ? this.instructions.node (addr) : null;
	}

	hasInstruction ( addr: number ): boolean
	{
		return this.instructions.hasKey (addr);
	}

	// Return the first instruction in the code.
	entryPoint (): Instruction
	{
		return this.instructionAt (0);
	}

	*dfs ()
	{
		for ( const [, instruction] of this.instructions.dfs (0) )
		{
			yield instruction as Instruction;
		}
	}
};
