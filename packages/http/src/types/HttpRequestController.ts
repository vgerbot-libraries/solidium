import { HttpEvent } from '../events/HttpEvent';
import { HttpRequest } from './HttpRequest';

export interface HttpRequestController {
    dispatchEvent(event: HttpEvent): void;
    dispatchRequestStartEvent(request: HttpRequest): void;
    dispatchRequestEndEvent(request: HttpRequest): void;
    dispatchTimeoutEvent(request: HttpRequest): void;
    dispatchRequestErrorEvent(request: HttpRequest): void;
    dispatchUploadProgress(
        request: HttpRequest,
        totalBytes: number,
        uploadedBytes: number
    ): void;
    dispatchDownloadProgress(
        request: HttpRequest,
        totalBytes: number,
        downloadedBytes: number
    ): void;
}
