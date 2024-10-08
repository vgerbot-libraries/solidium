import { ObjectPath } from '../core/ObjectPath';
import { IterableMapper } from './IterableMapper';

export class ArrayMapper extends IterableMapper<unknown[], unknown[]> {
    createTransformedResult(resultArray: unknown[]): unknown[] {
        return resultArray;
    }
    forEachTransformedResult(
        target: unknown[],
        path: ObjectPath,
        callback: (item: unknown, path: ObjectPath) => void
    ): void {
        target.forEach((item, index) => {
            callback(item, path.child(index));
        });
    }
    canRevive(object: unknown): boolean {
        return Array.isArray(object);
    }
    canTransform(object: unknown): boolean {
        return Array.isArray(object);
    }
    createNewInstance(): unknown[] {
        return [];
    }
    append(target: unknown[], value: unknown): void {
        target.push(value);
    }
}
