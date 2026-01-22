import { Storage } from "../../decorators/Storage";
import { DefaultDrivers } from "../../drivers/DefaultDrivers";
import { IndexedDBStorageDriver } from "../../drivers/IndexedDBStorageDriver";
import { LocalStorageDriver } from "../../drivers/LocalStorageDriver";
import { SessionStorageDriver } from "../../drivers/SessionStorageDriver";
import type { StorageDriver } from "../driver/StorageDriver";
import type { DataSerializer } from "../serializer/DataSerializer";
import { DefaultSerializer } from "../serializer/DefaultSerializer";
import type { BucketConfiguration } from "./BucketConfiguration";
import type { ChangeEvent } from "./ChangeEvent";

type MethodKeysOf<T> = keyof {
	[key in keyof T]: T[key] extends Function ? T[key] : never;
};
type BucketMethods = MethodKeysOf<Bucket>;

const PREPARE = Symbol("prepare");

function Prepared(): MethodDecorator {
	return ((
		target: PrivateBucketAPI & Bucket,
		propertyKey: BucketMethods,
		descriptor: TypedPropertyDescriptor<
			(...args: unknown[]) => Promise<unknown>
		>,
	) => {
		const origin = descriptor.value;
		if (!origin) {
			return;
		}
		descriptor.value = async function (this: Bucket, ...args: unknown[]) {
			let prepare_promise: Promise<void> | undefined = Reflect.getMetadata(
				PREPARE,
				this,
			);

			if (!prepare_promise) {
				prepare_promise = this[PREPARE]().finally(() => {
					descriptor.value = origin;
					Object.defineProperty(this, propertyKey, descriptor);
				});
				Reflect.defineMetadata(PREPARE, prepare_promise, this);
			}
			await prepare_promise;
			return origin.apply(this, args) as unknown;
		};
		Object.defineProperty(target, propertyKey, descriptor);
	}) as unknown as MethodDecorator;
}
interface PrivateBucketAPI {
	[PREPARE](): Promise<void>;
}
/**
 * Represents a storage bucket that provides a high-level API for persistent data storage.
 * A bucket uses a storage driver for the underlying storage mechanism and a serializer
 * for encoding/decoding data.
 *
 * @public
 */
export class Bucket {
	/**
	 * The name of this bucket.
	 */
	readonly name: string;
	private readonly driver!: StorageDriver;
	private readonly serializer: DataSerializer;
	/**
	 * Whether debug mode is enabled for logging storage operations.
	 */
	readonly debug: boolean;
	/**
	 * Creates a new Bucket instance.
	 * @param config - Configuration options for the bucket
	 */
	constructor(config: BucketConfiguration) {
		this.name = config.name ?? "";
		this.serializer = config.serializer || new DefaultSerializer();
		this.debug = config.debug ?? false;
		const driver = config.driver;
		if (driver === DefaultDrivers.LOCAL_STORAGE) {
			this.driver = LocalStorageDriver.createInstance(this.name);
		} else if (driver === DefaultDrivers.INDEXED_DB) {
			this.driver = new IndexedDBStorageDriver({
				bucketName: this.name,
				version: config.version,
			});
		} else if (driver === DefaultDrivers.SESSION_STORAGE) {
			this.driver = SessionStorageDriver.createInstance(this.name);
		} else {
			this.driver = driver || LocalStorageDriver.createInstance(this.name);
		}
	}
	async [PREPARE]() {
		const supports = await this.driver.supports();
		if (!supports) {
			throw new Error(
				`Your current browser does not support this storage driver: ${this.driver.name}!`,
			);
		}
		return this.driver.prepare();
	}
	@Prepared()
	private async prepared() {
		return void 0;
	}
	/**
	 * Observes changes to a specific storage key within this bucket.
	 * The observer will be notified when the key is updated or removed.
	 *
	 * @param key - The key to observe
	 * @param onChange - Callback function invoked when the key changes
	 * @returns A function that can be called to stop observing
	 *
	 * @example
	 * ```typescript
	 * const unobserve = bucket.observe('myKey', (event) => {
	 *   console.log('Value changed:', event.newValue);
	 * });
	 *
	 * // Later, to stop observing:
	 * unobserve();
	 * ```
	 */
	observe(
		key: string,
		onChange: (event: ChangeEvent) => void,
	): () => Promise<void> {
		const preparePromise = this.prepared();
		const unobserve = this.driver.observe(key, (event) => {
			return onChange({
				...event,
				target: this,
			});
		});
		return () => {
			return preparePromise.then(unobserve);
		};
	}
	/**
	 * Stores a value in the bucket under the specified key.
	 * The value will be serialized before storage.
	 *
	 * @param key - The key to store the value under
	 * @param value - The value to store
	 * @returns A promise that resolves when the value is stored
	 *
	 * @example
	 * ```typescript
	 * await bucket.setItem('user', { name: 'John', age: 30 });
	 * ```
	 */
	@Prepared()
	async setItem(key: string, value: unknown): Promise<void> {
		const blob = await this.serializer.serialize(value);
		return this.driver.setItem(key, blob);
	}
	/**
	 * Retrieves a value from the bucket by key.
	 * The value will be deserialized before being returned.
	 *
	 * @param key - The key of the value to retrieve
	 * @returns A promise that resolves to the stored value, or undefined if not found
	 * @typeParam T - The expected type of the stored value
	 *
	 * @example
	 * ```typescript
	 * const user = await bucket.getItem<User>('user');
	 * if (user) {
	 *   console.log(user.name);
	 * }
	 * ```
	 */
	@Prepared()
	async getItem<T>(key: string): Promise<T | undefined> {
		const blob = await this.driver.getItem(key);
		if (!blob) {
			return;
		}
		return this.serializer.deserialize<T>(blob);
	}
	/**
	 * Clears all items from the bucket.
	 *
	 * @returns A promise that resolves when the bucket is cleared
	 */
	@Prepared()
	clear() {
		return this.driver.clear();
	}
	/**
	 * Removes an item from the bucket by key.
	 *
	 * @param key - The key of the item to remove
	 * @returns A promise that resolves when the item is removed
	 */
	removeItem(key: string) {
		return this.driver.removeItem(key);
	}
	/**
	 * Creates a property decorator that binds a signal property to this bucket.
	 * This is equivalent to using `@Storage({ bucket: this, key })`.
	 *
	 * @param key - The storage key to use for this property
	 * @returns A property decorator
	 *
	 * @example
	 * ```typescript
	 * class MyService {
	 *   @Signal()
	 *   @myBucket.value('username')
	 *   username: string;
	 * }
	 * ```
	 */
	value(key: string): PropertyDecorator {
		return Storage({
			bucket: this,
			key,
		});
	}
}
