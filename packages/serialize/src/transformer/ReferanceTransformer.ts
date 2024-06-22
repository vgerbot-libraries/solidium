import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/EncodeContext';
import { Tags } from '../core/Tags';
import { Transformer } from '../core/Transformer';

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
    ): [Tags.Ref, string] | unknown {
        const referencePath = context.getReference(path);
        if (!referencePath) {
            return object;
        }
        return [Tags.Ref, referencePath.toString()];
    }
    decode(data: [Tags.Ref, string] | unknown): Promise<unknown> {
        if (Array.isArray(data) && data[0] === Tags.Ref) {
            //
        }
        throw new Error('');
    }
}
