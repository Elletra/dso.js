import { Instruction } from "./instruction";

/* Opcodes for binary instructions like OP_ADD, OP_XOR, OP_CMPEQ, etc. */
export class BinaryInstruction extends Instruction {};

/* A separate instruction for OP_COMPARE_STR because the operands are inverse of the other binary operations.*/
export class BinaryStringInstruction extends Instruction {};

/* Opcodes for unary instructions like OP_NOT, OP_ONESCOMPLEMENT, etc. */
export class UnaryInstruction extends Instruction {};
