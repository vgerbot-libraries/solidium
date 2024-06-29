export declare class ObjectPath {
    readonly path: string[];
    private readonly str;
    private children;
    parent: ObjectPath;
    constructor(path: string[], parent?: ObjectPath);
    child(key: string | number): ObjectPath;
    equals(other: ObjectPath): boolean;
    toString(): string;
    root(): ObjectPath;
    descendant(path: string[]): ObjectPath;
}
