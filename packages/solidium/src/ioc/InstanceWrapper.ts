let instanceSerialNo = -1;

export class InstanceWrapper {
    public readonly serialNo = ++instanceSerialNo;

    constructor(public readonly instance: unknown) {}

    public compareTo(other: InstanceWrapper): -1 | 0 | 1 {
        return this.serialNo > other.serialNo
            ? -1
            : this.serialNo < other.serialNo
            ? 1
            : 0;
    }
}
