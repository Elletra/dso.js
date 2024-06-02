import { Instruction, Opcode } from "./instruction";
import { BytecodeReader } from "../bytecodeReader";

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
