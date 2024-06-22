import { decode, encode } from 'messagepack';
import { ObjectPath } from './core/ObjectPath';
import { EncodeContext } from './core/EncodeContext';
import './transformer';
import { DecodeContext } from './core/DecodeContext';

export interface SerializeOptions {
    circular?: boolean;
}

export function serialize(
    object: unknown,
    options: SerializeOptions = {
        circular: false
    }
): Promise<Uint8Array> {
    const context = new EncodeContext();
    const path = new ObjectPath([]);
    const transformer = context.transformerOf(object, path);
    if (options.circular) {
        if (transformer.preEncode) {
            transformer.preEncode(object, context, path);
        }
    }
    return Promise.resolve(transformer.encode(object, context, path)).then(
        serializable => {
            return encode(serializable);
        }
    );
}

export function deserialize(data: Uint8Array) {
    const context = new DecodeContext();
    const object = decode(data);
    const path = new ObjectPath([]);
    const transformer = context.transformerOf(object);
    if (!transformer) {
        return object;
    }
    return transformer.decode(object, context, path);
}
