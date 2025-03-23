export interface CookieItem {
    name: string;
    value: string;
    expireAt?: number;
    path?: string;
}
export class HttpHeaders {
    private readonly headers = new Map<string, string[]>();
    constructor(
        init?: Headers | Record<string, string[]> | Map<string, string[]>
    ) {
        if (init) {
            this.setAll(init);
        }
    }
    set(name: string, ...values: string[]) {
        this.headers.set(name, values);
    }
    setAll(
        headers:
            | Record<string, string | string[]>
            | Map<string, string | string[]>
            | Headers
    ) {
        if (headers instanceof Headers) {
            headers.forEach((value, name) => {
                this.set(name, value);
            });
        } else if (headers instanceof Map) {
            headers.forEach((value, key) => {
                if (Array.isArray(value)) {
                    this.set(key, ...value);
                } else {
                    this.set(key, value);
                }
            });
        } else {
            for (const key in headers) {
                const value = headers[key];
                if (Array.isArray(value)) {
                    this.set(key, ...value);
                } else {
                    this.set(key, value);
                }
            }
        }
    }
    append(name: string, ...values: string[]) {
        const originValues = this.headers.get(name) ?? [];
        const newValues = originValues.concat(values);
        this.headers.set(name, newValues);
    }
    get(name: string) {
        return this.headers.get(name);
    }
    delete(name: string) {
        this.headers.delete(name);
    }
    has(name: string) {
        return this.headers.has(name);
    }
    concat(other: HttpHeaders) {
        const result = new HttpHeaders(this.headers);
        other.forEach((key, value) => {
            result.set(key, ...value);
        });
        return result;
    }
    forEach(callback: (key: string, value: string[]) => void) {
        this.headers.forEach((value, key) => {
            callback(key, value);
        });
    }
    toNative(): Headers {
        const result = new Headers();
        this.forEach((key, value) => {
            result.append(key, value.join(', '));
        });
        return result;
    }
    [Symbol.iterator]() {
        return this.headers[Symbol.iterator]();
    }
    [Symbol.toStringTag]() {
        return 'HttpHeaders';
    }
    clone() {
        return new HttpHeaders(this.headers);
    }
    toJSON() {
        const result: Record<string, string[]> = {};
        this.headers.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }
    clear() {
        this.headers.clear();
    }
}
