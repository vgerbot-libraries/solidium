export type HttpBody =
    | Blob
    | BufferSource
    | FormData
    | URLSearchParams
    | string
    | ReadableStream;
