import { Opcode, CallType } from "../../opcodes/opcode";

export interface Instruction
{
	type: string;
	address: number;
	opcode: Opcode;
};

export interface FunctionInstruction extends Instruction
{
	name: string;
	namespace: string | null;
	package: string | null;
	hasBody: boolean;
	endAddress: number;
	arguments: string[];
};

export interface CreateObjectInstruction extends Instruction
{
	parent: string;
	isDataBlock: boolean;
	failJumpAddress: number;
};

export interface AddObjectInstruction extends Instruction
{
	placeAtRoot: boolean;
};

export interface EndObjectInstruction extends Instruction
{
	value: boolean;
};

export interface BranchInstruction extends Instruction
{
	targetAddress: number;
	isConditional: boolean;
	isLogicalOperator: boolean;
};

export interface ReturnInstruction extends Instruction
{
	returnsValue: boolean;
};

export interface VariableInstruction extends Instruction
{
	name: string;
};

export interface FieldInstruction extends Instruction
{
	name: string;
};

export interface ImmediateInstruction extends Instruction
{
	value: number | string;
	isTaggedString: boolean;
};

export interface FunctionCallInstruction extends Instruction
{
	name: string;
	namespace: string;
	callType: CallType;
};

export interface AdvanceAppendInstruction extends Instruction
{
	char: string;
};
