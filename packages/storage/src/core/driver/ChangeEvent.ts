import { ActionType } from '../../types/ActionType';
import { ChangeBy } from '../../types/ChangeBy';
import { Data } from '../../types/Data';
import { StorageDriver } from './StorageDriver';

export interface DriverChangeEvent {
    target: StorageDriver;
    key: string;
    changeBy: ChangeBy;
    action: ActionType;
    originValue?: Data;
    newValue?: Data;
}
