import { isPlainObject } from 'is-plain-object';
import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/TransformContext';
import { Transformer } from '../core/Transformer';
import { Tags } from '../core/Tags';
import { ReviveContext } from '../core/ReviveContext';

export class ObjectTransformer
    implements Transformer<Record<string, unknown>, Record<string, unknown>>
{
    getTag(): number {
        return Tags.Object;
    }
    accept(object: Object): boolean {
        return !!object && isPlainObject(object);
    }
    pretransform(
        object: Object,
        context: EncodeContext,
        path: ObjectPath
    ): void {
        context.recording(object, path);
        for (const key in object) {
            const value = Reflect.get(object, key);
            if (context.isHandled(value)) {
                continue;
            }
            const childPath = path.child(key);
            const transformer = context.transformerOf(value);
            if (transformer.pretransform) {
                transformer.pretransform(value, context, childPath);
            } else {
                context.recording(value, childPath);
            }
        }
    }
    async transform(
        object: Record<string, unknown>,
        context: EncodeContext,
        path: ObjectPath
    ): Promise<Record<string, unknown>> {
        const result: Record<string, unknown> = {};
        context.recording(result, path);
        for (const key in object) {
            const childPath = path.child(key);
            const value: unknown = object[key];
            const transformer = context.transformerOf(value);
            const transformed = await transformer.transform(
                value,
                context,
                childPath
            );
            result[key] = transformed;
        }
        return Promise.resolve(result);
    }
    revive(
        data: Record<string, unknown>,
        context: ReviveContext,
        path: ObjectPath
    ): Record<string, unknown> {
        const result: Record<string, unknown> = {};
        context.recording(result, path);
        for (const key in data) {
            const value = data[key];
            const childPath = path.child(key);
            const reviver = context.reviverOf(value);
            if (!reviver) {
                result[key] = value;
                continue;
            }
            const revived = reviver.revive(value, context, childPath);
            context.recording(revived, childPath);
            result[key] = revived;
        }
        return result;
    }
}
