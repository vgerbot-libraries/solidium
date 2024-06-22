import { encode } from 'messagepack';
import { ObjectPath } from './core/ObjectPath';
import { EncodeContext } from './core/EncodeContext';
import './transformer';

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
