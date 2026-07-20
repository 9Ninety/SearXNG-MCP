# 🔍 SearXNG MCP Server

## ✨ Overview

**SearXNG MCP Server** bridges your self-hosted [SearXNG](https://github.com/searxng/searxng) instance with AI models using the Model Context Protocol (MCP). It provides a straightforward way for AI agents to perform web searches via your configured SearXNG meta-search engine, enabling them to access up-to-date information from the web.

This server focuses on providing a dead-simple search interface, intentionally limiting the parameters controllable by the AI.

**TLDR:** This MCP server is published to the npm registry as `searxng-mcp`. Start using it with your familiar LLM tools via npx or bunx, specifying the `SEARXNG_SERVER_URL` environment variable with your SearXNG instance URL to start playing.

---

## 🤔 Design Philosophy: Simplicity

This MCP server provides a very basic search tool on purpose. You can only provide **search keywords** and an optional **page number**.

**What you _cannot_ control via this MCP tool:**

- Specific search engines to use within SearXNG
- Search categories (e.g., images, news, files)
- Time range filters

**Why this limitation?**

Many AI/LLMs struggle to correctly utilize complex search parameters. They might:

- Randomly pick inappropriate search engines for a query.
- Attempt to search specialized repositories (like GitHub or arXiv) for general news or software release notes inappropriately.
- Apply time filters that yield no results.

Constantly instructing the AI on _how_ to use complex search filters ("use engine X and Y, not Z", "search in the 'news' category", "only look for results from the last week") is often inefficient and unreliable.

This MCP server avoids that complexity by design. It focuses on the core task: **searching the web based on keywords.**

**How to customize search behavior:**

Control _which_ search engines are enabled, default search settings, language preferences, and other advanced features directly within your **SearXNG instance configuration**. By pre-configuring SearXNG according to your needs, you ensure the AI uses a reliable and pre-vetted search setup without needing complex instructions for each query.

---

## 🤖 Model Support

You can use any AI model that supports function calling/tool use and is integrated with an MCP-compatible client. The following model families have been tested with MCP in general (though specific client support may vary):

- Claude 3.x Series
- Gemini 2.0 and newer
- GPT-4.1 Series
- Mistral Large
- Grok
- DeepSeek

---

## 💻 Works With

- [Claude Desktop](https://claude.ai/download)
- [Open WebUI](https://github.com/open-webui/open-webui) (via [mcpo](https://github.com/open-webui/mcpo))
- [TypingMind](https://www.typingmind.com/)
- [Cline](https://github.com/cline/cline) / [Roo Code](https://github.com/RooVetGit/Roo-Code)
- [Cherry Studio](https://github.com/CherryHQ/cherry-studio)

---

## ⚙️ Configuration

### Before you get started

There is one thing you have to confirm before starting use: **Your SearXNG instance must have JSON format enabled**, which is disabled by default in most publicly accessible instances.

You can enable it by setting the following options in your SearXNG config:

```yaml
search:
  formats:
    - html
    - json
```

> Note: You should protect your SearXNG instance from being accessed by unauthorized persons or bots, or it might be abused by automated programs which could cause your IP address to be blocked by search engines.
>
> It is recommended to make it private or whitelisted with IP addresses.

### Environment variables

*   `SEARXNG_SERVER_URL`: The **base URL** to your running SearXNG instance. (Required)
*   `SEARXNG_MODE`: Response engine, `json` or `html`. Defaults to `json`. (Optional)
*   `SEARXNG_METHOD`: HTTP method, `get` or `post`. Defaults to `get`. (Optional)

**Example:**

```ini
SEARXNG_SERVER_URL="https://my-searxng.example.com"
SEARXNG_MODE="json"
SEARXNG_METHOD="get"
```

Usually, you would configure this in the places where you configure your MCP servers, like the one shown below.

---

### Configure for Claude Desktop

Add this snippet to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "searxng-search": {
      "command": "npx",
      "args": ["-y", "searxng-mcp"],
      "env": {
        "SEARXNG_SERVER_URL": "https://my-searxng.example.com",
        "SEARXNG_MODE": "json",
        "SEARXNG_METHOD": "get"
      }
    }
  }
}
```

**Note:** For software that supports MCP they share the same configuration formats. Reference the, consult their documentation, or configure via GUI.

---

## 🔧 Available MCP Tools

This server provides one MCP tool:

### `search_web`

- **Description:** Searches the web using the configured SearXNG meta search engine.
- **Input Schema:**
  - `query` (string, required): Search keywords.
  - `page` (number, optional, default: 1): Page number for pagination
- **Output:** An array of search result items or an error message.

---

## 📝 Data Structure

### Input (`SearchWebInput`)

Corresponds to the `search_web` tool's input schema defined in `src/mcp/schemas.ts`.

```typescript
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
```

### Output (`SearchResultItem[]`)

The tool returns an array of objects matching the `SearchResultItemSchema` defined in `src/mcp/schemas.ts`.

```typescript
export const SearchResultItemSchema = z.object({
  url: z.string().url().describe("URL of the search result"),
  title: z.string().describe("Title of the search result"),
  content: z.string().describe("Content snippet of the search result"),
  engines: z
    .array(z.string())
    .describe("List of engines where this result appeared"),
});
```

---

## 📜 License

This project is licensed under the [GNU General Public License, version 2](LICENSE).
