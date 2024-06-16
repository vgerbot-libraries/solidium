import { DataSerializer } from '../core/DataSerializer';

export class JSONSerializer implements DataSerializer {
    deserialize(data: Blob): unknown {
        throw new Error('Method not implemented.');
    }
    serialize(value: unknown): Promise<Blob> {
        throw new Error('Method not implemented.');
    }
}
