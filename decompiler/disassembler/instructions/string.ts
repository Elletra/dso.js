import { Instruction, Opcode, ReturnValueChange } from "./instruction";
import { BytecodeReader } from "../bytecodeReader";

/* OP_ADVANCE_STR */
export class AdvanceStringInstruction extends Instruction {};

/* Advance-string instruction with appended character (used for SPC, TAB, and NL keywords). */
export class AdvanceAppendInstruction extends Instruction
{
	#char: string;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#char = reader.readChar();
	}

	public get char(): string { return this.#char; }
};

/* OP_ADVANCE_STR_COMMA */
export class AdvanceCommaInstruction extends Instruction {};

/* OP_ADVANCE_STR_NUL */
export class AdvanceNullInstruction extends Instruction {};

/* OP_REWIND_STR */
export class RewindStringInstruction extends Instruction
{
	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToTrue; }
};

/* OP_TERMINATE_REWIND_STR */
export class TerminateRewindInstruction extends Instruction {};
