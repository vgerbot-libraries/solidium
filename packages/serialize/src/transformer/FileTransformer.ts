import { Serializable } from '../core/Serializable';
import { Tags } from '../core/Tags';
import { Transformer } from '../core/Transformer';

export class FileTransformer
    implements
        Transformer<File, [Tags.File, Serializable, [string, FilePropertyBag]]>
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
    encode(
        object: File
    ): Promise<[Tags.File, Serializable, [string, FilePropertyBag]]> {
        return object.arrayBuffer().then(buffer => {
            return [
                Tags.File,
                buffer,
                [
                    object.name,
                    {
                        type: object.type
                    }
                ]
            ];
        });
    }
    decode(data: [Tags.File, Serializable, [string, FilePropertyBag]]): File {
        return new File([data[1] as BlobPart], data[2][0], data[2][1]);
    }
}
