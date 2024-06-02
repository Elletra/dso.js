export class Opcode
{
	#value: number | null;
	#stringValue: string | null;

	constructor(value: number | null, stringValue: string | null)
	{
		this.#value = value;
		this.#stringValue = stringValue;
	}

	public get value(): number { return this.#value ?? 0; }
	public get stringValue(): string { return this.#stringValue; }

	public get hasValue(): boolean { return this.#value !== null; }
	public get isValid(): boolean { return this.hasValue && this.#stringValue !== null; }
};
