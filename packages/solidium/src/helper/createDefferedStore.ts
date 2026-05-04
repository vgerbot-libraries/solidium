import { createStore, produce } from "solid-js/store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string | symbol, any>;

type PendingOp =
	| {
			kind: "set";
			path: ReadonlyArray<string | symbol>;
			key: string | symbol;
			value: unknown;
	  }
	| {
			kind: "delete";
			path: ReadonlyArray<string | symbol>;
			key: string | symbol;
	  };

/**
 *
 * Wraps the given object in a Solid store and returns a deep Proxy that:
 *  - batches mutations (set/delete) into a microtask flush via `produce`
 *  - flushes synchronously on read when a pending mutation may affect the read path
 *  - lazily caches nested object proxies
 */
export const createDefferedStore = <T extends object>(target: T): T => {
	const [object, set] = createStore(target as object);

	const pendingOps: PendingOp[] = [];
	let scheduled = false;

	const flush = () => {
		scheduled = false;
		if (pendingOps.length === 0) {
			return;
		}
		const ops = pendingOps.splice(0, pendingOps.length);
		set(
			produce((draft: AnyRecord) => {
				for (const op of ops) {
					let node: AnyRecord = draft;
					for (const segment of op.path) {
						node = node[segment] as AnyRecord;
					}
					if (op.kind === "set") {
						node[op.key] = op.value;
					} else {
						delete node[op.key];
					}
				}
			}),
		);
	};

	const schedule = () => {
		if (scheduled) {
			return;
		}
		scheduled = true;
		queueMicrotask(flush);
	};

	const hasPendingForPath = (
		readPath: ReadonlyArray<string | symbol>,
	): boolean => {
		for (const op of pendingOps) {
			if (op.path.length >= readPath.length) {
				continue;
			}
			let isPrefix = true;
			for (let i = 0; i < op.path.length; i++) {
				if (op.path[i] !== readPath[i]) {
					isPrefix = false;
					break;
				}
			}
			if (isPrefix && op.key === readPath[op.path.length]) {
				return true;
			}
		}
		return false;
	};

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const proxyCache = new WeakMap<object, any>();

	const createProxyForNestedObject = (
		obj: object,
		path: ReadonlyArray<string | symbol> = [],
	): object => {
		const cached = proxyCache.get(obj);
		if (cached) {
			return cached;
		}

		const proxy = new Proxy(obj, {
			get(t, p, receiver) {
				if (pendingOps.length > 0 && hasPendingForPath([...path, p])) {
					flush();
				}
				const value = Reflect.get(t, p, receiver);
				if (!!value && typeof value === "object") {
					return createProxyForNestedObject(value as object, [...path, p]);
				}
				return value;
			},
			set(_t, p, newValue) {
				pendingOps.push({ kind: "set", path, key: p, value: newValue });
				schedule();
				return true;
			},
			deleteProperty(_t, p) {
				pendingOps.push({ kind: "delete", path, key: p });
				schedule();
				return true;
			},
		});

		proxyCache.set(obj, proxy);
		return proxy;
	};

	return createProxyForNestedObject(object) as T;
};
