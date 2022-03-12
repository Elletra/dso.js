const path = require ("path");
const webpack = require ("webpack");

const TerserPlugin = require ("terser-webpack-plugin");


module.exports =
{
	entry: "./main.ts",
	mode: process.argv.mode || "development",

	resolve:
	{
		extensions: [".ts", ".js"],
	},

	module:
	{
		rules:
		[
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},

	output:
	{
		filename: "dso.js",
		path: path.join (__dirname + "/dist"),

		library: "dso",
		libraryTarget: "commonjs2",

		umdNamedDefine: true,
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
					keep_fnames: true,
				},
			}),
		],
	},
};
