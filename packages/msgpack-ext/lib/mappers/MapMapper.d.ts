import { ObjectPath } from '../core/ObjectPath';
import { IterableMapper } from './IterableMapper';
type TransformedMap = {
    $: number;
    _: [unknown, unknown][];
};
export declare class MapMapper extends IterableMapper<Map<unknown, unknown>, TransformedMap> {
    canTransform(object: unknown): boolean;
    createNewInstance(): Map<unknown, unknown>;
    append(target: Map<unknown, unknown>, value: unknown[]): void;
    createTransformedResult(resultArray: unknown[]): TransformedMap;
    forEachTransformedResult(target: TransformedMap, path: ObjectPath, callback: (item: unknown, childPath: ObjectPath) => void): void;
    canRevive(object: TransformedMap): boolean;
}
export {};
