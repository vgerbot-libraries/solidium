export class HttpRange {
    unit: string;
    ranges: RangeSpecifier[] = [];

    constructor(unit: string) {
        this.unit = unit;
    }

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
}

class RangeSpecifier {
    first: number;
    last: number | null;

    constructor(first: number, last: number | null = null) {
        this.first = first;
        this.last = last;
    }

    static parse(spec: string): RangeSpecifier {
        const parts = spec.split('-');
        const first = parseInt(parts[0]);
        const last = parts[1] ? parseInt(parts[1]) : null;
        return new RangeSpecifier(first, last);
    }

    toString(): string {
        return (
            this.first.toString() +
            (this.last !== null ? '-' + this.last.toString() : '')
        );
    }
}
