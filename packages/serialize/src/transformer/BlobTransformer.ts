import { Serializable } from '../core/Serializable';
import { Tags } from '../core/Tags';
import { Transformer } from '../core/Transformer';

export class BlobTransformer
    implements Transformer<Blob, [Tags.Blob, Serializable, BlobPropertyBag]>
{
    getTag(): number {
        return Tags.Blob;
    }
    accept(object: Blob): boolean {
        if (typeof File === 'function' && object instanceof File) {
            return false;
        }
        return object instanceof Blob;
    }
    encode(object: Blob): Promise<[Tags.Blob, Serializable, BlobPropertyBag]> {
        return object.arrayBuffer().then(buffer => {
            return [Tags.Blob, buffer, { type: object.type }];
        });
    }
    decode(data: [Tags.Blob, Serializable, BlobPropertyBag]): Blob {
        return new Blob([data[1] as BlobPart], data[2]);
    }
}
