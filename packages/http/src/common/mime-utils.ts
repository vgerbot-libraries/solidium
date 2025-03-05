export function isJSON(contentType?: string): boolean {
    return !!contentType && contentType.includes('application/json');
}
export function isText(contentType?: string): boolean {
    return !!contentType && contentType.includes('text/plain');
}
export function isTextEventStream(contentType?: string): boolean {
    return !!contentType && contentType.includes('text/event-stream');
}
