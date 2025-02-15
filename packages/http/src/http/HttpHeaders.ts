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
        if (init instanceof Headers) {
            init.forEach((value, name) => {
                this.set(name, value);
            });
        } else if (init instanceof Map) {
            init.forEach((value, name) => {
                this.headers.set(name, value);
            });
        } else if (init) {
            for (const name in init) {
                if (Object.hasOwn(init, name)) {
                    const value = init[name];
                    this.headers.set(name, value);
                }
            }
        }
    }
    set(name: string, ...values: string[]) {
        this.headers.set(name, values);
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
    [Symbol.iterator]() {
        return this.headers[Symbol.iterator]();
    }
    [Symbol.toStringTag]() {
        return 'HttpHeaders';
    }
}
