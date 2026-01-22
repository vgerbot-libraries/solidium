declare type Newable<T> = {
	new (...args: unknown[]): T;
};
