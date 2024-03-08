import { lazyMember } from '@vgerbot/lazy';
import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';

export class PlainTextEntity implements HttpEntity {
    @lazyMember((instance: PlainTextEntity) => {
        const encoder = new TextEncoder();
        const u8a = encoder.encode(instance._text);
        return new Blob([u8a], { type: instance.contentType().toString() });
    })
    private _data!: Blob;
    constructor(private readonly _text: string) {}
    contentType(): ContentType {
        return ContentType.from('text/plain');
    }
    data(): Promise<Blob> {
        return Promise.resolve(this._data);
    }
    size(): number {
        return this._data.size;
    }
    clone(): HttpEntity {
        return new PlainTextEntity(this._text);
    }
}
