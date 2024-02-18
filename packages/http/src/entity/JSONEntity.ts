import { lazyMember } from '@vgerbot/lazy';
import { CharsetEnum } from '../types/Charset';
import { ContentType } from '../types/ContentType';
import { HttpEntity } from '../types/HttpEntity';
import { MediaTypeEnum } from '../types/MediaType';

export class JSONEntity implements HttpEntity {
    @lazyMember(function (this: JSONEntity) {
        return this._getJson();
    })
    private jsonPromise!: Promise<string>;
    @lazyMember(async function (this: JSONEntity) {
        const json = await this.jsonPromise;
        return JSON.parse(json);
    })
    private jsonObjectPromise!: Promise<unknown>;

    constructor(private _getJson: () => Promise<string>) {}
    contentType(): ContentType {
        return ContentType.from(
            MediaTypeEnum.APPLICATION_JSON,
            CharsetEnum.UTF_8
        );
    }
    async data(): Promise<Blob> {
        const json = await this.jsonPromise;
        return new Blob([json], {
            type: MediaTypeEnum.APPLICATION_JSON
        });
    }
    async parsed<T>(): Promise<T> {
        const obj = await this.jsonObjectPromise;
        return obj as T;
    }
    size(): number {
        throw new Error('Method not implemented.');
    }
    clone(): HttpEntity {
        return new JSONEntity(this._getJson);
    }
}
