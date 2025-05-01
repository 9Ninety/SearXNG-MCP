import { z } from "zod";

const SearXNGConfigSchema = z.object({
	serverUrl: z.string().url(),
	mode: z.literal("json"),
});

export type SearXNGConfig = z.infer<typeof SearXNGConfigSchema>;

export const config: SearXNGConfig = SearXNGConfigSchema.parse({
	serverUrl: process.env.SEARXNG_SERVER_URL,
	mode: "json",
});
