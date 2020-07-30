class DSODecompilerError extends Error {}

class DSOLoaderError extends DSODecompilerError {}
class DSODisassemblerError extends DSODecompilerError {}
class DSOParserError extends DSODecompilerError {}
class DSOCodeGeneratorError extends DSODecompilerError {}


export
{
	DSODecompilerError,

	DSOLoaderError,
	DSODisassemblerError,
	DSOParserError,
	DSOCodeGeneratorError,
};
