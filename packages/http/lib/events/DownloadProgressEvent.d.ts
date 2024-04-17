import { HttpRequest } from '../types/HttpRequest';
import { HttpEvent } from './HttpEvent';
export declare class DownloadProgressEvent extends HttpEvent {
    readonly request: HttpRequest;
    readonly totalBytes: number;
    readonly uploadedBytes: number;
    readonly type = "downloadprogress";
    constructor(request: HttpRequest, totalBytes: number, uploadedBytes: number);
}
