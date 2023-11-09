const path = require("path");
const { UserscriptPlugin } = require("webpack-userscript");
const manifestJson = require("./manifest.json");
const packageJson = require("./package.json");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
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
		entry: "./scripts/content.ts",
		output: {
			path: path.resolve(__dirname, "out"),
			filename: "content.js",
		},
	};

	const userscriptConfig = {
		name: "userscript",
		entry: "./scripts/content.ts",
		output: {
			path: path.resolve(__dirname, "dist"),
			filename: `${packageJson.name}.user.js`,
		},
		plugins: [
			new UserscriptPlugin({
				headers: {
					name: argv.mode === "development" ? `${manifestJson.name} (Dev)` : manifestJson.name,
					version: argv.mode === "development" ? `${manifestJson.version}-a.[buildTime]` : manifestJson.version,
					description: manifestJson.description,
					author: manifestJson.author,
					namespace: packageJson.repository,
					match: "https://*.target.com/*",
					icon: "https://www.google.com/s2/favicons?sz=64&domain=target.com",
				},
			}),
		],
	};

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
