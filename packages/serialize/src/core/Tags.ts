export enum Tags {
    Ref = 0,
    Blob = 1,
    File = 2,
    RegExp = 3,
    Set = 4,
    Map = 5,
    Uint8Array = 6,
    Uint16Array = 7,
    Uint32Array = 8,
    Int8Array = 9,
    Int16Array = 10,
    Int32Array = 11,
    Float32Array = 12,
    Float64Array = 13,
    BigInt64Array = 14,
    BigUint64Array = 15,
    DataView = 16,
    Object = -1,
    Array = -2,
    Primary = -3
}
export function isValidTag(num: number): num is Tags {
    return Tags[num] in Tags;
}
