const JSON_CONTENT_TYPES = [
	"application/json",
	"application/json-patch+json",
	"application/vnd.api+json",
	"application/geo+json",
	"application/schema+json",
];

export function isJSON(contentType?: string): boolean {
	return (
		!!contentType &&
		JSON_CONTENT_TYPES.some((type) => contentType.includes(type))
	);
}
export function isText(contentType?: string): boolean {
	return (
		!!contentType &&
		/^text\/.*|application\/(javascript|ecmascript|xml|html|x-www-form-urlencoded)/i.test(
			contentType,
		)
	);
}

export function isTextEventStream(contentType?: string): boolean {
	return !!contentType && contentType.includes("text/event-stream");
}
