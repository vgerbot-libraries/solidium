export interface StorageProvider {
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | undefined>;
    remove(key: string): Promise<void>;
}
export function isStorageProvider(obj: unknown): obj is StorageProvider {
    return (
        !!obj &&
        typeof obj === 'object' &&
        'set' in obj &&
        typeof obj.set === 'function' &&
        'get' in obj &&
        typeof obj.get === 'function' &&
        'remove' in obj &&
        typeof obj.remove === 'function'
    );
}
