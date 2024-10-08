import { ObjectPath } from '../core/ObjectPath';
import { IterableMapper } from './IterableMapper';
type TransformedSet = {
    $: 1;
    _: unknown[];
};
export declare class SetMapper extends IterableMapper<Set<unknown>, TransformedSet> {
    createTransformedResult(resultArray: unknown[]): TransformedSet;
    forEachTransformedResult(target: TransformedSet, path: ObjectPath, callback: (item: unknown, childPath: ObjectPath) => void): void;
    canRevive(object: TransformedSet): boolean;
    append(target: Set<unknown>, value: unknown): void;
    canTransform(object: unknown): boolean;
    createNewInstance(): Set<unknown>;
}
export {};
