import { StorageDriver } from '../driver/StorageDriver';
import { DataSerializer } from '../serializer/DataSerializer';
import { DefaultDrivers } from '../../drivers/DefaultDrivers';
export interface BucketConfiguration {
    name: string;
    version?: number;
    driver?: DefaultDrivers | StorageDriver;
    serializer?: DataSerializer;
    description?: string;
}
