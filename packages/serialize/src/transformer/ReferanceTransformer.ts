import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/TransformContext';
import { Tags } from '../core/Tags';
import { TransformedData, Transformer } from '../core/Transformer';
import { ReviveContext } from '../core/ReviveContext';

export class ReferenceTransformer
    implements Transformer<unknown, TransformedData<string[]>>
{
    getTag(): number {
        return Tags.Ref;
    }
    accept(): boolean {
        return false;
    }
    transform(
        object: unknown,
        context: EncodeContext,
        path: ObjectPath
    ): TransformedData<string[]> {
        const referencePath = context.getReference(object);
        if (!referencePath) {
            throw new Error(`Object is not reference: ${path.path}`);
        }
        return {
            $: Tags.Ref,
            _: referencePath.path
        } as TransformedData<string[]>;
    }
    revive(
        data: TransformedData<string[]>,
        context: ReviveContext,
        path: ObjectPath
    ): unknown {
        const root = path.root();
        const pathArray = data._;
        const targetPath = root.descendant(pathArray);
        return context.getObject(targetPath);
    }
}
