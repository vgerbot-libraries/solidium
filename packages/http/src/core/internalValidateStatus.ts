import { HttpResponse } from '../types/HttpResponse';

export async function internalValidateStatus(response: HttpResponse) {
    return response.status < 400;
}
