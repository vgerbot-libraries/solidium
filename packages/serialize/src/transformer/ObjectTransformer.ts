import { isPlainObject } from 'is-plain-object';
import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/EncodeContext';
import { Transformer } from '../core/Transformer';
import { Tags } from '../core/Tags';
import { DecodeContext } from '../core/DecodeContext';

export class ObjectTransformer implements Transformer<Object, Object> {
    getTag(): number {
        return Tags.Object;
    }
    accept(object: Object): boolean {
        return !!object && isPlainObject(object);
    }
    preEncode(object: Object, context: EncodeContext, path: ObjectPath): void {
        context.recording(object, path);
        for (const key in object) {
            const value = Reflect.get(object, key);
            if (context.isHandled(value)) {
                continue;
            }
            const childPath = path.child(key);
            const transformer = context.transformerOf(value);
            if (transformer.preEncode) {
                transformer.preEncode(value, context, childPath);
            } else {
                context.recording(value, childPath);
            }
        }
    }
    async encode(
        object: Object,
        context: EncodeContext,
        path: ObjectPath
    ): Promise<Object> {
        const result: Object = {};
        context.recording(result, path);
        for (const key in object) {
            const childPath = path.child(key);
            const value: unknown = Reflect.get(object, key);
            const transformer = context.transformerOf(value);
            const transformed = await transformer.encode(
                value,
                context,
                childPath
            );
            Reflect.set(result, key, transformed);
        }
        return Promise.resolve(result);
    }
    decode(data: Object, context: DecodeContext, path: ObjectPath): Object {
        const result: Object = {};
        context.recording(result, path);
        for (const key in data) {
            const value = Reflect.get(data, key);
            const childPath = path.child(key);
            const transformer = context.transformerOf(value);
            if (!transformer) {
                Reflect.set(result, key, value);
                continue;
            }
            const transformed = transformer.decode(value, context, childPath);
            context.recording(transformed, childPath);
            Reflect.set(result, key, transformed);
        }
        return result;
    }
}
