import { isURL } from '../common/isURL';
import { HttpMethod } from '../http/HttpMethod';
import { InvokeRequestMethodParams } from './ExecuteRequestParams';
import { RequestEndpoint } from './RequestEndPoint';

export class RequestMethod {
    constructor(
        public readonly endpoint: RequestEndpoint,
        public readonly method: HttpMethod,
        pathOrURL: string
    ) {
        if (isURL(pathOrURL)) {
        } else {
        }
    }

    invoke(params: InvokeRequestMethodParams) {
        //
    }
}
