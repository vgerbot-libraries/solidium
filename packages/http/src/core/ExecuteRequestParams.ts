import { HttpHeaders } from '../http/HttpHeaders';

export class InvokeRequestMethodParams {
    constructor(
        public readonly pathParams: Map<string, string | number | boolean>,
        public readonly queryParams: Map<string, string | number | boolean>,
        public readonly body: string | Blob | undefined,
        public readonly headers: HttpHeaders
    ) {}
}
