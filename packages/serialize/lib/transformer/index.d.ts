import { TransformedData, Transformer } from '../core/Transformer';
export declare function registerTransformer(transformer: Transformer<unknown, unknown>): void;
export declare function transformerOfObject(object: unknown): Transformer<unknown, unknown> | undefined;
export declare function transformerOfTag(tag: number): Transformer<unknown, unknown> | undefined;
export declare function isTransformedObject(obj: unknown): obj is TransformedData<unknown>;
