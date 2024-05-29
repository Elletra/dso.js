import { AnyObject } from "../../../common/types";
import { Opcode, ReturnValue } from "../../opcodes/opcode";
import { BytecodeReader } from "../bytecodeReader";

import
{
	Instruction,
	FunctionInstruction,
	CreateObjectInstruction,
	AddObjectInstruction,
	EndObjectInstruction,
	BranchInstruction,
	ReturnInstruction,
	VariableInstruction,
	FieldInstruction,
	ImmediateInstruction,
	FunctionCallInstruction,
	AdvanceAppendInstruction,
}
from "./instruction";

export class InstructionBuilder
{
	#reader: BytecodeReader = null;
	#opcodeTypes: Record<string, string> = null;
	#returnableValue: boolean = false;

	constructor(reader: BytecodeReader, opcodeTypes: Record<string, string>)
	{
		this.#reader = reader;
		this.#opcodeTypes = opcodeTypes;
	}

	public buildInstruction(opcode: Opcode, address: number, properties: AnyObject = {}): Instruction | null
	{
		const instruction = { type: this.#getType(opcode), opcode, address };

		if (instruction.type === "")
		{
			return null;
		}
		
		this.#buildInstruction(instruction, properties);

		return Object.freeze(instruction);
	}

	public setReturnableValue(instruction: Instruction): void
	{
		switch (instruction.opcode.returnValue)
		{
			case ReturnValue.ToFalse:
				this.#returnableValue = false;
				break;
			
			case ReturnValue.ToTrue:
				this.#returnableValue = true;
				break;
			
			case ReturnValue.NoChange:
			default:
				break;
		}
	}

	#buildInstruction(instruction: Instruction, properties: AnyObject): void
	{
		switch (instruction.type)
		{
			case "FunctionDeclaration":
			{
				const insn = instruction as FunctionInstruction;

				insn.name = this.#reader.readIdentifier();
				insn.namespace = this.#reader.readIdentifier();
				insn.package = this.#reader.readIdentifier();
				insn.hasBody = this.#reader.readBool();
				insn.endAddress = this.#reader.read();
				insn.arguments = [];

				const args = this.#reader.read();

				for (let i = 0; i < args; i++)
				{
					insn.arguments.push(this.#reader.readIdentifier());
				}

				break;
			}

			case "CreateObject":
			{
				const insn = instruction as CreateObjectInstruction;

				insn.parent = this.#reader.readIdentifier();
				insn.isDataBlock = this.#reader.readBool();
				insn.failJumpAddress = this.#reader.read();

				break;
			}

			case "AddObject":
				(instruction as AddObjectInstruction).placeAtRoot = this.#reader.readBool();
				break;

			case "EndObject":
				(instruction as EndObjectInstruction).value = this.#reader.readBool();
				break;

			case "Branch":
			{
				const insn = instruction as BranchInstruction;
				const { stringValue } = instruction.opcode;

				insn.targetAddress = this.#reader.read();
				insn.isConditional = stringValue !== "OP_JMP";
				insn.isLogicalOperator = stringValue === "OP_JMPIF_NP" || stringValue === "OP_JMPIFNOT_NP";

				break;
			}

			case "Return":
				(instruction as ReturnInstruction).returnsValue = this.#returnableValue;
				break;

			case "Variable":
				(instruction as VariableInstruction).name = this.#reader.readIdentifier();
				break;

			case "Field":
				(instruction as FieldInstruction).name = this.#reader.readIdentifier();
				break;

			case "UIntImmediate":
			{
				const insn = instruction as ImmediateInstruction;

				insn.value = this.#reader.read();
				insn.isTaggedString = false;

				break;
			}

			case "FloatImmediate":
			{
				const insn = instruction as ImmediateInstruction;

				insn.value = this.#reader.readFloat();
				insn.isTaggedString = false;

				break;
			}
				
			case "IdentifierImmediate":
			{
				const insn = instruction as ImmediateInstruction;

				insn.value = this.#reader.readIdentifier();
				insn.isTaggedString = false;

				break;
			}

			case "StringImmediate":
			case "TaggedStringImmediate":
			{
				const insn = instruction as ImmediateInstruction;

				insn.value = this.#reader.readString();
				insn.isTaggedString = insn.type === "TaggedStringImmediate";

				break;
			}

			case "FunctionCall":
			{
				const insn = instruction as FunctionCallInstruction;

				insn.name = this.#reader.readIdentifier();
				insn.namespace = this.#reader.readIdentifier();
				insn.callType = this.#reader.read();

				break;
			}

			case "AdvanceAppendChar":
				(instruction as AdvanceAppendInstruction).char = this.#reader.readChar();
				break;

			default:
				break;
		}
	}

	#getType(opcode: Opcode): string
	{
		return Object.hasOwn(this.#opcodeTypes, opcode.stringValue)
			? this.#opcodeTypes[opcode.stringValue]
			: "";
	}
};
