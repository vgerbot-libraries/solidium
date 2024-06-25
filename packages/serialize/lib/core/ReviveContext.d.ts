import { ObjectPath } from './ObjectPath';
export declare class ReviveContext {
    private pathObjectMap;
    recording(object: unknown, path: ObjectPath): void;
    getObject(path: ObjectPath): unknown;
    reviverOf(object: unknown): import("./Transformer").Transformer<unknown, unknown> | undefined;
}
