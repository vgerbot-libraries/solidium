import { DownloadProgressEvent } from './DownloadProgressEvent';
import { RequestEndEvent } from './RequestEndEvent';
import { RequestStartEvent } from './RequestStartEvent';
import { TimeoutEvent } from './TimeoutEvent';
import { UploadProgressEvent } from './UploadProgressEvent';

export interface HttpEventMap {
    start: RequestStartEvent;
    end: RequestEndEvent;
    uploadprogress: UploadProgressEvent;
    downloadprogress: DownloadProgressEvent;
    timeout: TimeoutEvent;
}
export type HttpEventType = keyof HttpEventMap;
