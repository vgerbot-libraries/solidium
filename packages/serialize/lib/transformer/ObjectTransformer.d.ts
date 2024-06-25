import { ObjectPath } from '../core/ObjectPath';
import { EncodeContext } from '../core/TransformContext';
import { Transformer } from '../core/Transformer';
import { ReviveContext } from '../core/ReviveContext';
export declare class ObjectTransformer implements Transformer<Record<string, unknown>, Record<string, unknown>> {
    getTag(): number;
    accept(object: Object): boolean;
    pretransform(object: Object, context: EncodeContext, path: ObjectPath): void;
    transform(object: Record<string, unknown>, context: EncodeContext, path: ObjectPath): Promise<Record<string, unknown>>;
    revive(data: Record<string, unknown>, context: ReviveContext, path: ObjectPath): Record<string, unknown>;
}
