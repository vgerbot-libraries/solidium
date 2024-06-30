import { isPlainObject } from 'is-plain-object';
import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ReferenceHandler } from '../core/ReferenceHandler';
import { Reference } from '../types/Reference';

export class ObjectReferenceHandler implements ReferenceHandler {
    accept(object: unknown): boolean {
        return isPlainObject(object);
    }
    transform(
        object: Record<string, unknown>,
        context: EncodeContext,
        path: ObjectPath
    ): unknown {
        context.recording(object, path);
        const referencePath = context.getReference(object, path);
        if (referencePath) {
            return new Reference(referencePath.path);
        }
        const result: Record<string, unknown> = {};
        for (const key in object) {
            const value = object[key];
            const childPath = path.child(key);
            context.recording(value, childPath);
            const handler = context.getReferenceHandler(value);
            result[key] = handler.transform(value, context, childPath);
        }
        return result;
    }
}
