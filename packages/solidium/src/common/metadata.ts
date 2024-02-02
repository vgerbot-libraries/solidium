const extraDatas = new WeakMap<Object, Map<unknown, Map<unknown, unknown>>>();
export function extraDataOf<T extends Object>(target: T, key: unknown) {
    if (!target || typeof target !== 'object') {
        return undefined;
    }
    if (!extraDatas.has(target)) {
        extraDatas.set(target, new Map());
    }
    const metadata = extraDatas.get(target);
    if (!metadata) {
        throw new Error('Will never happen');
    }
    if (!metadata.has(key)) {
        metadata.set(key, new Map());
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return metadata.get(key)!;
}
