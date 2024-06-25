export declare enum Tags {
    Ref = 0,
    Blob = 1,
    File = 2,
    RegExp = 3,
    Undefined = 4,
    Set = 5,
    Map = 6,
    Uint8Array = 7,
    Uint16Array = 8,
    Uint32Array = 9,
    Int8Array = 10,
    Int16Array = 11,
    Int32Array = 12,
    Float32Array = 13,
    Float64Array = 14,
    BigInt64Array = 15,
    BigUint64Array = 16,
    DataView = 17,
    Object = 18,
    Array = 19,
    Primary = 20
}
export declare function isValidTag(num: number): num is Tags;
