import DSOLoader        from '~/DSOLoader/DSOLoader.js';
import DSOControlBlock  from '~/DSOControlBlock/DSOControlBlock.js';
import DSODisassembler  from '~/DSODisassembler/DSODisassembler.js';
import DSOParser        from '~/DSOParser/DSOParser.js';
import DSOCodeGenerator from '~/DSOCodeGenerator/DSOCodeGenerator.js';

import
{
	DSODecompilerError,
	DSOLoaderError,
	DSODisassemblerError,
	DSOParserError,
	DSOCodeGeneratorError,
}
from '~/decompiler/errors.js';


/**
 * Decompiles a DSO file from a buffer.
 *
 * For browsers, use the `buffer` npm package.
 * For Node.js, use the native Buffer class.
 *
 * @param {Buffer} buffer
 * @param {Object} [options={}]
 *
 * @returns {string|Array} Either a code string or code array, depending on the options set.
 */
const decompileDSO = ( buffer, options = {} ) =>
{
	const { outputArray = false } = options;

	const loader = new DSOLoader (buffer);

	loader.read ();

	const controlBlock = new DSOControlBlock (0, loader.code.length);

	controlBlock.scan (loader.code);
	controlBlock.analyzeJumps ();

	const disassembler = new DSODisassembler (loader, controlBlock);
	const tokens       = disassembler.disassemble ();

	const parser   = new DSOParser (tokens, controlBlock);
	const astNodes = parser.parse ();

	const generator = new DSOCodeGenerator (astNodes);

	if ( outputArray )
	{
		return generator.generateCodeArray ();
	}
	else
	{
		return generator.generateCode ();
	}
};


export
{
	decompileDSO,

	DSOLoader,
	DSOControlBlock,
	DSODisassembler,
	DSOParser,
	DSOCodeGenerator,

	DSODecompilerError,
	DSOLoaderError,
	DSODisassemblerError,
	DSOParserError,
	DSOCodeGeneratorError,
};
