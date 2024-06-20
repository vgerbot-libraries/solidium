import { ObjectTransformer } from './ObjectTransformer';
import { BlobTransformer } from './BlobTransformer';
import { FileTransformer } from './FileTransformer';
import { PrimaryTransformer } from './PrimaryTransformer';
import { ArrayTransformer } from './ArrayTransformer';
import { registerTransformer } from '../core/TransformerRegistry';

registerTransformer(new ObjectTransformer());
registerTransformer(new BlobTransformer());
registerTransformer(new FileTransformer());
registerTransformer(new PrimaryTransformer());
registerTransformer(new ArrayTransformer());
