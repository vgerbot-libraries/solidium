import { ObjectPath } from '../core/ObjectPath';
import { IterableMapper } from './IterableMapper';
export declare class ArrayMapper extends IterableMapper<unknown[], unknown[]> {
    createTransformedResult(resultArray: unknown[]): unknown[];
    forEachTransformedResult(target: unknown[], path: ObjectPath, callback: (item: unknown, path: ObjectPath) => void): void;
    canRevive(object: unknown[]): boolean;
    canTransform(object: unknown[]): boolean;
    createNewInstance(origin?: unknown[] | undefined): unknown[];
    append(target: unknown[], value: unknown): void;
}
