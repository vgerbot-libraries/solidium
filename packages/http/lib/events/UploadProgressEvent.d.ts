import { HttpRequest } from '../types/HttpRequest';
import { HttpEvent } from './HttpEvent';
export declare class UploadProgressEvent extends HttpEvent {
    readonly request: HttpRequest;
    readonly totalBytes: number;
    readonly uploadedBytes: number;
    readonly type = "uploadprogress";
    constructor(request: HttpRequest, totalBytes: number, uploadedBytes: number);
}
