const path = require("path");
const { TinyWebpackUserscriptPlugin } = require("tiny-webpack-userscript-plugin");
const manifestJson = require("./manifest.json");
const packageJson = require("./package.json");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = [{
	name: "extension",
	entry: {
		content: "./src/content.tsx",
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		path: path.resolve(__dirname, "out"),
		filename: "[name].js",
	},
	mode: "development",
	devtool: "inline-source-map",
}, {
	name: "userscript",
	entry: "./src/content.tsx",
	plugins: [
		new TinyWebpackUserscriptPlugin({
			scriptName: `${packageJson.name}-${manifestJson.version}`,
			headers: [{
				meta: {
					name: manifestJson.name,
					namespace: "us.turtlemay.target",
					description: manifestJson.description,
					version: manifestJson.version,
					include: "https://target.com/*",
				},
			}],
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: `${packageJson.name}.user.js`,
	},
	mode: "production",
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					format: {
						comments: false,
					},
				},
				extractComments: false,
			}),
		],
	},
}];
