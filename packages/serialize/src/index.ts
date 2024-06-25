import { decode, encode } from 'messagepack';
import { ObjectPath } from './core/ObjectPath';
import { EncodeContext } from './core/TransformContext';
import './transformer';
import { ReviveContext } from './core/ReviveContext';

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
    const transformer = context.transformerOf(object);
    if (options.circular) {
        if (transformer.pretransform) {
            transformer.pretransform(object, context, path);
        }
    }
    return Promise.resolve(transformer.transform(object, context, path)).then(
        serializable => {
            return encode(serializable);
        }
    );
}

export function deserialize(data: Uint8Array) {
    const context = new ReviveContext();
    const object = decode(data);
    const path = new ObjectPath([]);
    const reviver = context.reviverOf(object);
    if (!reviver) {
        return object;
    }
    return reviver.revive(object, context, path);
}
