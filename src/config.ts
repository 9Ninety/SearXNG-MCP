import { z } from "zod";

const SearXNGConfigSchema = z.object({
	serverUrl: z.string().url(),
	mode: z.enum(["json", "html"]).default("json"),
	method: z.enum(["get", "post"]).default("get"),
});

export type SearXNGConfig = z.infer<typeof SearXNGConfigSchema>;

export const config: SearXNGConfig = SearXNGConfigSchema.parse({
	serverUrl: process.env.SEARXNG_SERVER_URL,
	mode: process.env.SEARXNG_MODE,
	method: process.env.SEARXNG_METHOD,
});
