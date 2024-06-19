import { Serializable } from '../core/Serializable';
import { Tags } from '../core/Tags';
import { transformer } from '../core/Transformer';

export class FileTransformer extends transformer<File>(Tags.File) {
    toSerializable(
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
    fromSerializable(
        data: [Tags.File, Serializable, [string, FilePropertyBag]]
    ): Promise<File> {
        return Promise.resolve(
            new File([data[1] as BlobPart], data[2][0], data[2][1])
        );
    }
}
