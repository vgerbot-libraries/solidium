import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/TransformContext';
import { Transformer } from '../core/Transformer';
import { ReviveContext } from '../core/ReviveContext';
export declare class ArrayTransformer implements Transformer<unknown[], unknown[]> {
    getTag(): number;
    accept(object: unknown[]): boolean;
    pretransform?(object: unknown[], context: EncodeContext, path: ObjectPath): void;
    transform(object: unknown[], context: EncodeContext, path: ObjectPath): Promise<unknown[]>;
    revive(transformedData: unknown[], context: ReviveContext, path: ObjectPath): unknown[];
}
