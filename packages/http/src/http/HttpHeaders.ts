export interface CookieItem {
    name: string;
    value: string;
    expireAt?: number;
    path?: string;
}
export class HttpHeaders {
    private readonly headers = new Map<string, string[]>();
    constructor(init?: Headers | Record<string, string>) {
        if (init instanceof Headers) {
            init.forEach((value, name) => {
                this.set(name, value);
            });
        } else if (init) {
            for (const name in init) {
                if (init.hasOwnProperty(name)) {
                    this.set(name, init[name]);
                }
            }
        }
    }
    set(name: string, value: string) {
        this.headers.set(name, [value]);
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
