import { StorageDriver } from '../drivers/StorageDriver';
import { DataSerializer } from './DataSerializer';
import { Drivers } from './Drivers';

export interface StorageConfiguration {
    name?: string;
    version?: string;
    driver?: Drivers | StorageDriver;
    serializer?: DataSerializer;
}
