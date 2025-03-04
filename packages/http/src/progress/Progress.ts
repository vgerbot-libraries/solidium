export class Progress {
    constructor(
        public readonly total: number,
        public readonly loaded: number,
        public readonly chunk?: Uint8Array
    ) {}

    public percent(fractionDigits: number = 2): number {
        const p = Math.pow(10, fractionDigits);
        return this.total ? Math.round((this.loaded / this.total) * p) / p : 0;
    }
}
