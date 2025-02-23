import { ExecuteRequestMethodParams } from '../core/ExecuteRequestParams';

export function cloneParams(
    params: ExecuteRequestMethodParams
): ExecuteRequestMethodParams {
    return {
        signal: params.signal,
        headers: params.headers.clone(),
        pathVariables: { ...params.pathVariables },
        queryParams: { ...params.queryParams },
        payload: clonePayload(params.payload),
        adapter: params.adapter
    };
}
function clonePayload(
    payload: ExecuteRequestMethodParams['payload']
): ExecuteRequestMethodParams['payload'] {
    if (payload instanceof FormData) {
        const formdata = new FormData();
        payload.forEach((value, key) => {
            formdata.append(key, value);
        });
    }
    return payload;
}
