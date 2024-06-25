import { Tags } from '../core/Tags';
import { TransformedData, Transformer } from '../core/Transformer';

export class FileTransformer
    implements
        Transformer<
            File,
            TransformedData<[ArrayBuffer, string, FilePropertyBag]>
        >
{
    getTag(): number {
        return Tags.File;
    }
    accept(object: File): boolean {
        if (typeof File !== 'function') {
            return false;
        }
        return object instanceof File;
    }
    transform(
        object: File
    ): Promise<TransformedData<[ArrayBuffer, string, FilePropertyBag]>> {
        return object.arrayBuffer().then(buffer => {
            return {
                $: Tags.File,
                _: [
                    buffer,
                    object.name,
                    {
                        type: object.type
                    }
                ]
            };
        });
    }
    revive(
        data: TransformedData<[ArrayBuffer, string, FilePropertyBag]>
    ): File {
        return new File([data._[0]], data._[1], data._[2]);
    }
}
