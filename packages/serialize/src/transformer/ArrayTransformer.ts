import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/EncodeContext';
import { Tags } from '../core/Tags';
import { Transformer } from '../core/Transformer';

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
            const childPath = path.child(index + '');
            const transformer = context.transformerOf(it, childPath);
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
                const childPath = path.child(index + '');
                const transformer = context.transformerOf(it, childPath);
                return transformer.encode(it, context, path);
            })
        );
    }
    decode(data: unknown[]): Promise<unknown[]> {
        throw new Error('Method not implemented.');
    }
}
