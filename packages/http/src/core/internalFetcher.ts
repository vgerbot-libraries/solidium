import { Defer } from '../common/Defer';
import { Fetcher } from '../types/Fetcher';
import { HttpBody } from '../types/HttpBody';
import { HttpMethod } from '../types/HttpMethod';
import { HttpRequest } from '../types/HttpRequest';
import { HttpRequestController } from '../types/HttpRequestController';
import { HttpResponse } from '../types/HttpResponse';
import { HttpHeadersImpl } from './HttpHeadersImpl';

export const internalFetcher: Fetcher = async (
    request: HttpRequest,
    controller: HttpRequestController
): Promise<HttpResponse> => {
    const body = await resolveBody(request);
    if (body instanceof ReadableStream) {
        return fetchRequestImpl(request, controller, body);
    } else {
        return xhrRequestImpl(request, controller, body);
    }
};
async function resolveBody(request: HttpRequest) {
    const cannotHaveBody =
        request.method === HttpMethod.GET || request.method === HttpMethod.HEAD;
    return cannotHaveBody ? undefined : await request.body.data();
}
function resolveHeaders(request: HttpRequest) {
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
    return requestNativeHeaders;
}
async function xhrRequestImpl(
    request: HttpRequest,
    controller: HttpRequestController,
    body: undefined | HttpBody
) {
    if (body instanceof ReadableStream) {
        return fetchRequestImpl(request, controller, body);
    }
    const xhr = new XMLHttpRequest();
    const defer = new Defer();

    const requestHeaders = resolveHeaders(request);
    requestHeaders.forEach((value, key) => {
        xhr.setRequestHeader(key, value);
    });

    xhr.upload.addEventListener('progress', ev => {
        controller.dispatchUploadProgress(request, ev.total, ev.loaded);
    });
    xhr.addEventListener('loadend', () => {
        defer.resolve(null);
        controller.dispatchRequestEndEvent(request);
    });
    xhr.addEventListener('loadstart', () => {
        controller.dispatchRequestStartEvent(request);
    });
    xhr.addEventListener('timeout', () => {
        controller.dispatchTimeoutEvent(request);
    });
    xhr.open(
        request.method,
        request.url,
        true,
        request.url.username,
        request.url.password
    );
    xhr.send(body);

    await defer.promise;
    const headersMap = resolveAllResponseHeaders(xhr);
    const headers = new HttpHeadersImpl(headersMap);
    const responseBody = resolveResponseData(xhr);
    const response = {
        body: () => {
            return Promise.resolve(responseBody);
        },
        headers: headers,
        status: xhr.status,
        statusText: xhr.statusText,
        request: request,
        clone: function () {
            return {
                ...response
            };
        }
    } as HttpResponse;
    return response;
}
function resolveAllResponseHeaders(xhr: XMLHttpRequest) {
    const xhrHeaders = xhr.getAllResponseHeaders();
    return xhrHeaders
        .split('\r\n')
        .map(item => {
            return item.split(':');
        })
        .reduce((map, [key, value]) => {
            if (map.has(key)) {
                map.get(key)?.push(value);
            } else {
                map.set(key, [value]);
            }
            return map;
        }, new Map<string, string[]>());
}
function resolveResponseData(xhr: XMLHttpRequest) {
    switch (xhr.responseType) {
        case 'blob':
            return xhr.response as Blob;
        case 'json':
            return new Blob([xhr.response], { type: 'application/json' });
        case 'arraybuffer':
            const contentType = xhr.getResponseHeader('content-type');
            return new Blob([xhr.response], {
                type: contentType || 'application/octet-stream'
            });
        case 'document':
        default:
            if (xhr.status < 200 || xhr.status >= 500) {
                return new Blob([xhr.response]);
            }
    }
    return new Blob([]);
}
async function fetchRequestImpl(
    request: HttpRequest,
    controller: HttpRequestController,
    body: ReadableStream
) {
    const headers = resolveHeaders(request);
    const response = await fetch(request.url, {
        method: request.method,
        headers: headers,
        body: body
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
}
