import { ActionType } from '../../types/ActionType';
import { ChangeBy } from '../../types/ChangeBy';
import { Data } from '../../types/Data';
import { StorageDriver } from './StorageDriver';

/**
 * Event object emitted by a storage driver when a storage item changes.
 *
 * @public
 */
export interface DriverChangeEvent {
    /**
     * The storage driver instance where the change occurred.
     */
    target: StorageDriver;
    /**
     * The key of the storage item that changed.
     */
    key: string;
    /**
     * Indicates whether the change was made by the current instance or another source.
     */
    changeBy: ChangeBy;
    /**
     * The type of action performed (update or remove).
     */
    action: ActionType;
    /**
     * The value before the change (undefined if the item was newly created).
     */
    originValue?: Data;
    /**
     * The new value after the change (undefined if the item was removed).
     */
    newValue?: Data;
}
