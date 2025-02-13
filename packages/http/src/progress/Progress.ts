export class Progress {
    constructor(
        public readonly total: number,
        public readonly loaded: number,
        public readonly chunk?: Uint8Array
    ) {}
}
