const IGNORE_DUPLICATE_OF = new Set([
	"age",
	"authorization",
	"content-length",
	"content-type",
	"etag",
	"expires",
	"from",
	"host",
	"if-modified-since",
	"if-unmodified-since",
	"last-modified",
	"location",
	"max-forwards",
	"proxy-authorization",
	"referer",
	"retry-after",
	"user-agent",
]);

export function parseHeaders(rawHeaders: string) {
	const result = new Map<string, string[]>();
	if (!rawHeaders?.trim()) {
		return result;
	}
	rawHeaders.split(/[\r\n]+/).forEach((line) => {
		const colonIndex = line.indexOf(":");
		const key = line.substring(0, colonIndex).trim().toLowerCase();
		const value = line.substring(colonIndex + 1).trim();
		if (!key || (result.has(key) && IGNORE_DUPLICATE_OF.has(key))) {
			return;
		}

		const values = result.get(key) ?? [];
		values.push(value);
		result.set(key, values);
	});
	return result;
}
