import { DataSerializer } from './DataSerializer';
import { encode, decode } from '@vgerbot/msgpack-ext';

export class DefaultSerializer implements DataSerializer {
    serialize(value: unknown): Promise<Blob> {
        const u8a = encode(value);
        return Promise.resolve(new Blob([u8a]));
    }
    async deserialize<T>(data: Blob): Promise<T> {
        const buffer = await data.arrayBuffer();
        return decode(buffer) as T;
    }
}
