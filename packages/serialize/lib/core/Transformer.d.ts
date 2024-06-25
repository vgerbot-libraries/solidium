import { ObjectPath } from './ObjectPath';
import { EncodeContext } from './TransformContext';
import { ReviveContext } from './ReviveContext';
export interface TransformedData<D = unknown> {
    $: number;
    _: D;
}
export interface Transformer<Target, Data extends Target | TransformedData = TransformedData> {
    getTag(): number;
    accept(object: Target): boolean;
    pretransform?(Object: Target, context: EncodeContext, path: ObjectPath): void;
    transform(object: Target, context: EncodeContext, path: ObjectPath): Data | Promise<Data>;
    revive(data: Data, context: ReviveContext, path: ObjectPath): Target | Promise<Target>;
}
