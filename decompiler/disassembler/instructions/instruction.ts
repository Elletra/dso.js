import { CallType, Opcode, ReturnValueChange, TypeReq } from "../../opcodes/opcode";
import { BytecodeReader } from "../bytecodeReader";

/**
 * There's a bunch of empty subclasses of `Instruction` in order to let `ASTBuilder` use classes
 * instead of checking opcodes, which is much better.
 *
 * I know it's not the most elegant solution, and I feel kind of gross about it, but I think
 * it's okay...
 */

/* Base instruction class. */
export class Instruction
{
    #opcode: Opcode;
    #address: number;

    constructor(opcode: Opcode, address: number, _reader: BytecodeReader)
    {
        this.#opcode = opcode;
        this.#address = address;
    }

    public get opcode(): Opcode { return this.#opcode; }
	public get address(): number { return this.#address; }

	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.NoChange; }
};

/* Function declaration instruction. */
export class FunctionInstruction extends Instruction
{
	#name: string;
	#namespace: string | null;
	#package: string | null;
	#hasBody: boolean;
	#endAddress: number;
	#arguments: string[];

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#name = reader.readIdentifier();
		this.#namespace = reader.readIdentifier();
		this.#package = reader.readIdentifier();
		this.#hasBody = reader.readBool();
		this.#endAddress = reader.read();
		this.#arguments = [];

		const args = reader.read();

		for (let i = 0; i < args; i++)
		{
			this.#arguments.push(reader.readIdentifier());
		}
	}

