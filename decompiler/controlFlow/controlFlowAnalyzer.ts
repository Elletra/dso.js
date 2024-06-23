import { Disassembly } from "../disassembler/disassembly";
import { ConditionalBranchInstruction, UnconditionalBranchInstruction } from "../disassembler/instructions/branch";
import { ControlFlowBlock, ControlFlowBlockType, UnconditionalBranchType } from "./controlFlowBlock";

export class ControlFlowAnalyzer
{
	#disassembly: Disassembly;

	public analyze(disassembly: Disassembly): ControlFlowBlock
	{
		this.#disassembly = disassembly;

		return this.#analyzeBranches(this.#scan());
	}

	#scan(): ControlFlowBlock
	{
		// 1.) Build collection of ControlFlowBlocks:
		//         - Loops from their ends
		//         - Conditionals from their beginnings
		// 2.) Organize ControlFlowBlocks into a hierarchy
		// 3.) Add respective unconditional branches to each ControlFlowBlock

		const instructions = this.#disassembly.getInstructions();
		const blocks: ControlFlowBlock[] = [];

		for (const instruction of instructions)
		{
			if (instruction instanceof ConditionalBranchInstruction)
			{
				const start = instruction.isLoopEnd
					? this.#disassembly.getInstruction(instruction.targetAddress)
					: instruction;

				const end = instruction.isLoopEnd
					? instruction
					: this.#disassembly.getInstruction(instruction.targetAddress).prev;

				const block = new ControlFlowBlock(start, end);
				block.type = instruction.isLoopEnd ? ControlFlowBlockType.Loop : ControlFlowBlockType.Conditional;

				blocks.push(block);
			}
		}

		blocks.sort((block1, block2) =>
		{
			if (block1.start.address > block2.start.address)
			{
				return -1;
			}

			if (block1.start.address < block2.start.address)
			{
				return 1;
			}

			if (block1.end.address < block2.end.address)
			{
				return -1;
			}

			if (block1.end.address > block2.end.address)
			{
				return 1;
			}

			return 0;
		});

		const root = new ControlFlowBlock(this.#disassembly.firstInstruction, this.#disassembly.lastInstruction, null);
		const stack: ControlFlowBlock[] = [root];

		root.type = ControlFlowBlockType.Default;

		for (const instruction of instructions)
		{
			while (stack.length > 0 && stack.at(-1).end.address < instruction.address)
			{
				stack.pop();
			}

			while (blocks.length > 0 && blocks.at(-1).start.address === instruction.address)
			{
				const block = blocks.pop();

				if (stack.length > 0)
				{
					stack.at(-1).addChild(block);
				}

				stack.push(block);
			}

			if (instruction instanceof UnconditionalBranchInstruction)
			{
				if (stack.length > 0)
				{
					stack.at(-1).addBranch(instruction);
				}
			}
		}

		return root;
	}

	#analyzeBranches(block: ControlFlowBlock): ControlFlowBlock
	{
		for (const [address, branch] of block.branches)
		{
			const { targetAddress } = branch;
			const { parent } = block;

			if (block.type === ControlFlowBlockType.Loop)
			{
				if (targetAddress === block.end.next.address)
				{
					branch.type = UnconditionalBranchType.Break;
				}
				else
				{
					// If the branch is just directly in a loop and doesn't jump out of the loop,
					// it's a continue.
					branch.type = UnconditionalBranchType.Continue;
					block.continuePoint = branch.targetAddress;
				}
			}
			else
			{
				const loop = block.findParentLoop();

				if (loop !== null)
				{
					if (targetAddress === loop.end.next.address)
					{
						branch.type = UnconditionalBranchType.Break;
					}
					else if (address < block.end.address)
					{
						// If the branch is in a conditional, but it's not at the end, it's a continue.
						branch.type = UnconditionalBranchType.Continue;
					}
					else if (parent !== null && parent.type === ControlFlowBlockType.Conditional && targetAddress > parent.end.next.address)
					{
						// If the parent is a conditional, and the destination is higher than its end ip,
						// it's a continue.
						branch.type = UnconditionalBranchType.Continue;
					}
				}

				if (branch.type === UnconditionalBranchType.Continue)
				{
					loop.continuePoint = branch.targetAddress;
				}
			}
		}

		for (const [address, branch] of block.branches)
		{
			if (branch.type === UnconditionalBranchType.Unknown)
			{
				branch.type = UnconditionalBranchType.IfElse;
			}
		}

		block.children.forEach(child => this.#analyzeBranches(child));

		return block;
	}
};
