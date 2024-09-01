export default class LRUCache<K, V> {
    private lookup;
    private reverseLookup;
    private capacity;
    private length;
    private head?;
    private tail?;
    constructor(capacity?: number);
    /** if the value is an object this returns a direct reference */
    get(key: K): V | undefined;
    set(key: K, value: V): void;
    delete(key: K): void;
    keys(): K[];
    private trimCache;
    private detach;
    private prepend;
}
