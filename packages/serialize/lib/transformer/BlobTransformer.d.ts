import { TransformedData, Transformer } from '../core/Transformer';
export declare class BlobTransformer implements Transformer<Blob, TransformedData<[ArrayBuffer, BlobPropertyBag]>> {
    getTag(): number;
    accept(object: Blob): boolean;
    transform(object: Blob): Promise<TransformedData<[ArrayBuffer, BlobPropertyBag]>>;
    revive(data: TransformedData<[ArrayBuffer, BlobPropertyBag]>): Blob;
}
