const path = require("path");
const { TinyWebpackUserscriptPlugin } = require("tiny-webpack-userscript-plugin");
const manifestJson = require("./manifest.json");
const packageJson = require("./package.json");
const TerserPlugin = require("terser-webpack-plugin");

const baseConfig = {
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
};

const extensionConfig = {
	name: "extension",
	entry: "./src/content.ts",
	output: {
		path: path.resolve(__dirname, "out"),
		filename: "[name].js",
	},
};

const userscriptConfig = {
	name: "userscript",
	entry: "./src/content.ts",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: `${packageJson.name}.user.js`,
	},
	plugins: [
		new TinyWebpackUserscriptPlugin({
			scriptName: `${packageJson.name}-${manifestJson.version}`,
			headers: [{
				meta: {
					name: manifestJson.name,
					namespace: "us.turtlemay.target",
					description: manifestJson.description,
					author: manifestJson.author,
					icon: "https://www.google.com/s2/favicons?sz=64&domain=target.com",
					version: manifestJson.version,
					match: "https://*.target.com/*",
				},
			}],
		}),
	],
};

module.exports = (env, argv) => {
	if (argv.mode === "development") {
		baseConfig.devtool = "inline-source-map";
	}

	if (argv.mode === "production") {
		baseConfig.optimization = {
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
		};
	}

	return [
		Object.assign({}, baseConfig, extensionConfig),
		Object.assign({}, baseConfig, userscriptConfig),
	];
};
