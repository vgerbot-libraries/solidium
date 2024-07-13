import { EncodeContext } from '../context/EncodeContext';
import { ObjectPath } from '../core/ObjectPath';
import { ObjectMapper } from '../core/ObjectMapper';
import { Reference } from '../types/Reference';
import { DecodeContext } from '../context/DecodeContext';
export type TransformedIterable<Tag extends number = number> = {
    $: Tag;
    _: unknown[];
};
export declare abstract class IterableMapper<T extends Iterable<unknown>, R> implements ObjectMapper<T, R> {
    abstract canTransform(object: T): boolean;
    abstract createNewInstance(origin?: T): T;
    abstract append(target: T, value: unknown): void;
    abstract createTransformedResult(resultArray: unknown[]): R;
    abstract forEachTransformedResult(target: R, path: ObjectPath, callback: (item: unknown, childPath: ObjectPath) => void): void;
    transform(object: T, context: EncodeContext, path: ObjectPath): R | Reference;
    abstract canRevive(object: R): boolean;
    revive(object: R, context: DecodeContext, path: ObjectPath): T;
}
