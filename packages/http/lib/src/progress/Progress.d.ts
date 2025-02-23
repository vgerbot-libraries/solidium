export declare class Progress {
    readonly total: number;
    readonly loaded: number;
    readonly chunk?: Uint8Array | undefined;
    constructor(total: number, loaded: number, chunk?: Uint8Array | undefined);
}
