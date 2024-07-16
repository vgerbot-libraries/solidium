import 'blob-polyfill';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as util from 'util';

function createMockStorage() {
    let storage: Record<string, string> = {};
    return {
        setItem: (key: string, value: string) => {
            storage[key] = value.toString();
        },
        getItem: (key: string | number) => storage[key],
        removeItem: (key: string | number) => {
            delete storage[key];
        },
        clear: () => {
            storage = {};
        },
        key: (index: number) => Object.keys(storage)[index],
        get length() {
            return Object.keys(storage).length;
        }
    };
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.localStorage = globalThis.sessionStorage = createMockStorage();

Object.defineProperties(globalThis, {
    TextEncoder: {
        value: util.TextEncoder
    },
    TextDecoder: {
        value: util.TextDecoder
    }
});
