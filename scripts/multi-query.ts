/**
 * @file Open multiple semicolon-separated queries from search input.
 */

export { };

const QUERY_SEPARATOR = ";";

addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		const formEl = (
			document.activeElement?.querySelector<HTMLFormElement>(`form[action="/s"`) ||
			document.activeElement?.closest<HTMLFormElement>(`form[action="/s"]`)
		);

		const inputEl = formEl?.querySelector<HTMLInputElement>(`input[type="search"], input[type="text"]`);

		if (inputEl?.value.includes(QUERY_SEPARATOR)) {
			handleMultiQuery(inputEl.value);
		}
	}
});

addEventListener("click", (event) => {
	if (
		event.target instanceof HTMLButtonElement &&
		event.target.type === "submit"
	) {
		const formEl = event.target.closest<HTMLFormElement>(`form[action="/s"]`);
		const inputEl = formEl?.querySelector<HTMLInputElement>(`input[type="search"], input[type="text"]`);

		if (inputEl?.value.includes(QUERY_SEPARATOR)) {
			handleMultiQuery(inputEl.value);
		}
	}
});

function handleMultiQuery(str: string) {
	const queries = (
		str.split(QUERY_SEPARATOR)
			.filter(v => v.length > 0)
	);
	for (const v of queries) {
		const s = encodeURIComponent(v);
		window.open(`https://www.target.com/s?searchTerm=${s}`, "_blank");
	}
}
