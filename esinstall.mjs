import { install } from "esinstall";

install([
	"htm",
	"jsbarcode",
	"es-react",
], {
	dest: "web_modules",
	polyfillNode: true,
});
