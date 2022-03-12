export interface IBuffer
{
	length: number;

	toString ( encoding?: string, start?: number, end?: number ): string;

	readUInt8 ( offset: number ): number;
	readUInt16LE ( offset: number ): number;
	readUInt16BE ( offset: number ): number;
	readUInt32LE ( offset: number ): number;
	readUInt32BE ( offset: number ): number;
	readFloatLE ( offset: number ): number;
	readFloatBE ( offset: number ): number;
	readDoubleLE ( offset: number ): number;
	readDoubleBE ( offset: number ): number;
}
