#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMCPServer } from "./mcp/server.js";

async function main() {
	const transport = new StdioServerTransport();
	const { server } = createMCPServer();

	await server.connect(transport);

	console.log("SearXNG MCP server is running on stdio...");

	process.on("SIGINT", async () => {
		console.log("Shutting down SearXNG MCP server...");
		await server.close();
		process.exit(0);
	});
}

main().catch((error) => {
	console.error("Server error:", error);
	process.exit(1);
});
