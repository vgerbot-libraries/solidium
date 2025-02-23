export interface CookieItem {
    name: string;
    value: string;
    expireAt?: number;
    path?: string;
}
export declare class HttpHeaders {
    private readonly headers;
    constructor(init?: Headers | Record<string, string[]> | Map<string, string[]>);
    set(name: string, ...values: string[]): void;
    setAll(headers: Record<string, string | string[]> | Map<string, string | string[]> | Headers): void;
    append(name: string, ...values: string[]): void;
    get(name: string): string[] | undefined;
    delete(name: string): void;
    has(name: string): boolean;
    concat(other: HttpHeaders): HttpHeaders;
    forEach(callback: (key: string, value: string[]) => void): void;
    toNative(): Headers;
    [Symbol.iterator](): MapIterator<[string, string[]]>;
    [Symbol.toStringTag](): string;
    clone(): HttpHeaders;
    toJSON(): Record<string, string[]>;
}
