import { Signal } from 'solid-js';
export declare class SignalMap {
    private readonly store;
    get(object: Object, key: string | number | symbol, initValue?: unknown): Signal<unknown>;
    delete(object: Object, key: string | number | symbol): void;
}
