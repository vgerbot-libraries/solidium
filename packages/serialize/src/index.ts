import { encode } from 'messagepack';
import { ObjectPath } from './core/ObjectPath';
import { SerializeContext } from './core/EncodeContext';
import './transformer';

export interface SerializeOptions {
    circular?: boolean;
}

export async function serialize(
    object: unknown,
    options: SerializeOptions = {
        circular: false
    }
) {
    const context = new SerializeContext();
    const path = new ObjectPath([]);
    const transformer = context.transformerOf(object, path);
    if (options.circular) {
        if (transformer.preEncode) {
            transformer.preEncode(object, context, path);
        }
    }
    const serializable = await transformer.encode(object, context, path);
    return encode(serializable);
}
