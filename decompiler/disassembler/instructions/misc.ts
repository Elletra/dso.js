import { Instruction } from "./instruction";

/* OP_PUSH */
export class PushInstruction extends Instruction {};

/* OP_PUSH_FRAME */
export class PushFrameInstruction extends Instruction {};

/* OP_BREAK */
export class DebugBreakInstruction extends Instruction {};

/* OP_UNUSED# */
export class UnusedInstruction extends Instruction {};
