import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from './ObjectPath';
export interface ReferenceHandler {
    accept(object: unknown): boolean;
    traverse(object: unknown, context: EncodeContext, path: ObjectPath): void;
    transform(object: unknown, context: EncodeContext, path: ObjectPath): unknown;
}
