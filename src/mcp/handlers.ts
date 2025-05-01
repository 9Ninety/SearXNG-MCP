import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { searchWeb } from "../searxng/web.js";
import { SearchResultItem } from "./schemas.js";

export const handleWebSearch = async (
	query: string,
	page: number | undefined,
): Promise<CallToolResult> => {
	let results: SearchResultItem[];
	try {
		results = await searchWeb(query, page);
	} catch (error: unknown) {
		console.error("Error fetching search results:", error);

		return {
			content: [
				{
					type: "text",
					text: `Error fetching search results: ${error?.toString()}`,
				},
			],
			isError: true,
		};
	}

	return {
		content: [
			{ type: "text", text: `Search results for '${query}':` },
			{ type: "text", text: JSON.stringify(results, null, 2) },
		],
	};
};