	public get name(): string { return this.#name; };
	public get namespace(): string { return this.#namespace; };
	public get package(): string { return this.#package; };
	public get hasBody(): boolean { return this.#hasBody; };
	public get endAddress(): number { return this.#endAddress; };
	public get arguments(): string[] { return this.#arguments.slice(); };
};

/* Instruction for the first part of object creation. */
export class CreateObjectInstruction extends Instruction
{
	#parent: string;
	#isDataBlock: boolean;
	#failJumpAddress: number;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#parent = reader.readIdentifier();
		this.#isDataBlock = reader.readBool();
		this.#failJumpAddress = reader.read();
	}

	public get parent(): string { return this.#parent; };
	public get isDataBlock(): boolean { return this.#isDataBlock; };
	public get failJumpAddress(): number { return this.#failJumpAddress; };
};

/* Instruction for the second part of object creation. */
export class AddObjectInstruction extends Instruction
{
	#placeAtRoot: boolean;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#placeAtRoot = reader.readBool();
	}

	public get placeAtRoot(): boolean { return this.#placeAtRoot; }
};

/* Instruction for the third and final part of object creation. */
export class EndObjectInstruction extends Instruction
{
	/* Can either be for `isDataBlock` or `placeAtRoot`. */
	#value: boolean;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#value = reader.readBool();
	}

	public get value(): boolean { return this.#value; }
};

/* Base class for branch instructions. */
export abstract class BranchInstruction extends Instruction
{
	#targetAddress: number;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#targetAddress = reader.read();
	}

	public get targetAddress(): number { return this.#targetAddress; }

	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToFalse; }
};

export class UnconditionalBranchInstruction extends BranchInstruction {};

export class ConditionalBranchInstruction extends BranchInstruction
{
	public get isInverse(): boolean
	{
		return this.opcode.stringValue === "OP_JMPIFNOT" || this.opcode.stringValue === "OP_JMPIFFNOT";
	}
};

export class LogicalBranchInstruction extends BranchInstruction
{
	public get operator(): string
	{
		switch(this.opcode.stringValue)
		{
			case "OP_JMPIF_NP":
				return "OR";

			case "OP_JMPIFNOT_NP":
				return "AND";

			default:
				return "INVALID";
		}
	}

	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.NoChange; }
};

export class ReturnInstruction extends Instruction
{
	#returnsValue: boolean;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#returnsValue = reader.returnableValue;
	}

	public get returnsValue(): boolean { return this.#returnsValue; }

	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToFalse; }
};

/* Opcodes for binary instructions like OP_ADD, OP_XOR, OP_CMPEQ, etc. */
export class BinaryInstruction extends Instruction {};

/* A separate instruction for OP_COMPARE_STR because the operands are inverse of the other binary operations.*/
export class BinaryStringInstruction extends Instruction {};

/* Opcodes for unary instructions like OP_NOT, OP_ONESCOMPLEMENT, etc. */
export class UnaryInstruction extends Instruction {};

export class VariableInstruction extends Instruction
{
	#name: string;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#name = reader.readIdentifier();
	}

	public get(): string { return this.#name; }
};

export class VariableArrayInstruction extends Instruction {};

/* OP_LOADVAR_* */
export class LoadVariableInstruction extends Instruction
{
	public get returnValueChange(): ReturnValueChange
	{
		return this.opcode.stringValue === "OP_LOADVAR_STR"
			? ReturnValueChange.ToTrue
			: ReturnValueChange.NoChange;
	}
};

/* OP_SAVEVAR_* */
export class SaveVariableInstruction extends Instruction
{
	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToTrue; }
};

export class ObjectInstruction extends Instruction {};
export class ObjectNewInstruction extends Instruction {};

export class FieldInstruction extends Instruction
{
	#name: string;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#name = reader.readIdentifier();
	}

	public get name(): string { return this.#name; }
};

export class FieldArrayInstruction extends Instruction {};

/* OP_LOADFIELD_* */
export class LoadFieldInstruction extends Instruction
{
	public get returnValueChange(): ReturnValueChange
	{
		return this.opcode.stringValue === "OP_LOADFIELD_STR"
			? ReturnValueChange.ToTrue
			: ReturnValueChange.NoChange;
	}
};

/* OP_SAVEFIELD_* */
export class SaveFieldInstruction extends Instruction
{
	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToTrue; }
};

export class ConvertToTypeInstruction extends Instruction
{
	public get convertType(): TypeReq
	{
		switch(this.opcode.stringValue)
		{
			case "OP_FLT_TO_UINT":
			case "OP_STR_TO_UINT":
				return TypeReq.UInt;
				
			case "OP_UINT_TO_FLT":
			case "OP_STR_TO_FLT":
				return TypeReq.Float;

			case "OP_UINT_TO_STR":
			case "OP_FLT_TO_STR":
				return TypeReq.String;

			case "OP_FLT_TO_NONE":
			case "OP_UINT_TO_NONE":
			case "OP_STR_TO_NONE":
				return TypeReq.None;
			
			default:
				return TypeReq.Invalid;
		}
	}

	public get returnValueChange(): ReturnValueChange
	{
		switch(this.convertType)
		{
			case TypeReq.None:
				return ReturnValueChange.ToFalse;

			case TypeReq.String:
				return ReturnValueChange.ToTrue;

			default:
				return ReturnValueChange.NoChange;
		}
	}
};

/* Base class for immediate instructions. */
export abstract class ImmediateInstruction<T> extends Instruction
{
	#value: T;

	public get value(): T { return this.#value; }
	protected set _value(value: T) { this.#value = value; }

	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToTrue; }
};

export class UIntInstruction extends ImmediateInstruction<number>
{
	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this._value = reader.read();
	}
};

export class FloatInstruction extends ImmediateInstruction<number>
{
	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this._value = reader.readFloat();
	}
};

export class IdentifierInstruction extends ImmediateInstruction<string>
{
	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this._value = reader.readIdentifier();
	}
};

export class StringInstruction extends ImmediateInstruction<string>
{
	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this._value = reader.readString();
	}
};

export class TaggedStringInstruction extends ImmediateInstruction<string>
{
	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this._value = reader.readString();
	}
};

export class FunctionCallInstruction extends Instruction
{
	#name: string;
	#namespace: string | null;
	#callType: CallType;

	constructor(opcode: Opcode, address: number, reader: BytecodeReader)
	{
		super(opcode, address, reader);

		this.#name = reader.readIdentifier();
		this.#namespace = reader.readIdentifier();

		const callType = reader.read();

		this.#callType = Object.hasOwn(CallType, callType) ? callType : CallType.Invalid;
	}

	public get name(): string { return this.#name; }
	public get namespace(): string { return this.#namespace; }
	public get callType(): CallType { return this.#callType; }
	
	public get returnValueChange(): ReturnValueChange { return ReturnValueChange.ToTrue; }
};

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

/* OP_PUSH */
export class PushInstruction extends Instruction {};

/* OP_PUSH_FRAME */
export class PushFrameInstruction extends Instruction {};

/* OP_BREAK */
export class DebugBreakInstruction extends Instruction {};

/* OP_UNUSED# */
export class UnusedInstruction extends Instruction {};
