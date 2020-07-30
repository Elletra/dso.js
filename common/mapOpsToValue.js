/**
 * @param   {Object} opsets - A key-value collection of opsets.
 * @returns {Object} Opcodes mapped to the opset name.
 */
const mapOpsToValue = ( opsets ) =>
{
	const map = {};

	for ( let type in opsets )
	{
		const opcodes = opsets[type];

		for ( let op of opcodes )
		{
			map[op] = type;
		}
	}

	return map;
};


export default mapOpsToValue;
