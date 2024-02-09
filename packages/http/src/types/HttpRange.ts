import { Cloneable } from './Cloneable';

export class HttpRange implements Cloneable<HttpRange> {
    constructor(
        public unit: string = 'bytes',
        public ranges: RangeSpecifier[] = []
    ) {}

    static parse(httpRange: string): HttpRange {
        const parts = httpRange.split('=');
        if (parts.length !== 2 || parts[0].trim() !== 'bytes') {
            throw new Error('Invalid HTTP range format');
        }

        const unit = parts[0].trim();
        const rangeSpecs = parts[1]
            .split(',')
            .map(spec => RangeSpecifier.parse(spec.trim()));

        const httpRangeObject = new HttpRange(unit);
        httpRangeObject.ranges = rangeSpecs;
        return httpRangeObject;
    }

    toString(): string {
        return (
            this.unit +
            '=' +
            this.ranges.map(range => range.toString()).join(',')
        );
    }
    clone(): HttpRange {
        const instance = new HttpRange(
            this.unit,
            this.ranges.map(it => it.clone())
        );
        return instance;
    }
}

class RangeSpecifier implements Cloneable<RangeSpecifier> {
    constructor(public first: number, public last?: number) {
        this.first = first;
        this.last = last;
    }

    static parse(spec: string): RangeSpecifier {
        const parts = spec.split('-');
        const first = parseInt(parts[0]);
        const last = parts[1] ? parseInt(parts[1]) : undefined;
        return new RangeSpecifier(first, last);
    }

    toString(): string {
        return (
            this.first.toString() +
            (this.last ? '-' + this.last.toString() : '')
        );
    }
    clone(): RangeSpecifier {
        return new RangeSpecifier(this.first, this.last);
    }
}
