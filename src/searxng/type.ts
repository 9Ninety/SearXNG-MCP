import { SearchResultItem } from "../mcp/schemas.js";

export function isSearchResultResponse(
	response: unknown,
): response is { results: SearchResultItem[] } {
	return (
		typeof response === "object" &&
		response !== null &&
		"results" in response &&
		Array.isArray(response.results) &&
		response.results.length > 0 &&
		"url" in response.results[0]
	);
}
