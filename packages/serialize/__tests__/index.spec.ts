import { serialize, deserialize } from '../src';

describe('serialize and deserialize', () => {
    it('should handle basic data types', async () => {
        const obj = {
            number: 123,
            string: 'test',
            boolean: true,
            null: null,
            undefined: undefined,
            array: [1, 2, 3],
            object: { a: 1, b: 2 }
        };
        const serialized = await serialize(obj);
        const deserialized = await deserialize(serialized);

        expect(deserialized).toEqual(obj);
    });
    it('should handle circular references', async () => {
        const obj: {
            a: number;
            self?: any;
        } = { a: 1 };
        obj.self = obj;

        const options = { circular: true };
        const serialized = await serialize(obj, options);
        const deserialized = (await deserialize(serialized)) as typeof obj;

        expect(deserialized.a).toBe(1);
        expect(deserialized.self).toBe(deserialized);
    });
});
