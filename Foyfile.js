const { fs, task } = require("foy");
const manifestJson = require("./manifest.json");

task("build", async (ctx) => {
	await ctx.exec("webpack --mode=production");
	await fs.mkdirp("./dist");
	await ctx.exec(`zip -D -r ./dist/turtlemay-target-${manifestJson.version}.zip ./css ./out ./manifest.json`);
});
