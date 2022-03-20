import { Instruction } from "./Instruction";


/**
 * Stores instructions, jump data, and control flow graph (CFG) data.
 */
export class Disassembly
{
	public instructions: Map<number, Instruction>;
	public jumps: Map<number, number>;
	public cfgNodeAddrs: Set<number>;

	constructor ()
	{
		this.instructions = new Map ();
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
		this.instructions.set (addr, instruction);
	}

	instructionAt ( addr: number ): Instruction
	{
		return this.hasInstruction (addr) ? this.instructions.get (addr) : null;
	}

	hasInstruction ( addr: number ): boolean
	{
		return this.instructions.has (addr);
	}

	// Return the first instruction in the code.
	entryPoint (): Instruction
	{
		return this.instructionAt (0);
	}
};
