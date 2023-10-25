const { fs, task } = require("foy");
const manifestJson = require("./manifest.json");

task("build", async (ctx) => {
	await fs.mkdirp("./dist");
	await ctx.exec("webpack --mode=production");
	const outZip = `./dist/turtlemay-target-${manifestJson.version}.zip`;
	await ctx.exec(`zip -D -r ${outZip} ./css ./out ./manifest.json`);
	await fs.copy(outZip, "./dist/turtlemay-target.zip");
});
