import { createEntity } from '../common/createEntity';
import { mergeURLSearchParams } from '../common/mergeURLSearchParams';
import { resolveURL } from '../common/resolveURL';
import { HttpEvent } from '../events/HttpEvent';
import { HttpEventMap, HttpEventType } from '../events/HttpEventMap';
import { Fetcher } from '../types/Fetcher';
import { HttpConfiguration } from '../types/HttpConfiguration';
import { HttpEntity } from '../types/HttpEntity';
import { HttpHeaders } from '../types/HttpHeaders';
import { HttpInterceptor } from '../types/HttpInterceptor';
import { HttpMethod } from '../types/HttpMethod';
import { HttpRequest } from '../types/HttpRequest';
import {
    HttpRequestCacheOption,
    HttpRequestOptions
} from '../types/HttpRequestOptions';
import { ParameterEncoder } from '../types/ParameterEncoder';
import { StorageProvider } from '../types/StorageProvider';
import { NoopStorageProvider } from '../cache/provider/NoopStorageProvider';
import { FetchResourceOptions } from '../types/FetchResourceOptions';

export class HttpRequestImpl implements HttpRequest {
    url: URL;
    body: HttpEntity;
    headers: HttpHeaders;
    method: HttpMethod;
    cacheOption: HttpRequestCacheOption;
    fetcher: Fetcher;
    private readonly listeners: Map<
        HttpEventType,
        Array<(event: HttpEvent) => void>
    > = new Map();

    constructor(
        public readonly configuration: HttpConfiguration,
        private readonly requestOptions: HttpRequestOptions
    ) {
        const path = resolvePath(
            requestOptions.path,
            requestOptions.params || {},
            requestOptions.parameterEncoder || (value => value + '')
        );
        const url = resolveURL(configuration.baseUrl, path);
        const searchParams = mergeURLSearchParams(
            configuration.search,
            url.searchParams,
            requestOptions.search
        );
        url.search = searchParams.toString();
        this.url = url;
        const body = createEntity(requestOptions.body);
        this.body = body;
        this.headers = requestOptions.headers
            ? configuration.headers.mergeAll(requestOptions.headers)
            : configuration.headers.clone();
        this.method = requestOptions.method || HttpMethod.GET;
        this.cacheOption = requestOptions.cache || false;
        this.fetcher = requestOptions.fetcher || configuration.fetcher;
    }

    on<T extends HttpEventType>(
        type: T,
        listener: (event: HttpEventMap[T]) => void
    ): () => void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        const listeners = this.listeners.get(type) as Array<
            (event: HttpEventMap[T]) => void
        >;
        const store = listener.bind(this);
        listeners.push(store);
        return () => {
            const index = listeners.indexOf(store);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }

    dispatch(event: HttpEvent): void {
        const listeners = this.listeners.get(event.type);
        if (listeners) {
            listeners.forEach(listener => listener(event));
        }
    }

    clone(): HttpRequest {
        return new HttpRequestImpl(this.configuration, this.requestOptions);
    }

    get key(): string {
        if (this.requestOptions['key']) {
            return this.requestOptions.key;
        }
        return this.url.toString();
    }

    get interceptors(): HttpInterceptor[] {
        return this.configuration.interceptors.concat(
            this.requestOptions.interceptors || []
        );
    }

    getStorageProvider(storageProviderName?: string): StorageProvider {
        const {
            storageProviders,
            defaultStorageProvider: defaultStorageProviderOrName
        } = this.configuration;
        const provider = storageProviderName
            ? storageProviders[storageProviderName]
            : undefined;
        if (provider) {
            return provider;
        }
        const defaultStorageProvider =
            typeof defaultStorageProviderOrName === 'string'
                ? storageProviders[defaultStorageProviderOrName]
                : defaultStorageProviderOrName;
        if (typeof this.cacheOption === 'object') {
            const storageProvider =
                storageProviders[this.cacheOption.mode] ??
                defaultStorageProvider;
            if (!storageProvider) {
                throw new Error(
                    `Invalid storage provider: ${this.cacheOption.mode}`
                );
            }
            return storageProvider;
        } else if (!this.cacheOption) {
            return NoopStorageProvider.getInstance();
        }
        return defaultStorageProvider ?? NoopStorageProvider.getInstance();
    }
}

const REGEXP_DYNAMIC_SEGMENT = /{([^}?]+)\??}/;
const REGEXP_OPTIONAL_DYNAMIC_SEGMENT = /\/?{([^}?]+)\?}/g;

function resolvePath(
    path: string,
    params: Record<string, unknown>,
    parameterEncoder: ParameterEncoder
): string {
    const regexp = new RegExp(REGEXP_DYNAMIC_SEGMENT, 'g');

    const dynamicSegmentKeys = new Set<string>();
    let match;
    while ((match = regexp.exec(path)) !== null) {
        dynamicSegmentKeys.add(match[1]);
    }
    dynamicSegmentKeys.forEach(key => {
        if (!(key in params)) {
            return;
        }
        const pattern = new RegExp(`{${key}\\??}`, 'g');
        const value = params[key];
        path = path.replace(pattern, () => {
            return parameterEncoder(value);
        });
    });

    path = path.replace(REGEXP_OPTIONAL_DYNAMIC_SEGMENT, '');

    const missingDynamicSegmentMatch = path.match(REGEXP_DYNAMIC_SEGMENT);
    if (missingDynamicSegmentMatch) {
        throw new Error(
            // eslint-disable-next-line max-len
            `[solidium-http-client] required parameter missing (${missingDynamicSegmentMatch[1]}), "${path}" cannot be resolved`
        );
    }
    // https://www.rfc-editor.org/rfc/rfc1738#section-3.3
    if (path[0] !== '/' && path.length > 0) {
        path = `/${path}`;
    }
    return path;
}

export function createHttpRequest(
    baseOptions: HttpRequestOptions,
    fetchOptions: FetchResourceOptions,
    configuration: HttpConfiguration
) {
    const requestOptions: HttpRequestOptions = {
        ...baseOptions
    };
    if (fetchOptions.body) {
        requestOptions.body = fetchOptions.body;
    }
    if (fetchOptions.headers) {
        if (!requestOptions.headers) {
            requestOptions.headers = fetchOptions.headers;
        } else {
            requestOptions.headers = requestOptions.headers.mergeAll(
                requestOptions.headers
            );
        }
    }
    if (fetchOptions.search) {
        requestOptions.search = {
            ...requestOptions.search,
            ...fetchOptions.search
        };
    }
    if (fetchOptions.params) {
        requestOptions.params = {
            ...requestOptions.params,
            ...fetchOptions.params
        };
    }
    return new HttpRequestImpl(configuration, requestOptions);
}
