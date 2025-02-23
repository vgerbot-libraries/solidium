import { HttpSource } from '../http/HttpSource';
export interface AdapterExecutionResult extends HttpSource {
    status: number;
}
