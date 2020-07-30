const unaryArr   = ['!', '<NEG>', '~'];
const binaryArr  = ['+', '-', '*', '/', '%', '^', '&', '|', '<<', '>>'];
const assignArr  = ['=', '+=', '-=', '*=', '/=', '%=', '^=', '&=', '|=', '<<=', '>>='];
const logicArr   = ['<', '>', '==', '!=', '<=', '>=', '$=', '!$=', '&&', '||'];
const ternaryArr = ['?', ':'];
const concatArr  = ['@', 'SPC', 'TAB', 'NL'];

const unaryOperators   = new Set (unaryArr);
const binaryOperators  = new Set (binaryArr);
const assignOperators  = new Set (assignArr);
const logicOperators   = new Set (logicArr);
const ternaryOperators = new Set (ternaryArr);
const concatOperators  = new Set (concatArr);

const operators = new Set (
[
	...unaryArr,
	...binaryArr,
	...assignArr,
	...logicArr,
	...ternaryArr,
	...concatArr,
]);


const isOperator = str =>
{
	return operators.has (str);
};

const isUnaryOperator = str =>
{
	return unaryOperators.has (str);
};

const isBinaryOperator = str =>
{
	return binaryOperators.has (str);
};

const isAssignOperator = str =>
{
	return assignOperators.has (str);
};

const isLogicOperator = str =>
{
	return logicOperators.has (str);
};

const isTernaryOperator = str =>
{
	return ternaryOperators.has (str);
};

const isConcatOperator = str =>
{
	return concatOperators.has (str);
};


export
{
	isOperator,
	isUnaryOperator,
	isBinaryOperator,
	isAssignOperator,
	isLogicOperator,
	isTernaryOperator,
	isConcatOperator,
};
