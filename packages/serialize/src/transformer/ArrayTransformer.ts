import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/TransformContext';
import { Tags } from '../core/Tags';
import { Transformer } from '../core/Transformer';
import { ReviveContext } from '../core/ReviveContext';

export class ArrayTransformer implements Transformer<unknown[], unknown[]> {
    getTag(): number {
        return Tags.Array;
    }
    accept(object: unknown[]): boolean {
        return Array.isArray(object);
    }
    pretransform?(
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
            if (transformer.pretransform) {
                transformer.pretransform(it, context, childPath);
            } else {
                context.recording(it, childPath);
            }
        });
    }
    transform(
        object: unknown[],
        context: EncodeContext,
        path: ObjectPath
    ): Promise<unknown[]> {
        return Promise.all(
            object.map((it, index) => {
                const childPath = path.child(index);
                const transformer = context.transformerOf(it);
                return transformer.transform(it, context, childPath);
            })
        );
    }
    revive(
        transformedData: unknown[],
        context: ReviveContext,
        path: ObjectPath
    ): unknown[] {
        context.recording(transformedData, path);
        transformedData.forEach((value, index) => {
            const transformer = context.reviverOf(value);
            if (!transformer) {
                return value;
            }
            const childPath = path.child(index);
            const revivedValue = transformer.revive(value, context, childPath);
            context.recording(revivedValue, childPath);
            transformedData[index] = revivedValue;
        });
        return transformedData;
    }
}
