import { Fetcher } from '../types/Fetcher';
import { HttpMethod } from '../types/HttpMethod';
import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import { HttpHeadersImpl } from './HttpHeadersImpl';

export const internalFetcher: Fetcher = async (
    request: HttpRequest
): Promise<HttpResponse> => {
    const cannotHaveBody =
        request.method === HttpMethod.GET || request.method === HttpMethod.HEAD;
    const data = cannotHaveBody ? undefined : await request.body.data();
    const requestNativeHeaders = new Headers({});

    const requestHeadersMap = request.headers.getAll();
    requestHeadersMap.forEach((values, key) => {
        values.forEach(value => {
            requestNativeHeaders.append(key, value);
        });
    });
    const contentType = request.body.contentType();
    if (!contentType.isNone() && !requestNativeHeaders.has('Content-Type')) {
        requestNativeHeaders.set('Content-Type', contentType.toString());
    }
    const response = await fetch(request.url, {
        method: request.method,
        headers: requestNativeHeaders,
        body: data
    });
    const responseHeaders = HttpHeadersImpl.fromNativeHeaders(response.headers);

    let bodyPromise: Promise<Blob>;
    return {
        body: () => {
            if (!bodyPromise) {
                bodyPromise = response.blob();
            }
            return bodyPromise;
        },
        headers: responseHeaders,
        status: response.status,
        statusText: response.statusText,
        request: request
    } as HttpResponse;
};
