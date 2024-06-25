import { Tags } from '../core/Tags';
import { TransformedData, Transformer } from '../core/Transformer';

export class UndefinedTransformer
    implements Transformer<undefined, TransformedData<null>>
{
    getTag(): number {
        return Tags.Undefined;
    }
    accept(object: undefined): boolean {
        return object === undefined;
    }
    transform(): TransformedData<null> {
        return {
            $: Tags.Undefined,
            _: null
        };
    }
    revive(): Promise<undefined> | undefined {
        return;
    }
}
