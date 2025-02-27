export type Accessor<T> = () => T;

export type Observerable<T> = T | Observer<T>;

export class Observer<T> {
    static of<T>(accessor: Accessor<T>) {
        return new Observer(accessor);
    }
    static property<Inst>(instance: Inst, property: keyof Inst) {
        return Observer.of(() => {
            return instance[property];
        });
    }
    constructor(private readonly accessor: Accessor<T>) {}

    get() {
        return this.accessor.call(null);
    }
}
