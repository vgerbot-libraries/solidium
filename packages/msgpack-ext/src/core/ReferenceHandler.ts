import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from './ObjectPath';

export interface ReferenceHandler {
    accept(object: unknown): boolean;
    transform(
        object: unknown,
        context: EncodeContext,
        path: ObjectPath
    ): unknown;
}
