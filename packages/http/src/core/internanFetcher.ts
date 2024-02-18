import { isEventStream, isJson } from '../common/content-type';
import { JSONEntity } from '../entity/JSONEntity';
import { Fetcher } from '../types/Fetcher';
import { HttpEntity } from '../types/HttpEntity';
import { HttpRequest } from '../types/HttpRequest';
import { HttpResponse } from '../types/HttpResponse';
import { HttpHeadersImpl } from './HttpHeadersImpl';

export const internalFetcher: Fetcher = async (
    request: HttpRequest
): Promise<HttpResponse> => {
    const data = await request.body.data();
    const requestNativeHeaders = new Headers({});

    const requestHeadersMap = request.headers.getAll();
    requestHeadersMap.forEach((values, key) => {
        values.forEach(value => {
            requestNativeHeaders.append(key, value);
        });
    });
    const response = await fetch(request.url, {
        method: request.method,
        headers: requestNativeHeaders,
        body: data
    });
    const contentType = response.headers.get('Content-Type')?.toLowerCase();
    let entity!: HttpEntity;
    if (isJson(contentType)) {
        entity = new JSONEntity(() => {
            return response.text();
        });
    } else if (isEventStream(contentType)) {
        //
    } else {
        // TODO: response entity
    }
    const responseHeaders = HttpHeadersImpl.fromNativeHeaders(response.headers);

    return {
        body: entity,
        headers: responseHeaders,
        status: response.status,
        statusText: response.statusText,
        request: request
    } as HttpResponse;
};
