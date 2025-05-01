import { z } from "zod";

// #region Output
export const SearchResultItemSchema = z.object({
	url: z.string().url().describe("URL of the search result"),
	title: z.string().describe("Title of the search result"),
	content: z.string().describe("Content snippet of the search result"),
	engines: z
		.array(z.string())
		.describe("List of engines where this result appeared"),
});

export const SearchResultsSchema = z.array(SearchResultItemSchema);

export type SearchResultItem = z.infer<typeof SearchResultItemSchema>;
// #endregion

// #region Input
export const SearchWebInputSchema = z.object({
	query: z
		.string()
		.describe(
			"Search keywords. Use effective and professional search keywords, consider fewer words and time irrelevance to get more results.",
		),
	page: z
		.optional(z.number().min(1).default(1))
		.describe("Page number for pagination"),
});
export type SearchWebInput = z.infer<typeof SearchWebInputSchema>;
// #endregion
