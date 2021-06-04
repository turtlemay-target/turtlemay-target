const path = require("path");

module.exports = {
	entry: {
		content: "./src/content.tsx",
		background: "./src/background.ts",
	},
	module: {
		rules: [
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
};
