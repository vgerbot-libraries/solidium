import { HttpRequest } from '../types/HttpRequest';
import { HttpEvent } from './HttpEvent';

export class DownloadProgressEvent extends HttpEvent {
    readonly type = 'downloadprogress';
    constructor(
        public readonly request: HttpRequest,
        public readonly totalBytes: number,
        public readonly uploadedBytes: number
    ) {
        super(request);
    }
}
