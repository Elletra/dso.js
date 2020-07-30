const path    = require ('path');
const webpack = require ('webpack');

const TerserPlugin = require ('terser-webpack-plugin');


module.exports =
{
	entry: './main.js',

	output:
	{
		filename: 'dso.js',
		path:     path.join (__dirname + '/dist'),

		library:       'dso',
		libraryTarget: 'commonjs2',

		umdNamedDefine: true,
	},

	mode: 'production',

	module:
	{
		rules:
		[
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				options:
				{
					presets: ['@babel/preset-env']
				}
			}
		]
	},

	optimization:
	{
    	minimize: true,
		minimizer:
		[
			new TerserPlugin (
			{
				terserOptions:
				{
					keep_classnames: true,
					keep_fnames:     true,
				},
			}),
		],
	},

	resolve:
	{
		alias:
		{
			'~/util':             path.resolve (__dirname, './common/util/'),
			'~/common':           path.resolve (__dirname, './common/'),
			'~/ArrayMap.js':      path.resolve (__dirname, './common/ArrayMap.js'),
			'~/decompiler':       path.resolve (__dirname, './decompiler/'),
			'~/DSOLoader':        path.resolve (__dirname, './decompiler/DSOLoader/'),
			'~/DSODisassembler':  path.resolve (__dirname, './decompiler/DSODisassembler/'),
			'~/DSOControlBlock':  path.resolve (__dirname, './decompiler/DSOControlBlock/'),
			'~/DSOToken':         path.resolve (__dirname, './decompiler/DSODisassembler/DSOToken/'),
			'~/DSOParser':        path.resolve (__dirname, './decompiler/DSOParser/'),
			'~/DSONode':          path.resolve (__dirname, './decompiler/DSOParser/DSONode/'),
			'~/DSOCodeGenerator': path.resolve (__dirname, './decompiler/DSOCodeGenerator/'),
		}
	},
};
