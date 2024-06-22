import { ObjectTransformer } from './ObjectTransformer';
import { BlobTransformer } from './BlobTransformer';
import { FileTransformer } from './FileTransformer';
import { PrimaryTransformer } from './PrimaryTransformer';
import { ArrayTransformer } from './ArrayTransformer';

import { Transformer } from '../core/Transformer';
import { ReferenceTransformer } from './ReferanceTransformer';

const transformers: Array<Transformer<unknown, unknown>> = [];

export function registerTransformer(
    transformer: Transformer<unknown, unknown>
) {
    if (transformers.indexOf(transformer) > -1) {
        return;
    }
    transformers.push(transformer);
}

export function transformerOfObject(object: unknown) {
    const transformer = transformers.find(it => it.accept(object));
    return transformer;
}
export function transformerOfTag(tag: number) {
    const transformer = transformers.find(it => it.getTag() === tag);
    return transformer;
}

registerTransformer(new ObjectTransformer());
registerTransformer(new BlobTransformer());
registerTransformer(new FileTransformer());
registerTransformer(new PrimaryTransformer());
registerTransformer(new ArrayTransformer());
registerTransformer(new ReferenceTransformer());
