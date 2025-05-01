import { SearchResultItem, SearchResultsSchema } from "../mcp/schemas.js";
import { SEAREXNG_SEARCH_URL } from "./endpoint.js";
import { isSearchResultResponse } from "./type.js";
export async function searchWeb(
	query: string,
	page = 1,
): Promise<SearchResultItem[]> {
	const queries = new URLSearchParams({
		q: query,
		format: "json",
		pageno: String(page),
	});

	let response: Response | null = null;

	try {
		response = await fetch(`${SEAREXNG_SEARCH_URL}?${queries}`, {
			method: "GET",
		});

		response = await response.json();
	} catch (error: unknown) {
		throw new Error(`Failed to fetch search results: ${error?.toString()}`, {
			cause: error,
		});
	}

	if (!isSearchResultResponse(response)) {
		throw new Error("Invalid response from SearXNG");
	}

	try {
		const parsedResults = SearchResultsSchema.parse(response.results);

		return parsedResults;
	} catch (error: unknown) {
		throw new Error(`Invalid search results format: ${error?.toString()}`, {
			cause: error,
		});
	}
}
