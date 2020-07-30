import enumerate from '~/util/enumerate.js';


const SIZE_INT8  = 1;
const SIZE_INT16 = 2;
const SIZE_INT32 = 4;

const SIZE_F64 = 8;

const numberTypes = enumerate (
[
	'UInt8',
	'UInt16LE',
	'UInt16BE',
	'UInt32LE',
	'UInt32BE',
	'DoubleLE',
	'DoubleBE',
]);


export { SIZE_INT8, SIZE_INT16, SIZE_INT32, SIZE_F64, numberTypes };
