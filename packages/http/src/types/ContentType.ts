import { Charset } from './Charset';
import { Cloneable } from './Cloneable';
import { MediaType } from './MediaType';

export interface ContentType extends Cloneable<ContentType> {
    toString(): string;
    mediaType(): MediaType | string;
    charset(): Charset | string | undefined;
}
