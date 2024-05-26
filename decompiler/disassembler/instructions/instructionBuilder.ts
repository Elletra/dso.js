import { Opcode, ReturnValue } from "../../opcodes/opcode";
import { BytecodeReader } from "../bytecodeReader";
import { Instruction, InstructionProperties } from "./instruction";

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

	public buildInstruction(opcode: Opcode, address: number, properties: InstructionProperties = {}): Instruction | null
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

	#buildInstruction(instruction: any, properties: InstructionProperties): void
	{
		switch (instruction.type)
		{
			case "FunctionDeclaration":
				instruction.name = this.#reader.readIdentifier();
				instruction.namespace = this.#reader.readIdentifier();
				instruction.package = this.#reader.readIdentifier();
				instruction.hasBody = this.#reader.readBool();
				instruction.endAddress = this.#reader.read();
				instruction.arguments = [];

				const args = this.#reader.read();

				for (let i = 0; i < args; i++)
				{
					instruction.arguments.push(this.#reader.readIdentifier());
				}

				break;

			case "CreateObject":
				instruction.parent = this.#reader.readIdentifier();
				instruction.isDataBlock = this.#reader.readBool();
				instruction.failJumpAddress = this.#reader.read();

				break;

			case "AddObject":
				instruction.placeAtRoot = this.#reader.readBool();
				break;

			case "EndObject":
				instruction.value = this.#reader.readBool();
				break;

			case "UnconditionalBranch":
			case "ConditionalBranch":
			case "ConditionalNotBranch":
			case "ConditionalLogicalBranch":
				instruction.targetAddress = this.#reader.read();
				break;

			case "Return":
				instruction.returnsValue = this.#returnableValue;
				break;

			case "Variable":
			case "Field":
				instruction.name = this.#reader.readIdentifier();
				break;

			case "UIntImmediate":
				instruction.value = this.#reader.read();
				break;
				
			case "FloatImmediate":
				instruction.value = this.#reader.readFloat();
				break;
				
			case "IdentifierImmediate":
				instruction.value = this.#reader.readIdentifier();
				break;

			case "StringImmediate":
			case "TaggedStringImmediate":
				instruction.value = this.#reader.readString();
				break;

			case "FunctionCall":
				instruction.name = this.#reader.readIdentifier();
				instruction.namespace = this.#reader.readIdentifier();
				instruction.callType = this.#reader.read();

				break;

			case "AdvanceAppendChar":
				instruction.char = this.#reader.readChar();
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
