import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ObjectMapper } from '../core/ObjectMapper';
import { Reference } from '../types/Reference';
import { DecodeContext } from '../context/DecodeContext';
import { CodecContext } from '../core/CodecContext';

export class ArrayMapper implements ObjectMapper<ArrayLike<unknown>> {
    canTransform(object: ArrayLike<unknown>): boolean {
        return object.length >= 0;
    }
    transform(
        object: ArrayLike<unknown>,
        context: EncodeContext,
        path: ObjectPath
    ): unknown[] | Reference {
        context.recording(object, path);
        const referencePath = context.getReference(object, path);
        if (referencePath) {
            return new Reference(referencePath.path);
        }
        const result: unknown[] = Array(object.length);
        this.map(object, context, path, (index, item, path, mapper) => {
            result[index] = mapper.transform(item, context, path);
        });
        return result;
    }
    canRevive(object: ArrayLike<unknown>): boolean {
        return this.canTransform(object);
    }
    revive(
        object: ArrayLike<unknown>,
        context: DecodeContext,
        path: ObjectPath
    ): ArrayLike<unknown> {
        const isReadonly = Reflect.set(object, 0, object[0]);
        const receiver = (isReadonly ? [] : object) as unknown[];
        this.map(object, context, path, (index, item, path, mapper) => {
            receiver[index] = mapper.revive(item, context, path);
        });
        return receiver;
    }
    private map(
        object: ArrayLike<unknown>,
        context: CodecContext,
        path: ObjectPath,
        handle: (
            index: number,
            value: unknown,
            childPath: ObjectPath,
            mapper: ObjectMapper
        ) => void
    ) {
        context.recording(object, path);
        for (let i = 0; i < object.length; i++) {
            const value = object[i];
            const childPath = path.child(i);
            context.recording(value, childPath);
            const mapper = context.getObjectMapper(value);
            handle(i, value, childPath, mapper);
        }
        return object;
    }
}
