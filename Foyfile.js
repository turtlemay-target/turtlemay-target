const { fs, task } = require("foy");
const packageJson = require("./package.json");

task("clean", async (ctx) => {
	await fs.rmrf("./out");
	await fs.rmrf("./dist");
});

task("dev", async (ctx) => {
	await ctx.exec("webpack watch --mode=development");
});

task("build:webpack", ["clean"], async (ctx) => {
	await fs.mkdirp("./out");
	await fs.mkdirp("./dist");
	await ctx.exec("webpack --mode=production");
});

task("zip", ["clean", "build:webpack"], async (ctx) => {
	const outZip = `./dist/${packageJson.name}.zip`;
	await ctx.exec(`zip -D -r ${outZip} ./css ./out ./manifest.json`);
});

task("build", ["clean", "build:webpack", "zip"]);
