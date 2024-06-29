import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ReferenceHandler } from '../core/ReferenceHandler';
export declare class ObjectReferenceHandler implements ReferenceHandler {
    accept(object: unknown): boolean;
    traverse(object: Record<string, unknown>, context: EncodeContext, path: ObjectPath): void;
    transform(object: Record<string, unknown>, context: EncodeContext, path: ObjectPath): unknown;
}
