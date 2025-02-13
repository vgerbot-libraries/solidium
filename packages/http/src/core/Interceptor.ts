import { HttpResponse } from './HttpResponse';
import { RequestMethod } from './RequestMethod';

export interface Interceptor {
    invoke(
        context: RequestMethod,
        next: (context: RequestMethod) => Promise<HttpResponse>
    ): Promise<HttpResponse>;
}
