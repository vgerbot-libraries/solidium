import { EmptyEntity } from '../entity/EmptyEntity';
import { FormDataEntity } from '../entity/FormDataEntity';
import { JSONEntity } from '../entity/JSONEntity';
import { OctetStreamEntity } from '../entity/OctetStreamEntity';
import { PlainTextEntity } from '../entity/PlainTextEntity';
import { URLSearchParamsEntity } from '../entity/URLSearchParamEntity';
import { HttpEntity } from '../types/HttpEntity';
import { JSONType } from '../types/JSONType';
import { isArrayBufferView } from './isArrayBufferView';
import { isHttpEntity } from './isHttpEntity';
import { isJSON } from './isJSON';

export function createEntity(
    data: undefined | HttpEntity | BodyInit | JSONType
) {
    if (data === undefined) {
        return new EmptyEntity();
    }
    if (isJSON(data)) {
        const json = JSON.stringify(data);
        return new JSONEntity(() => Promise.resolve(json));
    }
    if (isHttpEntity(data)) {
        return data;
    }
    if (isArrayBufferView(data) || data instanceof ArrayBuffer) {
        return new OctetStreamEntity(
            () => Promise.resolve(new Blob([data])),
            data.byteLength
        );
    }
    if (data instanceof Blob) {
        return new OctetStreamEntity(() => Promise.resolve(data), data.size);
    }
    if (data instanceof FormData) {
        return new FormDataEntity(data);
    }
    if (data instanceof URLSearchParams) {
        return new URLSearchParamsEntity(data);
    }
    if (data instanceof ReadableStream) {
        return new OctetStreamEntity(() => Promise.resolve(data), -1);
    }
    return new PlainTextEntity(data + '');
}
