import { Tags } from '../core/Tags';
import { TransformedData, Transformer } from '../core/Transformer';

export class BlobTransformer
    implements
        Transformer<Blob, TransformedData<[ArrayBuffer, BlobPropertyBag]>>
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
    transform(
        object: Blob
    ): Promise<TransformedData<[ArrayBuffer, BlobPropertyBag]>> {
        return object.arrayBuffer().then(buffer => {
            return {
                $: Tags.Blob,
                _: [buffer, { type: object.type }]
            };
        });
    }
    revive(data: TransformedData<[ArrayBuffer, BlobPropertyBag]>): Blob {
        const blob = new Blob([data._[0]], data._[1]);
        return blob;
    }
}
