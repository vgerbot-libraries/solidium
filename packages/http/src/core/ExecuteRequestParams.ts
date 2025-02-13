import { HttpHeaders } from '../http/HttpHeaders';

export class ExecuteRequestMethodParams {
    constructor(
        public readonly pathParams: Map<string, string | number | boolean>,
        public readonly queryParams: Map<string, string | number | boolean>,
        public readonly headers: HttpHeaders,
        public readonly signal: AbortSignal,
        public readonly payload?: string | Blob | FormData
    ) {}
}
