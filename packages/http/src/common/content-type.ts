export function isJson(contentType?: string) {
    return !!contentType && !!contentType.match(/\/json($|;)/i);
}
export function isText(contentType?: string) {
    return !!contentType && !!contentType.match(/text\/[^\/]+($|;)/i);
}
export function isEventStream(contentType?: string) {
    return !!contentType && !!contentType.match(/text\/event-stream($|;)/i);
}
