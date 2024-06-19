import { Serializable } from '../core/Serializable';
import { Tags } from '../core/Tags';
import { transformer } from '../core/Transformer';

export class BlobTransformer extends transformer<Blob>(Tags.Blob) {
    toSerializable(
        object: Blob
    ): Promise<[Tags.Blob, Serializable, BlobPropertyBag]> {
        return object.arrayBuffer().then(buffer => {
            return [Tags.Blob, buffer, { type: object.type }];
        });
    }
    fromSerializable(
        data: [Tags.Blob, Serializable, BlobPropertyBag]
    ): Promise<Blob> {
        return Promise.resolve(new Blob([data[1] as BlobPart], data[2]));
    }
}
