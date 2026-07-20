import { parse } from "node-html-parser";
import { SearchResultItem } from "../mcp/schemas.js";

/** Parse SearXNG simple-theme result articles from HTML. */
export function parseHtmlResults(html: string): SearchResultItem[] {
	const root = parse(html);
	const articles = root.querySelectorAll("article.result");

	if (articles.length === 0) {
		throw new Error("No SearXNG result structure found in response.");
	}

	return articles.flatMap((article) => {
		const link =
			article.querySelector("h3 a") ?? article.querySelector("a.url_header");
		const url = link?.getAttribute("href")?.trim();
		const title = link?.textContent?.replace(/\s+/g, " ").trim();
		if (!url || !title) return [];

		const content =
			article
				.querySelector("p.content, p.empty_content")
				?.textContent?.replace(/\s+/g, " ")
				.trim() ?? "";

		const engines = article
			.querySelectorAll(".engines > span")
			.map((el) => el.textContent.trim())
			.filter(Boolean);

		return [{ url, title, content, engines }];
	});
}
