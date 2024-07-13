import { isPlainObject } from 'is-plain-object';
import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ObjectMapper } from '../core/ObjectMapper';
import { Reference } from '../types/Reference';
import { DecodeContext } from '../context/DecodeContext';
import { CodecContext } from '../core/CodecContext';

export class PlainObjectMapper
    implements ObjectMapper<Record<string, unknown>>
{
    canTransform(object: unknown): boolean {
        return isPlainObject(object);
    }
    transform(
        object: Record<string, unknown>,
        context: EncodeContext,
        path: ObjectPath
    ): Record<string, unknown> | Reference {
        context.recording(object, path);
        const referencePath = context.getReference(object, path);
        if (referencePath) {
            return new Reference(referencePath.path);
        }
        const result: Record<string, unknown> = {};
        this.map(object, context, path, (key, value, path, mapper) => {
            result[key] = mapper.transform(value, context, path);
        });
        return result;
    }
    canRevive(object: unknown): boolean {
        return isPlainObject(object);
    }
    revive(
        object: Record<string, unknown>,
        context: DecodeContext,
        path: ObjectPath
    ): Record<string, unknown> {
        this.map(object, context, path, (key, value, path, mapper) => {
            object[key] = mapper.revive(value, context, path);
        });
        return object;
    }
    private map(
        object: Record<string, unknown>,
        context: CodecContext,
        path: ObjectPath,
        handle: (
            key: string,
            value: unknown,
            childPath: ObjectPath,
            mapper: ObjectMapper
        ) => void
    ) {
        context.recording(object, path);
        for (const key in object) {
            const value = object[key];
            const childPath = path.child(key);
            context.recording(value, childPath);
            const mapper = context.getObjectMapper(value);
            handle(key, value, childPath, mapper);
        }
    }
}
