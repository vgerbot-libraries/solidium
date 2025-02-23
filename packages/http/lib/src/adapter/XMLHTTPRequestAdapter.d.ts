import { AdapterOptions } from './AdapterOptions';
import { RequestAdapter } from './RequestAdapter';
import { ProgressHandler } from '../progress/ProgressHandler';
import { AdapterExecutionResult } from './AdapterExecutionResult';
export declare class XMLHttpRequestAdapter implements RequestAdapter {
    private readonly xhr;
    private executeRequestIfNeed;
    private readonly events;
    private readonly headersDefer;
    private readonly bodyDefer;
    private isAborted;
    constructor(options: AdapterOptions);
    abort(): void;
    onDownload(listener: ProgressHandler): () => void;
    onUpload(listener: ProgressHandler): () => void;
    execute(): Promise<AdapterExecutionResult>;
}
