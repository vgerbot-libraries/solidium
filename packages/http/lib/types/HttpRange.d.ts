import { Cloneable } from './Cloneable';
export declare class HttpRange implements Cloneable<HttpRange> {
    unit: string;
    ranges: RangeSpecifier[];
    constructor(unit?: string, ranges?: RangeSpecifier[]);
    static parse(httpRange: string): HttpRange;
    toString(): string;
    clone(): HttpRange;
}
declare class RangeSpecifier implements Cloneable<RangeSpecifier> {
    first: number;
    last?: number | undefined;
    constructor(first: number, last?: number | undefined);
    static parse(spec: string): RangeSpecifier;
    toString(): string;
    clone(): RangeSpecifier;
}
export {};
