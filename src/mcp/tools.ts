import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { zodToJsonSchema } from "zod-to-json-schema";
import { ToolName } from "../types.js";
import { SearchWebInputSchema } from "./schemas.js";

export const getTools = (): Tool[] => [
	{
		name: ToolName.SEARCH_WEB,
		description: "Searches the web using the SearXNG meta search engine.",
		inputSchema: zodToJsonSchema(SearchWebInputSchema) as Tool["inputSchema"],
	},
];
