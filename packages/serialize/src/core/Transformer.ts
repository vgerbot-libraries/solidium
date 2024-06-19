import { Serializable } from './Serializable';

export interface Transformer<
    Target,
    Tag extends number,
    Data extends Target | [Tag, Serializable] | [Tag, Serializable, unknown] =
        | [Tag, Serializable]
        | [Tag, Serializable, unknown]
> {
    getTag(): Tag;
    toSerializable(object: Target): Promise<Data>;
    fromSerializable(data: Data): Promise<Target>;
}
export function transformer<
    Target,
    Tag extends number = number,
    Data extends Target | [Tag, Serializable] | [Tag, Serializable, unknown] =
        | [Tag, Serializable]
        | [Tag, Serializable, unknown]
>(tag: Tag) {
    abstract class AbstractTransformer
        implements Transformer<Target, Tag, Data>
    {
        getTag(): Tag {
            return tag;
        }
        abstract toSerializable(object: Target): Promise<Data>;
        abstract fromSerializable(data: Data): Promise<Target>;
    }
    return AbstractTransformer;
}
