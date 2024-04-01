import { Charset } from './Charset';
import { Cloneable } from './Cloneable';
import { MediaType } from './MediaType';
export declare class ContentType implements Cloneable<ContentType> {
    private readonly _mediaType;
    private readonly _charset?;
    static from(mediaType: MediaType | string, charset?: Charset): ContentType;
    static none(): ContentType;
    constructor(_mediaType: MediaType | string, _charset?: string | undefined);
    clone(): ContentType;
    toString(): string;
    mediaType(): MediaType | string;
    charset(): Charset | string | undefined;
    isNone(): boolean;
}
