export class ObjectPath {
    private readonly str: string;
    private children: {
        [key: string]: ObjectPath;
    } = {};
    constructor(private readonly path: string[], public parent?: ObjectPath) {
        this.str = path.join('.');
        this.parent = parent || this;
    }
    public child(key: string): ObjectPath {
        if (key in this.children) {
            return this.children[key];
        } else {
            const child = new ObjectPath(this.path.concat(key), this);
            this.children[key] = child;
            return child;
        }
    }
    public equals(other: ObjectPath) {
        return this.str === other.str;
    }
    public toString(): string {
        return this.str;
    }
}
