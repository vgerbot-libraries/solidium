import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/EncodeContext';
import { Tags } from '../core/Tags';
import { Transformer } from '../core/Transformer';
import { DecodeContext } from '../core/DecodeContext';

export class ReferenceTransformer
    implements Transformer<unknown, [Tags.Ref, string] | unknown>
{
    getTag(): number {
        return Tags.Ref;
    }
    accept(): boolean {
        return false;
    }
    encode(
        object: unknown,
        context: EncodeContext,
        path: ObjectPath
    ): [Tags.Ref, string[]] | unknown {
        const referencePath = context.getReference(object);
        if (!referencePath) {
            throw new Error(`Object is not reference: ${path.path}`);
        }
        return [Tags.Ref, referencePath.path];
    }
    decode(
        data: [Tags.Ref, string[]] | unknown,
        context: DecodeContext,
        path: ObjectPath
    ): unknown {
        const root = path.root();
        if (Array.isArray(data) && data[0] === Tags.Ref) {
            const pathArray = data[1];
            const targetPath = root.descendant(pathArray);
            return context.getObject(targetPath);
        }
        throw new Error('');
    }
}
