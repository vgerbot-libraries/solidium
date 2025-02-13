import { isURL } from '../common/isURL';
import { HttpMethod } from '../http/HttpMethod';
import { ExecuteRequestMethodParams } from './ExecuteRequestParams';
import { RequestEndpoint } from './RequestEndpoint';

export class RequestMethod {
    private readonly url: string;
    constructor(
        public readonly endpoint: RequestEndpoint,
        public readonly method: HttpMethod,
        pathOrURL: string
    ) {
        if (isURL(pathOrURL)) {
            this.url = pathOrURL;
        } else {
            this.url = joinPath(this.endpoint.baseURL, pathOrURL);
        }
    }

    invoke(params: ExecuteRequestMethodParams) {
        //
    }
}
