const { fs, task } = require("foy");
const packageJson = require("./package.json");
const manifestJson = require("./manifest.json");

task("build", async (ctx) => {
	await fs.rmrf("./out");
	await fs.rmrf("./dist");

	await fs.mkdirp("./out");
	await fs.mkdirp("./dist");

	await ctx.exec("webpack --mode=production");

	const outZip = `./dist/${packageJson.name}-${manifestJson.version}.zip`;
	await ctx.exec(`zip -D -r ${outZip} ./css ./out ./manifest.json`);
	await fs.copy(outZip, "./dist/${packageJson.name}.zip");
});
