import { Charset, CharsetEnum } from './Charset';
import { Cloneable } from './Cloneable';
import { MediaType } from './MediaType';

export class ContentType implements Cloneable<ContentType> {
    public static from(
        mediaType: MediaType | string,
        charset: Charset = CharsetEnum.UTF_8
    ) {
        return new ContentType(mediaType, charset);
    }
    public static none() {
        return ContentType.from('');
    }

    constructor(
        private readonly _mediaType: MediaType | string,
        private readonly _charset?: Charset | string
    ) {}
    clone(): ContentType {
        return new ContentType(this._mediaType, this._charset);
    }

    toString(): string {
        return this._mediaType + (this._charset ? ';' + this._charset : '');
    }
    mediaType(): MediaType | string {
        return this._mediaType;
    }
    charset(): Charset | string | undefined {
        return this._charset;
    }
    isNone() {
        return !this._mediaType;
    }
}
