import { Transformer } from '../core/Transformer';
type Primary = null | number | string | boolean | Date | ArrayBuffer;
export declare class PrimaryTransformer implements Transformer<Primary, Primary> {
    getTag(): number;
    accept(object: Primary): boolean;
    transform(object: Primary): Primary;
    revive(data: Primary): Primary;
}
export {};
