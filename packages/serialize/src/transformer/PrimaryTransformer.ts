import { Tags } from '../core/Tags';
import { Transformer } from '../core/Transformer';

type Primary = null | number | string | boolean | Date;

export class PrimaryTransformer implements Transformer<Primary, Primary> {
    getTag(): number {
        return Tags.Primary;
    }
    accept(object: Primary): boolean {
        switch (typeof object) {
            case 'string':
            case 'number':
            case 'boolean':
                return true;
        }
        if (object instanceof Date || object === null) {
            return true;
        }
        return false;
    }
    encode(object: Primary): Promise<Primary> {
        return Promise.resolve(object);
    }
    decode(data: Primary): Promise<Primary> {
        return Promise.resolve(data);
    }
}
