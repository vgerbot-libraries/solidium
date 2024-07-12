import { ActionType } from '../../types/ActionType';
import { ChangeBy } from '../../types/ChangeBy';
import { Data } from '../../types/Data';
import { Bucket } from './Bucket';

export interface ChangeEvent {
    target: Bucket;
    key: string;
    changeBy: ChangeBy;
    action: ActionType;
    originValue?: Data;
    newValue?: Data;
}
