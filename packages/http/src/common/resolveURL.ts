export function resolveURL(
    baseURL: string | URL | undefined,
    url: string | URL | undefined
) {
    if (url instanceof URL) {
        return url;
    }
    if (typeof url === 'string') {
        if (/^\w+\:\/\/[^\/].+/.test(url)) {
            return new URL(url);
        }
    }
    if (!url && !baseURL) {
        if (!baseURL) {
            throw new Error(
                'Cannot resolve base URL and request URL, both of them are not defined!'
            );
        }
    }
    if (!url) {
        return new URL('', baseURL);
    }
    if (!baseURL) {
        if (typeof globalThis.location === 'object') {
            baseURL = globalThis.location.origin;
        } else {
            throw new Error(
                'Cannot resolve base URL, current is not runing in browser environment!'
            );
        }
    }
    return new URL(url, baseURL);
}
