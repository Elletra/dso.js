import { FileData } from "../loader/fileData";
import { FunctionInstruction } from "./instructions/instruction";

export class BytecodeReader
{
	#fileData: FileData = null;
	#index: number = 0;

	public function: FunctionInstruction = null;

	constructor(fileData: FileData)
	{
		this.#fileData = fileData;
	}

	public get index(): number { return this.#index; }
	public get inFunction(): boolean { return this.function !== null; }
	public get size(): number { return this.#fileData.codeSize; }
	public get isAtEnd(): boolean { return this.#index >= this.#fileData.codeSize; }

	public read(): number { return this.#fileData.getOp(this.#index++); }
	public readBool(): boolean { return this.read() !== 0; }
	public readChar(): string { return String.fromCharCode(this.read()); }
	public readIdentifier(): string | null { return this.#fileData.getIdentifier(this.#index, this.read()); }
	public readString(): string | null { return this.#fileData.getString(this.read(), !this.inFunction); }
	public readFloat(): number | null { return this.#fileData.getFloat(this.read(), !this.inFunction); }
};
