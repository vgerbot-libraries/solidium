import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ObjectMapper } from '../core/ObjectMapper';
import { Reference } from '../types/Reference';
import { DecodeContext } from '../context/DecodeContext';
export declare class ArrayMapper implements ObjectMapper<ArrayLike<unknown>> {
    canTransform(object: ArrayLike<unknown>): boolean;
    transform(object: ArrayLike<unknown>, context: EncodeContext, path: ObjectPath): unknown[] | Reference;
    canRevive(object: ArrayLike<unknown>): boolean;
    revive(object: ArrayLike<unknown>, context: DecodeContext, path: ObjectPath): ArrayLike<unknown>;
    private map;
}
