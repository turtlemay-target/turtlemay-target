const { fs, task } = require("foy");

task("build", async (ctx) => {
	await ctx.exec("webpack --mode=production");
	await fs.mkdirp("./dist");
	await ctx.exec("zip -D -r ./dist/turtlemay-target.zip ./css ./out ./manifest.json");
});
