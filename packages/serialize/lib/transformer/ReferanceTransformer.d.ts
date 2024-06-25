import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/TransformContext';
import { TransformedData, Transformer } from '../core/Transformer';
import { ReviveContext } from '../core/ReviveContext';
export declare class ReferenceTransformer implements Transformer<unknown, TransformedData<string[]>> {
    getTag(): number;
    accept(): boolean;
    transform(object: unknown, context: EncodeContext, path: ObjectPath): TransformedData<string[]>;
    revive(data: TransformedData<string[]>, context: ReviveContext, path: ObjectPath): unknown;
}
