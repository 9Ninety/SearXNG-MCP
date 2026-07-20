import { config } from "../config.js";
import { SearchResultItem, SearchResultsSchema } from "../mcp/schemas.js";
import { searxngFetch } from "./client.js";
import { parseHtmlResults } from "./html.js";
import { isSearchResultResponse } from "./type.js";

export async function searchWeb(
	query: string,
	page = 1,
): Promise<SearchResultItem[]> {
	switch (config.mode) {
		case "html":
			return searchHtml(query, page);
		case "json":
			return searchJson(query, page);
		default:
			throw new Error(`Unsupported SEARXNG_MODE: ${config.mode}`);
	}
}

async function searchJson(
	query: string,
	page: number,
): Promise<SearchResultItem[]> {
	const params = new URLSearchParams({
		q: query,
		format: "json",
		pageno: String(page),
	});

	let response: unknown;

	try {
		const res = await searxngFetch(params, "application/json");
		response = await res.json();
	} catch (error: unknown) {
		throw new Error(`Failed to fetch search results: ${error?.toString()}`, {
			cause: error,
		});
	}

	if (!isSearchResultResponse(response)) {
		throw new Error("Invalid response from SearXNG");
	}

	try {
		return SearchResultsSchema.parse(response.results);
	} catch (error: unknown) {
		throw new Error(`Invalid search results format: ${error?.toString()}`, {
			cause: error,
		});
	}
}

async function searchHtml(
	query: string,
	page: number,
): Promise<SearchResultItem[]> {
	const params = new URLSearchParams({
		q: query,
		pageno: String(page),
	});

	let html: string;

	try {
		const res = await searxngFetch(params, "text/html");
		html = await res.text();
	} catch (error: unknown) {
		throw new Error(`Failed to fetch search results: ${error?.toString()}`, {
			cause: error,
		});
	}

	try {
		return SearchResultsSchema.parse(parseHtmlResults(html));
	} catch (error: unknown) {
		throw new Error(`Invalid search results format: ${error?.toString()}`, {
			cause: error,
		});
	}
}
