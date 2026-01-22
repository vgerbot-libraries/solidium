export enum PromiseStatus {
	PENDING = "pending",
	FULFILLED = "fulfilled",
	REJECTED = "rejected",
}
const STATUS = Symbol("status");
const FULFILLED_VALUE = Symbol("fullfilled-value");
const REJECTED_REASON = Symbol("rejected-reason");
const ABORT_CONTROLLER = Symbol("abort-controller");

export class Defer<T> {
	static resolve<T>(value: T | PromiseLike<T>) {
		const defer = new Defer<T>();
		defer.resolve(value);
		return defer;
	}
	static reject<T>(reason: unknown) {
		const defer = new Defer<T>();
		defer.reject(reason);
		return defer;
	}
	static fromArray<T>(
		array: ArrayLike<T | PromiseLike<T>>,
		mapfn?: (value: T | PromiseLike<T>) => Promise<T>,
	) {
		const defer = new Defer<T[]>();

		if (typeof mapfn !== "function") {
			Promise.all(Array.from(array)).then(defer.resolve, defer.reject);
		} else {
			Promise.all(
				Array.from(array, (value) => {
					if (defer.isCancelled) {
						return Promise.reject(defer.rejectedReason);
					}
					return mapfn(value);
				}),
			).then(defer.resolve, defer.reject);
		}

		return defer;
	}

	// static all<T extends readonly unknown[]>(values: T, mapfn?: (value: T[keyof T]) => Promise<unknown>) {
	//     const defer = new Defer<{
	//         -readonly [P in keyof T]: Awaited<T[P]>;
	//     }>();

	//     return defer;
	// }
	static serial(array: ArrayLike<() => void | PromiseLike<void>>) {
		const defer = new Defer<void>();
		Array.from(array)
			.reduce(async (acc, item) => {
				await acc;
				if (defer.isCancelled) {
					return;
				}
				await item();
			}, Promise.resolve())
			.then(defer.resolve, defer.reject);
		return defer.promise;
	}

	public readonly promise: Promise<T>;
	public readonly resolve!: (value: T | PromiseLike<T>) => void;
	public readonly reject!: (reason?: unknown) => void;

	private [STATUS]: PromiseStatus = PromiseStatus.PENDING;
	private [FULFILLED_VALUE]?: T;
	private [REJECTED_REASON]?: unknown;
	private [ABORT_CONTROLLER] = new AbortController();

	public get status() {
		return this[STATUS];
	}
	public get isSettled(): boolean {
		return this.status !== PromiseStatus.PENDING;
	}
	public get fullfilledValue() {
		return this[FULFILLED_VALUE];
	}

	public get rejectedReason() {
		return this[REJECTED_REASON];
	}
	public get isCancelled() {
		return this[REJECTED_REASON] instanceof CancellationError;
	}
	public get signal() {
		return this[ABORT_CONTROLLER].signal;
	}

	constructor() {
		let _resolve: (value: T | PromiseLike<T>) => void;
		let _reject: (reason?: unknown) => void;
		const doResolve = (value: T) => {
			this[FULFILLED_VALUE] = value;
			this[STATUS] = PromiseStatus.FULFILLED;
			_resolve(value);
		};
		this.resolve = (value) => {
			if (this.isSettled) {
				return;
			}
			if (isPromiseLike(value)) {
				value.then(doResolve);
			} else {
				doResolve(value);
			}
		};
		this.reject = (reason) => {
			if (this.isSettled) {
				return;
			}
			this[REJECTED_REASON] = reason;
			this[STATUS] = PromiseStatus.REJECTED;
			_reject(reason);
		};
		this.promise = new Promise<T>((resolve, reject) => {
			_resolve = resolve;
			_reject = reject;
		});
	}
	abort(message?: string) {
		this[ABORT_CONTROLLER].abort();
		this.reject(new CancellationError(message));
	}
	invokeOnCompletion(completionHandler: CompletionHandler<T>) {
		if (this.isSettled) {
			completionHandler.call(this, this[REJECTED_REASON]);
			return noop;
		}
		let disposed = false;
		this.promise.finally(() => {
			if (disposed) {
				return;
			}
			completionHandler.call(this, this[REJECTED_REASON]);
		});
		return () => {
			disposed = true;
		};
	}
}
export type DisposableHandler = () => void;
export type CompletionHandler<T> = (
	this: Defer<T>,
	reason?: unknown,
) => DisposableHandler;

export class CancellationError extends Error {
	constructor(message?: string) {
		super(message);
		this.name = "CancellationError";
	}
}

function isPromiseLike<T>(value: unknown): value is PromiseLike<T> {
	return (
		value != null &&
		typeof value === "object" &&
		typeof (value as PromiseLike<T>).then === "function"
	);
}
function noop() {}
