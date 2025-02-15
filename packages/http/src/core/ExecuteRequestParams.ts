import { HttpHeaders } from '../http/HttpHeaders';

export class ExecuteRequestMethodParams {
    constructor(
        public readonly signal: AbortSignal,
        public readonly headers: HttpHeaders,
        public readonly pathVariables?: Record<string, string | number | boolean>,
        public readonly queryParams?: Record<string, string | number | boolean>,
        public readonly payload?: string | Blob | FormData
    ) {}
}
