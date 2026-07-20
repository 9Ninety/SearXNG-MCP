import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { ToolName } from "../types.js";
import { SearchWebInputSchema } from "./schemas.js";

export const getTools = (): Tool[] => [
	{
		name: ToolName.SEARCH_WEB,
		description: "Searches the web using the SearXNG meta search engine.",
		inputSchema: z.toJSONSchema(SearchWebInputSchema) as Tool["inputSchema"],
	},
];
