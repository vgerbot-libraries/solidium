import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ObjectMapper } from '../core/ObjectMapper';
import { Reference } from '../types/Reference';
import { DecodeContext } from '../context/DecodeContext';

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
        for (let i = 0; i < object.length; i++) {
            const childPath = path.child(i);
            context.recording(it, childPath);
            const handler = context.getObjectMapper(childPath);
            const item = handler.transform(it, context, childPath);
            result[i] = item;
        }
        return result;
    }
    revive(
        object: ArrayLike<unknown>,
        context: DecodeContext,
        path: ObjectPath
    ): ArrayLike<unknown> {
        for (let i = 0; i < object.length; i++) {
            const childPath = path.child(i);
            //
        }
        return object;
    }
}
