import { ProgressHandler } from '../progress/ProgressHandler';
import { AdapterExecutionResult } from './AdapterExecutionResult';
import { AdapterOptions } from './AdapterOptions';
import { RequestAdapter } from './RequestAdapter';
export declare class FetchRequestAdapter implements RequestAdapter {
    private executeRequestIfNeed;
    private readonly events;
    private readonly headersDefer;
    private readonly bodyDefer;
    private status;
    private readonly abortController;
    constructor(options: AdapterOptions);
    abort(): void;
    onDownload(listener: ProgressHandler): () => void;
    onUpload(_listener: ProgressHandler): () => void;
    execute(): Promise<AdapterExecutionResult>;
}
