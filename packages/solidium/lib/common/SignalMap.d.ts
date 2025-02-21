import { Signal } from 'solid-js';
export declare class SignalMap {
    private readonly store;
    get(object: object, key: string | number | symbol, initValue?: unknown): Signal<unknown>;
    delete(object: object, key: string | number | symbol): void;
}
