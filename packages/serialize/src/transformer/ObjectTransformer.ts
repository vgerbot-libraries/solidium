import { isPlainObject } from 'is-plain-object';
import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/EncodeContext';
import { Transformer } from '../core/Transformer';
import { Tags } from '../core/Tags';

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
            const childPath = path.child(key);
            const value = Reflect.get(object, key);
            const transformer = context.transformerOf(value, childPath);
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
        for (const key in object) {
            const childPath = path.child(key);
            const value: unknown = Reflect.get(object, key);
            const transformer = context.transformerOf(value, childPath);
            const transformed = await transformer.encode(
                value,
                context,
                childPath
            );
            Reflect.set(result, key, transformed);
        }
        return Promise.resolve(result);
    }
    decode(data: Object): Promise<Object> {
        throw new Error('Method not implemented.');
    }
}
