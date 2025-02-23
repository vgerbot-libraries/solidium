import { ProgressHandler } from '../progress/ProgressHandler';
import { AdapterExecutionResult } from './AdapterExecutionResult';
import { AdapterOptions } from './AdapterOptions';
export interface RequestAdapter {
    abort(): void;
    onDownload(listener: ProgressHandler): () => void;
    onUpload(listener: ProgressHandler): () => void;
    execute(): Promise<AdapterExecutionResult>;
}
export type RequestAdapterConstructor = new (options: AdapterOptions) => RequestAdapter;
