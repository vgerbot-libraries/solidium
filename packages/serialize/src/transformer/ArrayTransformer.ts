import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/EncodeContext';
import { Tags } from '../core/Tags';
import { Transformer } from '../core/Transformer';
import { DecodeContext } from '../core/DecodeContext';

export class ArrayTransformer
    implements Transformer<Array<unknown>, Array<unknown>>
{
    getTag(): number {
        return Tags.Array;
    }
    accept(object: unknown[]): boolean {
        return Array.isArray(object);
    }
    preEncode?(
        object: unknown[],
        context: EncodeContext,
        path: ObjectPath
    ): void {
        context.recording(object, path);
        object.forEach((it, index) => {
            if (context.isHandled(it)) {
                return;
            }
            const childPath = path.child(index + '');
            const transformer = context.transformerOf(it);
            if (transformer.preEncode) {
                transformer.preEncode(it, context, childPath);
            } else {
                context.recording(it, childPath);
            }
        });
    }
    encode(
        object: unknown[],
        context: EncodeContext,
        path: ObjectPath
    ): Promise<unknown[]> {
        return Promise.all(
            object.map((it, index) => {
                const childPath = path.child(index);
                const transformer = context.transformerOf(it);
                return transformer.encode(it, context, childPath);
            })
        );
    }
    decode(
        data: unknown[],
        context: DecodeContext,
        path: ObjectPath
    ): unknown[] {
        const result: unknown[] = [];
        context.recording(result, path);
        data.forEach((value, index) => {
            const transformer = context.transformerOf(value);
            if (!transformer) {
                return value;
            }
            const childPath = path.child(index);
            const item = transformer.decode(value, context, childPath);
            context.recording(item, childPath);
            result.push(item);
        });
        return result;
    }
}
