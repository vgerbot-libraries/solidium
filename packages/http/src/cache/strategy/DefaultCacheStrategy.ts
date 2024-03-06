import { HttpHeadersImpl } from '../../core/HttpHeadersImpl';
import { CacheStrategy } from '../../types/CacheStrategy';
import { HttpHeaders } from '../../types/HttpHeaders';
import { HttpMethod } from '../../types/HttpMethod';
import { HttpRequest } from '../../types/HttpRequest';
import { HttpResponse } from '../../types/HttpResponse';

interface CachedData {
    body: string; // data uri
    headers: Record<string, string[]>;
    status: string;
    statusText: string;
}
class CachedHttpResponse implements HttpResponse {
    constructor(
        public request: HttpRequest,
        private readonly cachedData: CachedData
    ) {
        const headersMap = new Map<string, string[]>();
        for (const name in cachedData.headers) {
            headersMap.set(name, cachedData.headers[name]);
        }
        this.headers = new HttpHeadersImpl(headersMap);
        this.status = parseInt(cachedData.status, 10);
        this.statusText = cachedData.statusText;
    }
    async body(): Promise<Blob> {
        const response = await fetch(this.cachedData.body);
        return response.blob();
    }
    headers: HttpHeaders;
    status: number;
    statusText: string;
    clone(): HttpResponse {
        return new CachedHttpResponse(this.request, this.cachedData);
    }
}
export class DefaultCacheStrategy implements CacheStrategy {
    execute(
        request: HttpRequest,
        next: (response?: HttpResponse | undefined) => Promise<HttpResponse>
    ): Promise<HttpResponse> {
        switch (request.method) {
            case HttpMethod.PUT:
            case HttpMethod.DELETE:
            case HttpMethod.PATCH:
            case HttpMethod.POST:
                return next();
        }
        const provider = request.configuration.storageProvider;
        const key = request.key;
        return provider.get(key).then(value => {
            if (!value) {
                return next().then(response => {
                    return serializeResponse(response)
                        .then(data => {
                            return provider.set(key, JSON.stringify(data));
                        })
                        .then(() => {
                            return response;
                        });
                });
            }
            const cachedData = JSON.parse(value) as CachedData;
            return new CachedHttpResponse(request, cachedData);
        });
    }
    clearCache(request: HttpRequest): Promise<void> {
        const provider = request.configuration.storageProvider;
        const key = request.key;
        return provider.remove(key);
    }
}

async function serializeResponse(response: HttpResponse): Promise<CachedData> {
    const headersMap = response.headers.getAll();
    const headersRecord: Record<string, string[]> = {};

    headersMap.forEach((value, key) => {
        headersRecord[key] = value;
    });

    const dataURI = await response.body().then(blob => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise<string>((resolve, reject) => {
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
        });
    });
    return {
        body: dataURI,
        headers: headersRecord,
        status: response.status + '',
        statusText: response.statusText
    } as CachedData;
}
