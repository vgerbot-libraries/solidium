import { isPlainObject } from 'is-plain-object';
import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ObjectMapper } from '../core/ObjectMapper';
import { Reference } from '../types/Reference';
import { DecodeContext } from '../context/DecodeContext';

export class PlainObjectMapper implements ObjectMapper {
    canTransform(object: unknown): boolean {
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
            const handler = context.getObjectMapper(value);
            result[key] = handler.transform(value, context, childPath);
        }
        return result;
    }
    revive(object: unknown, context: DecodeContext, path: ObjectPath): unknown {
        return object;
    }
}
