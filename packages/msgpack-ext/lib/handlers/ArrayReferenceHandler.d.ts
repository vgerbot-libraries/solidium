import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ReferenceHandler } from '../core/ReferenceHandler';
export declare class ArrayReferenceHandler implements ReferenceHandler {
    accept(object: unknown): boolean;
    transform(object: unknown[], context: EncodeContext, path: ObjectPath): unknown;
}
