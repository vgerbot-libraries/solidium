export class ObjectPath {
    private readonly str: string;
    private children: {
        [key: string]: ObjectPath;
    } = {};
    public parent: ObjectPath;
    constructor(public readonly path: string[], parent?: ObjectPath) {
        this.str = path.join('.');
        this.parent = parent || this;
    }
    public child(key: string | number): ObjectPath {
        if (key in this.children) {
            return this.children[key];
        } else {
            const child = new ObjectPath(this.path.concat(key + ''), this);
            this.children[key] = child;
            return child;
        }
    }
    public equals(other: ObjectPath) {
        if (this === other) {
            return true;
        }
        if (this.path.length !== other.path.length) {
            return false;
        }
        return !this.path.some((it, idx) => other.path[idx] !== it);
    }
    public toString(): string {
        return this.str;
    }
    public root(): ObjectPath {
        return this.parent === this ? this : this.parent.root();
    }
    public descendant(path: string[]) {
        return path.reduce(
            (parent: ObjectPath, key) => parent.child(key),
            this
        );
    }
}
