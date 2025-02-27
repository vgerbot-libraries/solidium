export type Accessor<T> = () => T;
export type AccessorOrValue<T> = Accessor<T> | T;
