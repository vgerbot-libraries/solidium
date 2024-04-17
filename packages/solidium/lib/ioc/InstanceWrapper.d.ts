export declare class InstanceWrapper {
    readonly instance: unknown;
    readonly serialNo: number;
    constructor(instance: unknown);
    compareTo(other: InstanceWrapper): -1 | 0 | 1;
}
