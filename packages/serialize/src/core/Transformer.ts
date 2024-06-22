import { ObjectPath } from './ObjectPath';
import { Serializable } from './Serializable';
import { EncodeContext } from './EncodeContext';

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
    preEncode?(Object: Target, context: EncodeContext, path: ObjectPath): void;
    encode(
        object: Target,
        context: EncodeContext,
        path: ObjectPath
    ): Data | Promise<Data>;
    decode(data: Data): Target | Promise<Target>;
}
