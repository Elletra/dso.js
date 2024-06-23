import { Instruction, Opcode } from "./instruction";
import { BytecodeReader } from "../bytecodeReader";

/* Function declaration instruction. */
export class FunctionDeclarationInstruction extends Instruction
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

	protected _getToStringValues(): any[]
	{
		const values = super._getToStringValues();

		if (this.#package !== null)
		{
			values.push(this.#package);
		}

		if (this.#namespace !== null)
		{
			values.push(this.#namespace);
		}

		values.push(this.#name, this.#hasBody, this.#endAddress, ...this.#arguments);

		return values;
	}
};
