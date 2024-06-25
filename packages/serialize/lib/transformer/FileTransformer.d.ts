import { TransformedData, Transformer } from '../core/Transformer';
export declare class FileTransformer implements Transformer<File, TransformedData<[ArrayBuffer, string, FilePropertyBag]>> {
    getTag(): number;
    accept(object: File): boolean;
    transform(object: File): Promise<TransformedData<[ArrayBuffer, string, FilePropertyBag]>>;
    revive(data: TransformedData<[ArrayBuffer, string, FilePropertyBag]>): File;
}
