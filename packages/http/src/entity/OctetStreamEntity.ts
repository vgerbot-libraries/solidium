import { lazyMember } from '@vgerbot/lazy';
import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';

export class OctetStreamEntity implements HttpEntity {
    @lazyMember((instance: OctetStreamEntity) => {
        return instance._getData();
    })
    private dataPromise!: Promise<Blob | ReadableStream>;
    constructor(
        private _getData: () => Promise<Blob | ReadableStream>,
        private _size: number
    ) {}
    contentType(): ContentType {
        return ContentType.from('application/octet-stream');
    }
    data(): Promise<Blob | ReadableStream> {
        return this.dataPromise;
    }
    size(): number {
        return this._size;
    }
    clone(): HttpEntity {
        return new OctetStreamEntity(this._getData, this._size);
    }
}
