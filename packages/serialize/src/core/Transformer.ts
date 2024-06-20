import { ObjectPath } from './ObjectPath';
import { Serializable } from './Serializable';
import { SerializeContext } from './EncodeContext';

export interface Transformer<
    Target,
    Data extends
        | Target
        | [number, Serializable]
        | [number, Serializable, unknown] =
        | [number, Serializable]
        | [number, Serializable, unknown]
> {
    getTag(): number;
    accept(object: Target): boolean;
    preEncode?(
        Object: Target,
        context: SerializeContext,
        path: ObjectPath
    ): void;
    encode(
        object: Target,
        context: SerializeContext,
        path: ObjectPath
    ): Promise<Data>;
    decode(data: Data): Promise<Target>;
}
