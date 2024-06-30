import { DecodeContext } from '../context/DecodeContext';
import { EncodeContext } from '../context/EncodeContext';
import { Reference } from '../types/Reference';
import { ObjectPath } from './ObjectPath';
export interface ObjectMapper<I = unknown, O = I> {
    canTransform(object: I): boolean;
    transform(object: I, context: EncodeContext, path: ObjectPath): O | Reference;
    canRevive(object: O): boolean;
    revive(object: O, context: DecodeContext, path: ObjectPath): I;
}
