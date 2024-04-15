import { HttpRequest } from '../types/HttpRequest';
import { HttpEvent } from './HttpEvent';

const EVENT_TYPE = Symbol('UPLOAD-PROGRESS');

export class UploadProgressEvent extends HttpEvent {
    readonly type = EVENT_TYPE;
    constructor(
        public readonly request: HttpRequest,
        public readonly totalBytes: number,
        public readonly uploadedBytes: number
    ) {
        super(request);
    }
}
