import { TransformedData, Transformer } from '../core/Transformer';
export declare class UndefinedTransformer implements Transformer<undefined, TransformedData<null>> {
    getTag(): number;
    accept(object: undefined): boolean;
    transform(): TransformedData<null>;
    revive(): Promise<undefined> | undefined;
}
