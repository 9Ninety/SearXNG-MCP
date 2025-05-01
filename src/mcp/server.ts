import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
	Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolName } from "../types.js";
import { handleWebSearch } from "./handlers.js";
import { SearchWebInputSchema } from "./schemas.js";
import { getTools } from "./tools.js";

export const createMCPServer = () => {
	const server = new Server(
		{
			name: "SearXNG MCP Server",
			version: "0.1.0",
		},
		{
			capabilities: {
				tools: {},
			},
		},
	);

	server.setRequestHandler(ListToolsRequestSchema, async () => {
		const tools: Tool[] = getTools();
		return { tools };
	});

	server.setRequestHandler(CallToolRequestSchema, async (request) => {
		const { name, arguments: args } = request.params;

		switch (name) {
			case ToolName.SEARCH_WEB: {
				const { query, page } = SearchWebInputSchema.parse(args);
				return handleWebSearch(query, page);
			}

			default:
				throw new Error(`Unknown tool: ${name}`);
		}
	});

	return { server };
};
