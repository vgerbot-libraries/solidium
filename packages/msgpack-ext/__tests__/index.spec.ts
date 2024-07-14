import { decode, encode } from '../src';

describe('msgpack-ext', () => {
    describe('encode', () => {
        it('should correctly encode an empty Map', () => {
            const u8a = encode(new Map());
            expect(JSON.stringify(Array.from(u8a))).toMatchSnapshot();
        });
        it('should correctly encode a non-empty Map', () => {
            const u8a = encode(new Map([[1, 2]]));
            expect(JSON.stringify(Array.from(u8a))).toMatchSnapshot();
        });
        it('should correctly encode an empty Set', () => {
            const u8a = encode(new Set());
            expect(JSON.stringify(Array.from(u8a))).toMatchSnapshot();
        });
        it('should correctly encode a non-empty Set', () => {
            const u8a = encode(new Set([1, 2, '3', false]));
            expect(JSON.stringify(Array.from(u8a))).toMatchSnapshot();
        });
        it('should correctly encode a circular reference', () => {
            const object = {
                ref: null as unknown
            };
            object.ref = object;
            const u8a = encode(object);
            expect(JSON.stringify(Array.from(u8a))).toMatchSnapshot();
        });
        it('should correctly encode a circular reference inside Set/Map', () => {
            const set = new Set();
            set.add(set);
            const map = new Map([[set, set]]);
            const u8a = encode(map);
            expect(JSON.stringify(Array.from(u8a))).toMatchSnapshot();
        });
    });
    describe('decode', () => {
        it('should correctly decode an empty Map', () => {
            const emptyMap = new Map();
            const decodedMap = decode(encode(emptyMap)) as typeof emptyMap;
            expect(decodedMap).toBeInstanceOf(Map);
            expect(decodedMap.size).toBe(0);
        });
        it('should correctly decode a non-empty Map', () => {
            const emptyMap = new Map([
                [1, 2],
                [3, 4]
            ]);
            const decodedMap = decode(encode(emptyMap)) as typeof emptyMap;
            expect(decodedMap).toBeInstanceOf(Map);
            expect(decodedMap.size).toBe(2);
            expect(decodedMap.get(1)).toBe(2);
            expect(decodedMap.get(3)).toBe(4);
        });
        it('should correctly decode a circular reference', () => {
            const object = {
                ref: null as unknown
            };
            object.ref = object;
            const decodedObject = decode(encode(object)) as typeof object;
            expect(decodedObject.ref).toBe(decodedObject);
        });
        it('should correctly dncode a circular reference inside Set/Map', () => {
            const set = new Set();
            set.add(set);
            const map = new Map([[set, set]]);
            const u8a = encode(map);
            const decodedMap = decode(u8a) as typeof map;
            const entries = Array.from(decodedMap);
            expect(entries[0][0]).toBe(entries[0][1]);
            const decodedSet = entries[0][0];
            expect(Array.from(decodedSet)[0]).toBe(decodedSet);
        });
    });
});
