import { has } from '~/util/has.js';


const map =
{
	'conditional': 'MarkerCondEnd',
	'loop':        'MarkerLoopEnd',
	'ifElse':      'MarkerElseEnd',
	'OR':          'MarkerLogicEnd',
	'AND':         'MarkerLogicEnd',
};

const jumpTypeToMarker = jumpType =>
{
	return has (map, jumpType) ? map[jumpType] : null;
};


export default jumpTypeToMarker;
