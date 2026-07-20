import { config } from "../config.js";

export const SEARXNG_SEARCH_URL = `${config.serverUrl}/search`;

export async function searxngFetch(
	params: URLSearchParams,
	accept: string,
): Promise<Response> {
	let res: Response;

	switch (config.method) {
		case "post":
			res = await fetch(SEARXNG_SEARCH_URL, {
				method: "POST",
				headers: {
					Accept: accept,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: params,
			});
			break;
		case "get":
			res = await fetch(`${SEARXNG_SEARCH_URL}?${params}`, {
				method: "GET",
				headers: { Accept: accept },
			});
			break;
		default:
			throw new Error(`Unsupported SEARXNG_METHOD: ${config.method}`);
	}

	if (!res.ok) {
		throw new Error(`HTTP ${res.status} ${res.statusText}`);
	}
	return res;
}
