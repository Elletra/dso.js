import { Opcode, TypeReq, CallType } from "../../opcodes/opcode";

export interface RequiredProperties
{
	type: string;
	address: number;
	opcode: Opcode;
};

export interface FunctionProperties
{
	name: string;
	namespace: string;
	package: string;
	hasBody: boolean;
	endAddress: number;
	arguments: string[];
};

export interface CreateObjectProperties
{
	parent: string;
	isDataBlock: boolean;
	failJumpAddress: number;
};

export interface AddObjectProperties
{
	placeAtRoot: boolean;
};

export interface EndObjectProperties
{
	value: boolean;
};

export interface BranchProperties
{
	targetAddress: number;
	isConditional: boolean;
	isLogicalOperator: boolean;
};

export interface ReturnProperties
{
	returnsValue: boolean;
};

export interface FieldOrVariableProperties
{
	name: string;
};

export interface ConvertToTypeProperties
{
	type: TypeReq;
};

export interface ImmediateProperties
{
	value: number | string;
	isTaggedString: boolean;
	isIdentifier: boolean;
};

export interface FunctionCallProperties
{
	name: string;
	namespace: string;
	callType: CallType;
};

export interface AdvanceAppendProperties
{
	char: string;
};

export type InstructionProperties = FunctionProperties
	| CreateObjectProperties
	| AddObjectProperties
	| EndObjectProperties
	| BranchProperties
	| ReturnProperties
	| FieldOrVariableProperties
	| ConvertToTypeProperties
	| ImmediateProperties
	| FunctionCallProperties
	| AdvanceAppendProperties
	| {};

export type BasicInstruction = RequiredProperties;
export type FunctionInstruction = RequiredProperties & FunctionProperties;
export type CreateObjectInstruction = RequiredProperties & CreateObjectProperties;
export type AddObjectInstruction = RequiredProperties & AddObjectProperties;
export type EndObjectInstruction = RequiredProperties & EndObjectProperties;
export type BranchInstruction = RequiredProperties & BranchProperties;
export type ReturnInstruction = RequiredProperties & ReturnProperties;
export type FieldOrVariableInstruction = RequiredProperties & FieldOrVariableProperties;
export type ConvertToTypeInstruction = RequiredProperties & ConvertToTypeProperties;
export type ImmediateInstruction = RequiredProperties & ImmediateProperties;
export type FunctionCallInstruction = RequiredProperties & FunctionCallProperties;
export type AdvanceAppendInstruction = RequiredProperties & AdvanceAppendProperties;

export type Instruction = BasicInstruction
	| FunctionInstruction
	| CreateObjectInstruction
	| AddObjectInstruction
	| EndObjectInstruction
	| BranchInstruction
	| ReturnInstruction
	| FieldOrVariableInstruction
	| ConvertToTypeInstruction
	| ImmediateInstruction
	| FunctionCallInstruction
	| AdvanceAppendInstruction;
