import { Storage } from '../../decorators/Storage';
import { DefaultDrivers } from '../../drivers/DefaultDrivers';
import { LocalStorageDriver } from '../../drivers/LocalStorageDriver';
import { Data } from '../../types/Data';
import { DataSerializer } from '../serializer/DataSerializer';
import { StorageDriver } from '../driver/StorageDriver';
import { BucketConfiguration } from './BucketConfiguration';
import { DefaultSerializer } from '../serializer/DefaultSerializer';
import { ChangeEvent } from './ChangeEvent';
import { SessionStorageDriver } from '../../drivers/SessionStorageDriver';
import { IndexedDBStorageDriver } from '../../drivers/IndexedDBStorageDriver';

type MethodKeysOf<T> = keyof {
    [key in keyof T]: T[key] extends Function ? T[key] : never;
};
type BucketMethods = MethodKeysOf<Bucket>;

const PREPARE = Symbol('prepare');

function Prepared(): MethodDecorator {
    return ((
        target: PrivateBucketAPI & Bucket,
        propertyKey: BucketMethods,
        descriptor: TypedPropertyDescriptor<(...args: unknown[]) => unknown>
    ) => {
        const origin = descriptor.value;
        if (!origin) {
            return;
        }
        let prepare_promise: Promise<void>;
        descriptor.value = async function (...args: unknown[]) {
            if (!prepare_promise) {
                prepare_promise = target[PREPARE]().finally(() => {
                    descriptor.value = origin;
                    Object.defineProperty(target, propertyKey, descriptor);
                });
            }
            await prepare_promise;
            return origin.apply(target, args) as unknown;
        };
        Object.defineProperty(target, propertyKey, descriptor);
    }) as unknown as MethodDecorator;
}
interface PrivateBucketAPI {
    [PREPARE](): Promise<void>;
}
export class Bucket {
    private readonly name: string;
    private readonly driver!: StorageDriver;
    private readonly serializer: DataSerializer;
    constructor(config: BucketConfiguration) {
        this.name = config.name;
        this.serializer = config.serializer || new DefaultSerializer();
        const driver = config.driver;
        if (driver === DefaultDrivers.LOCAL_STORAGE) {
            this.driver = LocalStorageDriver.createInstance(this.name);
        } else if (driver === DefaultDrivers.INDEXED_DB) {
            this.driver = new IndexedDBStorageDriver({
                bucketName: this.name,
                version: config.version
            });
        } else if (driver === DefaultDrivers.SESSION_STORAGE) {
            this.driver = SessionStorageDriver.createInstance(this.name);
        } else {
            this.driver =
                driver || LocalStorageDriver.createInstance(this.name);
        }
    }
    async [PREPARE]() {
        const supports = await this.driver.supports();
        if (!supports) {
            throw new Error(
                `Your current browser does not support this storage driver: ${this.driver.name}!`
            );
        }
        return this.driver.prepare();
    }
    @Prepared()
    observe(key: string, onChange: (event: ChangeEvent) => void): () => void {
        return this.driver.observe(key, event => {
            return onChange({
                ...event,
                target: this
            });
        });
    }
    @Prepared()
    async setItem(key: string, value: Data): Promise<void> {
        const blob = await this.serializer.serialize(value);
        return this.driver.setItem(key, blob);
    }
    @Prepared()
    async getItem(key: string): Promise<Data | undefined> {
        const blob = await this.driver.getItem(key);
        if (!blob) {
            return;
        }
        return this.serializer.deserialize<Data>(blob);
    }
    @Prepared()
    clear() {
        return this.driver.clear();
    }
    value(key: string): PropertyDecorator {
        return Storage({
            bucket: this,
            key
        });
    }
}
