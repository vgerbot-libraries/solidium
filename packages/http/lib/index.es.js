import { Generate } from '@vgerbot/ioc';

function isInterceptorFunction(value) {
  return typeof value === 'function' && typeof value.prototype['invoke'] !== 'function';
}
function isInterceptorConstructor(value) {
  return typeof value === 'function' && typeof value.prototype['invoke'] === 'function';
}
function isInterceptor(value) {
  return typeof value === 'object' && !!value && 'invoke' in value && typeof value['invoke'] === 'function';
}

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = undefined;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
    function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
    function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class HttpResponse {
  constructor(source, init) {
    this.source = source;
    this.status = init.status;
  }
  headers() {
    return this.source.headers();
  }
  body() {
    return this.source.body();
  }
  text(encoding) {
    return __awaiter(this, undefined, undefined, function* () {
      const stream = yield this.body();
      const buffer = yield stream.readAsBuffer();
      const decoder = new TextDecoder(encoding);
      return decoder.decode(buffer);
    });
  }
  json() {
    return __awaiter(this, undefined, undefined, function* () {
      const text = yield this.text();
      return JSON.parse(text);
    });
  }
  textStream() {
    return __asyncGenerator(this, arguments, function* textStream_1(encoding = 'UTF-8') {
      const byteStream = yield __await(this.source.body());
      const stream = byteStream.readAsStream();
      const reader = stream.getReader();
      const decoder = new TextDecoder(encoding);
      while (true) {
        const {
          done,
          value
        } = yield __await(reader.read());
        if (done) {
          break;
        }
        yield yield __await(decoder.decode(value, {}));
      }
    });
  }
  jsonStream() {
    return __asyncGenerator(this, arguments, function* jsonStream_1(encoding = 'UTF-8') {
      var _a, e_1, _b, _c;
      try {
        for (var _d = true, _e = __asyncValues(this.textStream(encoding)), _f; _f = yield __await(_e.next()), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const chunk = _c;
          const json = chunk.replace(/^data:\s+/, '');
          yield yield __await(JSON.parse(json));
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (!_d && !_a && (_b = _e.return)) yield __await(_b.call(_e));
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    });
  }
}

var _a, _b;
var PromiseStatus;
(function (PromiseStatus) {
  PromiseStatus["PENDING"] = "pending";
  PromiseStatus["FULFILLED"] = "fulfilled";
  PromiseStatus["REJECTED"] = "rejected";
})(PromiseStatus || (PromiseStatus = {}));
const STATUS = Symbol('status');
const FULFILLED_VALUE = Symbol('fullfilled-value');
const REJECTED_REASON = Symbol('rejected-reason');
const ABORT_CONTROLLER = Symbol('abort-controller');
class Defer {
  static resolve(value) {
    const defer = new Defer();
    defer.resolve(value);
    return defer;
  }
  static reject(reason) {
    const defer = new Defer();
    defer.reject(reason);
    return defer;
  }
  static fromArray(array, mapfn) {
    const defer = new Defer();
    if (typeof mapfn !== 'function') {
      Promise.all(Array.from(array)).then(defer.resolve, defer.reject);
    } else {
      Promise.all(Array.from(array, value => {
        if (defer.isCancelled) {
          return Promise.reject(defer.rejectedReason);
        }
        return mapfn(value);
      })).then(defer.resolve, defer.reject);
    }
    return defer;
  }
  // static all<T extends readonly unknown[]>(values: T, mapfn?: (value: T[keyof T]) => Promise<unknown>) {
  //     const defer = new Defer<{
  //         -readonly [P in keyof T]: Awaited<T[P]>;
  //     }>();
  //     return defer;
  // }
  static serial(array) {
    const defer = new Defer();
    Array.from(array).reduce((acc, item) => __awaiter(this, undefined, undefined, function* () {
      yield acc;
      if (defer.isCancelled) {
        return;
      }
      yield item();
    }), Promise.resolve()).then(defer.resolve, defer.reject);
    return defer.promise;
  }
  get status() {
    return this[STATUS];
  }
  get isSettled() {
    return this.status !== PromiseStatus.PENDING;
  }
  get fullfilledValue() {
    return this[FULFILLED_VALUE];
  }
  get rejectedReason() {
    return this[REJECTED_REASON];
  }
  get isCancelled() {
    return this[REJECTED_REASON] instanceof CancellationError;
  }
  get signal() {
    return this[ABORT_CONTROLLER].signal;
  }
  constructor() {
    this[_a] = PromiseStatus.PENDING;
    this[_b] = new AbortController();
    let _resolve;
    let _reject;
    const doResolve = value => {
      this[FULFILLED_VALUE] = value;
      this[STATUS] = PromiseStatus.FULFILLED;
      _resolve(value);
    };
    this.resolve = value => {
      if (this.isSettled) {
        return;
      }
      if (isPromiseLike(value)) {
        value.then(doResolve);
      } else {
        doResolve(value);
      }
    };
    this.reject = reason => {
      if (this.isSettled) {
        return;
      }
      this[REJECTED_REASON] = reason;
      this[STATUS] = PromiseStatus.REJECTED;
      _reject(reason);
    };
    this.promise = new Promise((resolve, reject) => {
      _resolve = resolve;
      _reject = reject;
    });
  }
  abort(message) {
    this[ABORT_CONTROLLER].abort();
    this.reject(new CancellationError(message));
  }
  invokeOnCompletion(completionHandler) {
    if (this.isSettled) {
      completionHandler.call(this, this[REJECTED_REASON]);
      return noop;
    }
    let disposed = false;
    this.promise.finally(() => {
      if (disposed) {
        return;
      }
      completionHandler.call(this, this[REJECTED_REASON]);
    });
    return () => {
      disposed = true;
    };
  }
}
_a = STATUS, _b = ABORT_CONTROLLER;
class CancellationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CancellationError';
  }
}
function isPromiseLike(value) {
  return value != null && typeof value === 'object' && typeof value.then === 'function';
}
function noop() {}

class Events {
  constructor() {
    this.listeners = new Map();
  }
  on(event, listener) {
    var _a;
    const wrappedListener = (...args) => {
      listener(...args);
    };
    const listeners = (_a = this.listeners.get(event)) !== null && _a !== undefined ? _a : new Set();
    listeners.add(wrappedListener);
    if (!this.listeners.has(event)) {
      this.listeners.set(event, listeners);
    }
    return () => {
      const listeners = this.listeners.get(event);
      if (listeners) {
        listeners.delete(wrappedListener);
      }
    };
  }
  emit(event, ...args) {
    var _a;
    (_a = this.listeners.get(event)) === null || _a === undefined ? undefined : _a.forEach(listener => {
      listener(...args);
    });
  }
}

class HttpHeaders {
  constructor(init) {
    this.headers = new Map();
    if (init) {
      this.setAll(init);
    }
  }
  set(name, ...values) {
    this.headers.set(name, values);
  }
  setAll(headers) {
    if (headers instanceof Headers) {
      headers.forEach((value, name) => {
        this.set(name, value);
      });
    } else if (headers instanceof Map) {
      headers.forEach((value, key) => {
        if (Array.isArray(value)) {
          this.set(key, ...value);
        } else {
          this.set(key, value);
        }
      });
    } else {
      for (const key in headers) {
        const value = headers[key];
        if (Array.isArray(value)) {
          this.set(key, ...value);
        } else {
          this.set(key, value);
        }
      }
    }
  }
  append(name, ...values) {
    var _a;
    const originValues = (_a = this.headers.get(name)) !== null && _a !== undefined ? _a : [];
    const newValues = originValues.concat(values);
    this.headers.set(name, newValues);
  }
  get(name) {
    return this.headers.get(name);
  }
  delete(name) {
    this.headers.delete(name);
  }
  has(name) {
    return this.headers.has(name);
  }
  concat(other) {
    const result = new HttpHeaders(this.headers);
    other.forEach((key, value) => {
      result.set(key, ...value);
    });
    return result;
  }
  forEach(callback) {
    this.headers.forEach((value, key) => {
      callback(key, value);
    });
  }
  toNative() {
    const result = new Headers();
    this.forEach((key, value) => {
      result.append(key, value.join(', '));
    });
    return result;
  }
  [Symbol.iterator]() {
    return this.headers[Symbol.iterator]();
  }
  [Symbol.toStringTag]() {
    return 'HttpHeaders';
  }
  clone() {
    return new HttpHeaders(this.headers);
  }
  toJSON() {
    const result = {};
    this.headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
}

class Progress {
  constructor(total, loaded, chunk) {
    this.total = total;
    this.loaded = loaded;
    this.chunk = chunk;
  }
}

class ProgressiveByteStream {
  constructor() {
    this.events = new Events();
  }
  onProgress(handler) {
    return this.events.on('progress', handler);
  }
  updateProgress(progress) {
    this.events.emit('progress', progress);
  }
}

class NativeReadableStream extends ProgressiveByteStream {
  constructor(contentLength, stream) {
    super();
    this.contentLength = contentLength;
    this.stream = stream;
  }
  total() {
    return Promise.resolve(this.contentLength);
  }
  readAsBuffer() {
    return __awaiter(this, undefined, undefined, function* () {
      const reader = this.readAsStream().getReader();
      const chunks = [];
      while (true) {
        const {
          done,
          value
        } = yield reader.read();
        if (done) {
          break;
        }
        chunks.push(new Uint8Array(value));
      }
      const realTotal = chunks.reduce((sum, it) => sum + it.byteLength, 0);
      const result = new Uint8Array(realTotal);
      {
        let offset = 0;
        for (const chunk of chunks) {
          result.set(chunk, offset);
          offset += chunk.byteLength;
        }
      }
      return result.buffer;
    });
  }
  readAsStream() {
    const stream = this.stream;
    const total = this.contentLength;
    let loaded = 0;
    const that = this;
    return new ReadableStream({
      start(controller) {
        that.updateProgress(new Progress(total, 0));
        const reader = stream.getReader();
        reader.read().then(function process({
          done,
          value
        }) {
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          loaded += value.byteLength;
          that.updateProgress(new Progress(total, loaded));
          reader.read().then(process);
        });
      }
    });
  }
}

class BlobByteStream extends NativeReadableStream {
  constructor(blob) {
    super(blob.size, blob.stream());
  }
}

const IGNORE_DUPLICATE_OF = new Set(['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent']);
function parseHeaders(rawHeaders) {
  const result = new Map();
  if (!(rawHeaders === null || rawHeaders === undefined ? undefined : rawHeaders.trim())) {
    return result;
  }
  rawHeaders.split(/[\r\n]+/).forEach(line => {
    var _a;
    const colonIndex = line.indexOf(':');
    const key = line.substring(0, colonIndex).trim().toLowerCase();
    const value = line.substring(colonIndex + 1).trim();
    if (!key || result.has(key) && IGNORE_DUPLICATE_OF.has(key)) {
      return;
    }
    const values = (_a = result.get(key)) !== null && _a !== undefined ? _a : [];
    values.push(value);
    result.set(key, values);
  });
  return result;
}

class XMLHttpRequestAdapter {
  constructor(options) {
    this.events = new Events();
    this.headersDefer = new Defer();
    this.bodyDefer = new Defer();
    this.isAborted = false;
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url);
    xhr.responseType = 'blob';
    options.headers.forEach((name, values) => {
      xhr.setRequestHeader(name, values.join(','));
    });
    xhr.addEventListener('progress', event => {
      if (!event.lengthComputable) {
        return;
      }
      this.events.emit('download', new Progress(event.total, event.loaded));
    });
    xhr.upload.addEventListener('progress', event => {
      if (!event.lengthComputable) {
        return;
      }
      this.events.emit('upload', new Progress(event.total, event.loaded));
    });
    this.executeRequestIfNeed = () => {
      this.executeRequestIfNeed = () => undefined;
      if (this.isAborted) {
        return;
      }
      if (options.payload) {
        xhr.send(options.payload);
      }
    };
    xhr.addEventListener('readystatechange', () => {
      if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
        const rawHeaders = xhr.getAllResponseHeaders();
        const headers = new HttpHeaders(parseHeaders(rawHeaders));
        this.headersDefer.resolve(headers);
      } else if (xhr.readyState === XMLHttpRequest.DONE) {
        this.bodyDefer.resolve(new BlobByteStream(xhr.response));
      }
    });
    this.xhr = xhr;
    if (options.signal.aborted) {
      this.isAborted = true;
      xhr.abort();
    } else {
      options.signal.addEventListener('abort', () => {
        this.isAborted = true;
        xhr.abort();
      });
    }
  }
  abort() {
    this.isAborted = true;
    this.xhr.abort();
  }
  onDownload(listener) {
    return this.events.on('download', listener);
  }
  onUpload(listener) {
    return this.events.on('upload', listener);
  }
  execute() {
    return __awaiter(this, undefined, undefined, function* () {
      this.executeRequestIfNeed();
      const {
        headersDefer,
        bodyDefer
      } = this;
      return {
        status: this.xhr.status,
        headers() {
          return headersDefer.promise;
        },
        body() {
          return bodyDefer.promise;
        }
      };
    });
  }
}

function isURL(text) {
  return /^\w+:\/\/\S+/.test(text);
}

function joinPath(...paths) {
  return paths.reduce((baseUrl, path) => {
    const cleanedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const cleanedPath = path.startsWith('/') ? path.slice(1) : path;
    return `${cleanedBaseUrl}/${cleanedPath}`;
  });
}

function mergeAbortSignal(...signals) {
  const controller = new AbortController();
  const mergedSignal = controller.signal;
  signals.filter(it => !!it).forEach(signal => {
    signal.addEventListener('abort', () => {
      controller.abort();
    });
  });
  return mergedSignal;
}

function resolveURL(routeTemplate, pathVariables, queryParameters) {
  const pathParamReplacedURL = routeTemplate.replace(/(:([a-z]+))/gi, (fullMatch, placeholder, variableName) => {
    var _a, _b;
    if (variableName in pathVariables) {
      return (_b = (_a = pathVariables[variableName]) === null || _a === undefined ? undefined : _a.toString()) !== null && _b !== undefined ? _b : fullMatch;
    }
    return fullMatch;
  });
  const urlObject = new URL(pathParamReplacedURL);
  for (const [paramKey, paramValue] of Object.entries(queryParameters)) {
    if (Array.isArray(paramValue)) {
      paramValue.forEach(arrayItem => {
        urlObject.searchParams.append(paramKey, arrayItem.toString());
      });
    } else {
      urlObject.searchParams.append(paramKey, paramValue.toString());
    }
  }
  return urlObject.toString();
}

class HttpError extends Error {
  constructor(message, status, code, context) {
    super(message);
    this.status = status;
    this.code = code;
    this.context = context;
    this.name = 'HttpError';
  }
}
class NetworkError extends HttpError {
  constructor(message, context = {}) {
    super(message, 0, 'NETWORK_ERROR', context);
    this.name = 'NetworkError';
  }
}
class TimeoutError extends HttpError {
  constructor(message, context = {}) {
    super(message, 408, 'REQUEST_TIMEOUT', context);
    this.name = 'TimeoutError';
  }
}
class ValidationError extends HttpError {
  constructor(message, context = {}) {
    super(message, 400, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
  }
}
class AuthenticationError extends HttpError {
  constructor(message, context = {}) {
    super(message, 401, 'AUTHENTICATION_ERROR', context);
    this.name = 'AuthenticationError';
  }
}
class ApiError extends HttpError {
  constructor(message, status, code, context = {}) {
    super(message, status, code, context);
    this.name = 'ApiError';
  }
}

class ErrorContextInterceptor {
  invoke(method, params, next) {
    return __awaiter(this, undefined, undefined, function* () {
      try {
        return yield next(method, params);
      } catch (error) {
        if (error instanceof HttpError) {
          // Enhance error context with request details
          error.context = Object.assign(Object.assign({}, error.context), {
            methodName: method.name.toString(),
            timestamp: new Date().toISOString(),
            headers: params.headers.toJSON(),
            pathVariables: params.pathVariables,
            queryParams: params.queryParams
          });
        }
        throw error;
      }
    });
  }
}

const DEFAULT_CONFIG$2 = {
  maxAttempts: 3,
  backoffFactor: 2,
  initialDelay: 1000,
  maxDelay: 10000,
  retryableStatuses: [408, 500, 502, 503, 504],
  retryable(error) {
    return __awaiter(this, undefined, undefined, function* () {
      if (error instanceof HttpError) {
        return this.retryableStatuses.includes(error.status);
      }
      return true;
    });
  }
};
class RetryInterceptor {
  constructor(config = {}) {
    this.config = Object.assign(Object.assign({}, DEFAULT_CONFIG$2), config);
  }
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  invoke(method, params, next) {
    return __awaiter(this, undefined, undefined, function* () {
      let attempt = 0;
      let delay = this.config.initialDelay;
      while (attempt < this.config.maxAttempts) {
        try {
          return yield next(method, params);
        } catch (error) {
          const retryable = yield this.config.retryable(error);
          if (!retryable) {
            throw error;
          }
          attempt++;
          if (attempt === this.config.maxAttempts) {
            throwMaxRetryAttempsReachedError(error);
          }
          yield this.delay(delay);
          delay = Math.min(delay * this.config.backoffFactor, this.config.maxDelay);
        }
      }
      // This should never be reached due to the throw above
      throw new Error('Unexpected retry loop exit');
      function throwMaxRetryAttempsReachedError(error) {
        throw new HttpError('Max retry attempts reached', error instanceof HttpError ? error.status : 0, 'MAX_RETRY_EXCEEDED', {
          attempts: attempt,
          originalError: error instanceof Error ? error.message : String(error)
        });
      }
    });
  }
}

const DEFAULT_CONFIG$1 = {
  timeout: 30000 // 30 seconds
};
class TimeoutInterceptor {
  constructor(config = {}) {
    this.config = Object.assign(Object.assign({}, DEFAULT_CONFIG$1), config);
  }
  invoke(method, params, next) {
    return __awaiter(this, undefined, undefined, function* () {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      try {
        // Merge the timeout signal with any existing signal
        const signal = mergeAbortSignal(params.signal, controller.signal);
        return yield Promise.race([next(method, Object.assign(Object.assign({}, params), {
          signal
        })), new Promise((_, reject) => setTimeout(() => reject(new TimeoutError(`Request timeout after ${this.config.timeout}ms`, {
          timeout: this.config.timeout,
          method: method.name.toString()
        })), this.config.timeout))]);
      } finally {
        clearTimeout(timeoutId);
      }
    });
  }
}

const METHODS = Symbol('endpoint-request-methods');
const INTERCEPTORS = Symbol('endpoint-interceptors');
const ADAPTER = Symbol('endpoint-adapter');
const CONSTRUCT_INTERCEPTORS = Symbol('endpoint-construct-interceptors');

class RequestMethod {
  constructor(name, endpointMetadata, metadata) {
    this.name = name;
    this.endpointMetadata = endpointMetadata;
    this.metadata = metadata;
    this.baseInterceptors = [];
    const pathOrURL = metadata.getPath();
    if (isURL(pathOrURL)) {
      this.url = pathOrURL;
    } else {
      this.url = joinPath(this.endpointMetadata.getBaseURL(), pathOrURL);
    }
    this.baseInterceptors.push(new ErrorContextInterceptor());
    const retryConfig = this.metadata.getRetryConfig();
    if (retryConfig) {
      this.baseInterceptors.push(new RetryInterceptor(retryConfig));
    }
  }
  invoke(instance, params) {
    const timeout = this.metadata.getTimeout() || this.endpointMetadata.getTimeout();
    const extInterceptors = [];
    if (timeout > 0) {
      extInterceptors.push(new TimeoutInterceptor({
        timeout
      }));
    } else if (timeout !== 0) {
      extInterceptors.push(new TimeoutInterceptor());
    }
    const endpointInterceptors = instance[INTERCEPTORS];
    const methodInterceptors = instance[CONSTRUCT_INTERCEPTORS](this.metadata.getInterceptors());
    const allInterceptors = [...this.baseInterceptors, ...extInterceptors, ...endpointInterceptors, ...methodInterceptors];
    const sendRequest = allInterceptors.reduceRight((next, interceptor) => (method, params) => {
      return interceptor.invoke(method, params, next);
    }, (method, params) => __awaiter(this, undefined, undefined, function* () {
      const adapter = method.createAdapter(instance, params);
      const source = yield adapter.execute();
      return new HttpResponse(source, {
        status: source.status,
        method: this
      });
    }));
    return sendRequest(this, params);
  }
  createAdapter(instance, params) {
    var _a, _b, _c, _d, _e;
    const url = resolveURL(this.url, (_a = params.pathVariables) !== null && _a !== undefined ? _a : {}, (_b = params.queryParams) !== null && _b !== undefined ? _b : {});
    const method = this.metadata.getHttpMethod();
    const headers = this.metadata.getHeaders();
    const signal = mergeAbortSignal(this.metadata.getSignal(), params.signal);
    const options = {
      url,
      method,
      headers: headers.concat(params.headers),
      payload: params.payload,
      signal,
      invokeMethod: this
    };
    const adapter = new ((_e = (_d = (_c = params.adapter) !== null && _c !== undefined ? _c : this.metadata.getAdapter()) !== null && _d !== undefined ? _d : instance[ADAPTER]) !== null && _e !== undefined ? _e : XMLHttpRequestAdapter)(options);
    return adapter;
  }
}

const DEFAULT_CONFIG = {
  threshold: 5,
  resetTimeout: 60000 // 1 minute
};
class CircuitBreakerInterceptor {
  static of(config = DEFAULT_CONFIG) {
    class SubCircuitBreakerInterceptor extends CircuitBreakerInterceptor {
      constructor() {
        super(config);
      }
    }
    return SubCircuitBreakerInterceptor;
  }
  constructor(config = {}) {
    this.failures = 0;
    this.lastFailureTime = 0;
    this.state = 'CLOSED';
    this.config = Object.assign(Object.assign({}, DEFAULT_CONFIG), config);
  }
  shouldReset() {
    return this.state === 'OPEN' && Date.now() - this.lastFailureTime >= this.config.resetTimeout;
  }
  invoke(method, params, next) {
    return __awaiter(this, undefined, undefined, function* () {
      if (this.state === 'OPEN') {
        if (this.shouldReset()) {
          this.state = 'HALF_OPEN';
        } else {
          throw new HttpError('Circuit breaker is open', 503, 'CIRCUIT_OPEN', {
            resetIn: this.config.resetTimeout - (Date.now() - this.lastFailureTime),
            failures: this.failures
          });
        }
      }
      try {
        const response = yield next(method, params);
        if (this.state === 'HALF_OPEN') {
          this.state = 'CLOSED';
          this.failures = 0;
        }
        return response;
      } catch (error) {
        this.failures++;
        this.lastFailureTime = Date.now();
        if (this.failures >= this.config.threshold) {
          this.state = 'OPEN';
        }
        throw error;
      }
    });
  }
}

class FetchRequestAdapter {
  constructor(options) {
    this.events = new Events();
    this.headersDefer = new Defer();
    this.bodyDefer = new Defer();
    this.status = 0;
    this.abortController = new AbortController();
    this.executeRequestIfNeed = () => {
      this.executeRequestIfNeed = () => undefined;
      options.signal.addEventListener('abort', () => {
        this.abortController.abort();
      });
      if (options.signal.aborted) {
        this.abortController.abort();
      }
      fetch(options.url, {
        method: options.method,
        headers: options.headers.toNative(),
        body: options.payload,
        signal: this.abortController.signal
      }).then(response => {
        this.status = response.status;
        this.headersDefer.resolve(new HttpHeaders(response.headers));
        if (!response.body) {
          this.bodyDefer.resolve(new BlobByteStream(new Blob([])));
        } else {
          const rawContentLength = response.headers.get('Content-Length');
          const contentLength = rawContentLength ? parseInt(rawContentLength) || 0 : 0;
          this.events.emit('download', new Progress(contentLength, 0));
          const stream = new NativeReadableStream(contentLength, response.body.pipeThrough(new TransformStream({
            transform(chunk, controller) {
              controller.enqueue(chunk.buffer);
            }
          })));
          stream.onProgress(progress => {
            this.events.emit('download', progress);
          });
          this.bodyDefer.resolve(stream);
        }
      });
    };
  }
  abort() {
    this.abortController.abort();
  }
  onDownload(listener) {
    return this.events.on('download', listener);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onUpload(_listener) {
    return () => undefined;
  }
  execute() {
    return __awaiter(this, undefined, undefined, function* () {
      this.executeRequestIfNeed();
      const {
        headersDefer,
        bodyDefer
      } = this;
      const getStatus = () => this.status;
      return {
        get status() {
          return getStatus();
        },
        headers() {
          return headersDefer.promise;
        },
        body() {
          return bodyDefer.promise;
        }
      };
    });
  }
}

function buildEndpointClass(endpointClass, metadata) {
  Generate(appCtx => {
    return metadata.getInterceptors().map(identifier => {
      if (isInterceptor(identifier)) {
        return identifier;
      }
      return appCtx.getInstance(identifier);
    }).flat();
  })(endpointClass.prototype, INTERCEPTORS);
  Reflect.set(endpointClass.prototype, ADAPTER, metadata.getAdaptor());
  const methods = new Map();
  metadata.getMethods().forEach((methodMetadata, methodName) => {
    methods.set(methodName, new RequestMethod(methodName, metadata, methodMetadata));
  });
  Reflect.set(endpointClass.prototype, METHODS, methods);
  Generate(function (appCtx) {
    return interceptors => {
      return interceptors.map(identifier => {
        return appCtx.getInstance(identifier);
      }).flat();
    };
  })(endpointClass.prototype, CONSTRUCT_INTERCEPTORS);
}

const ENDPOINT_METADATA_KEY = '@http:endpoint';
class EndpointMetadata {
  static from(target) {
    if (Reflect.hasMetadata(ENDPOINT_METADATA_KEY, target)) {
      return Reflect.getMetadata(ENDPOINT_METADATA_KEY, target);
    }
    const metadata = new EndpointMetadata();
    Reflect.defineMetadata(ENDPOINT_METADATA_KEY, metadata, target);
    buildEndpointClass(target, metadata);
    return metadata;
  }
  constructor() {
    this.timeout = 0;
    this.headers = new HttpHeaders();
    this.methods = new Map();
  }
  setOptions(endpointOptions) {
    if ('extends' in endpointOptions) {
      const parent = EndpointMetadata.from(endpointOptions.extends);
      this.baseURL = parent.baseURL;
      this.timeout = parent.timeout;
      this.headers = this.headers.concat(parent.headers);
      this.interceptors = parent.interceptors;
      this.adapter = parent.adapter;
    }
    if (endpointOptions.baseURL) {
      this.baseURL = endpointOptions.baseURL;
    } else if (typeof document === 'object') {
      this.baseURL = document.baseURI;
    } else {
      throw new Error('baseURL is not set');
    }
    if (endpointOptions.timeout) {
      this.timeout = endpointOptions.timeout;
    }
    if (endpointOptions.headers) {
      const headers = endpointOptions.headers;
      this.headers.setAll(headers);
    }
    if (endpointOptions.interceptors) {
      if (this.interceptors) {
        this.interceptors = this.interceptors.concat(endpointOptions.interceptors);
      } else {
        this.interceptors = endpointOptions.interceptors;
      }
    }
    if (endpointOptions.adapter) {
      this.adapter = endpointOptions.adapter;
    }
  }
  getMethodMetadata(methodName) {
    if (this.methods.has(methodName)) {
      return this.methods.get(methodName);
    }
  }
  setMethodMetadata(methodName, methodMetadata) {
    this.methods.set(methodName, methodMetadata);
  }
  getMethods() {
    return this.methods;
  }
  getInterceptors() {
    var _a, _b;
    return (_b = (_a = this.interceptors) === null || _a === undefined ? undefined : _a.map(interceptor => {
      if (isInterceptorFunction(interceptor)) {
        return class {
          invoke(method, params, next) {
            return interceptor(method, params, next);
          }
        };
      }
      return interceptor;
    })) !== null && _b !== undefined ? _b : [];
  }
  getAdaptor() {
    return this.adapter;
  }
  getBaseURL() {
    return this.baseURL;
  }
  getHeaders() {
    return this.headers;
  }
  getTimeout() {
    return this.timeout;
  }
}

function Endpoint(options) {
  return target => {
    EndpointMetadata.from(target).setOptions(options);
  };
}

function executeRequest(instance, methodMetadata, args, originFunction) {
  ({
    signal: methodMetadata.getSignal(),
    headers: methodMetadata.getHeaders().clone(),
    adapter: methodMetadata.getAdapter()
  });
  return originFunction.apply(instance, args);
}

class RequestMethodMetadata {
  constructor(name, options) {
    this.name = name;
    this.options = options;
    this.executionHandlers = [];
    this.signal = new AbortSignal();
  }
  appendSWRConfig(config) {
    this.swrConfig = Object.assign(Object.assign({}, this.swrConfig), config);
  }
  getSWRConfig() {
    return this.swrConfig;
  }
  getRetryConfig() {
    return this.options.retry;
  }
  appendExecutionHandler(handler) {
    this.executionHandlers.push(handler);
  }
  getExecutionHandlers() {
    return this.executionHandlers.slice(0);
  }
  appendSignal(signal) {
    this.signal = signal;
  }
  getSignal() {
    return this.signal;
  }
  getPath() {
    return this.options.path;
  }
  getHttpMethod() {
    return this.options.method;
  }
  getHeaders() {
    var _a;
    const headers = new HttpHeaders();
    headers.setAll((_a = this.options.headers) !== null && _a !== undefined ? _a : {});
    return headers;
  }
  getTimeout() {
    var _a;
    return (_a = this.options.timeout) !== null && _a !== undefined ? _a : 0;
  }
  getInterceptors() {
    var _a;
    return ((_a = this.options.interceptors) !== null && _a !== undefined ? _a : []).map(interceptor => {
      if (isInterceptorFunction(interceptor)) {
        return class {
          invoke(method, params, next) {
            return interceptor(method, params, next);
          }
        };
      }
      return interceptor;
    });
  }
  getAdapter() {
    return this.options.adapter;
  }
}

function Request(options) {
  return (target, context) => {
    if (!target || !('constructor' in target)) {
      return;
    }
    const propertyKey = typeof context === 'object' ? context.name : context;
    const method = new RequestMethodMetadata(propertyKey, options);
    if (typeof context === 'string' || typeof context === 'symbol') {
      setupMethodMetadata();
      Reflect.defineProperty(target, propertyKey, {
        value: deletator(Reflect.get(target, context))
      });
      return;
    }
    if (context.kind !== 'method') {
      return;
    }
    setupMethodMetadata();
    return deletator(Reflect.get(target, context.name));
    function setupMethodMetadata() {
      const endpointMetadata = EndpointMetadata.from(target.constructor);
      endpointMetadata.setMethodMetadata(propertyKey, method);
    }
    function deletator(originFunction) {
      return function (...args) {
        return executeRequest(this, method, args, originFunction);
      };
    }
  };
}
function createRequestDecorator(options, method) {
  if (typeof options === 'string') {
    return Request({
      path: options,
      method
    });
  } else {
    return Request(Object.assign(Object.assign({}, options), {
      method
    }));
  }
}

function Get(options) {
  return createRequestDecorator(options, 'GET');
}

function Post(options) {
  return createRequestDecorator(options, 'POST');
}

function appendExecHandler(target, methodName, handler) {
  const metadata = EndpointMetadata.from(target).getMethodMetadata(methodName);
  metadata === null || metadata === undefined ? undefined : metadata.appendExecutionHandler(handler);
}

function Header(name, defaultValue) {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target, methodName, (instance, metadata, params, args) => {
      var _a;
      const value = (_a = args[parameterIndex]) !== null && _a !== undefined ? _a : defaultValue;
      if (value) {
        params.headers.append(name, ...(Array.isArray(value) ? value : [value]));
      }
    });
  };
}

function PathVariable(name, defaultValue) {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target, methodName, (instance, metadata, params, args) => {
      const value = args[parameterIndex];
      params.pathVariables[name] = (value !== null && value !== undefined ? value : defaultValue) + '';
    });
  };
}

function Query(name, defaultValue) {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target, methodName, (instance, metadata, params, args) => {
      const value = args[parameterIndex];
      params.queryParams[name] = (value !== null && value !== undefined ? value : defaultValue) + '';
    });
  };
}

function isRevalidateStrategyClass(value) {
  return typeof value === 'function' && 'invoke' in value.prototype && typeof value.prototype['invoke'] === 'function';
}
function isRevalidateStrategyFunction(value) {
  return typeof value === 'function' && !isRevalidateStrategyClass(value);
}

class DefaultRevalidateStrategy {
  constructor(options) {
    this.options = options;
  }
  invoke(revalidate) {
    if (typeof window !== 'undefined') {
      if (this.options.focus !== false) {
        window.addEventListener('focus', () => revalidate('focus'));
      }
      if (this.options.reconnect) {
        window.addEventListener('online', () => revalidate('reconnect'));
      }
      if (this.options.events) {
        this.options.events.forEach(event => {
          window.addEventListener(event, () => {
            revalidate(event);
          });
        });
      }
    }
  }
}
const defaultConfig = {
  revalidate: {
    on: {
      focus: true,
      reconnect: true,
      ifStale: true,
      events: []
    }
  },
  dedupingInterval: 2000,
  staleTime: 0,
  retry: {
    maxAttempts: 3,
    interval: 1000,
    calculateDelay: attempt => {
      const baseInterval = 1000;
      const maxInterval = 30000;
      const jitter = Math.random() * 100;
      return Math.min(baseInterval * Math.pow(2, attempt - 1), maxInterval) + jitter;
    },
    shouldRetryOnError: ctx => {
      return ctx.attempt <= 3;
    }
  },
  refresh: {
    interval: 0,
    whenHidden: false,
    whenOffline: false
  }
};
class SWRInstance {
  constructor(key, fetcher, options = {}) {
    this.key = key;
    this.fetcher = fetcher;
    this.options = options;
    this.lastFetchTime = 0;
    this.currentRetryAttempt = 0;
    this.cleanupFns = [];
    this.config = Object.assign(Object.assign({}, defaultConfig), options);
    this.state = {
      data: options.initialData,
      isLoading: true,
      isValidating: false
    };
    this.setupRevalidationStrategy();
    this.setupRefreshInterval();
    (() => {
      this.revalidate(); // Initial fetch
    })();
  }
  setState(newState) {
    var _a, _b;
    this.state = Object.assign(Object.assign({}, this.state), newState);
    (_b = (_a = this.options).onStateChange) === null || _b === undefined ? undefined : _b.call(_a, this.state);
  }
  revalidate(reason) {
    return __awaiter(this, undefined, undefined, function* () {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
      const now = Date.now();
      // Deduping
      const dedupingInterval = (_a = this.config.dedupingInterval) !== null && _a !== undefined ? _a : 2000;
      if (now - this.lastFetchTime < dedupingInterval) {
        return;
      }
      this.setState({
        isValidating: true,
        validatingReason: reason
      });
      this.lastFetchTime = now;
      try {
        const newData = yield this.fetcher();
        this.setState({
          data: newData,
          error: undefined,
          isLoading: false,
          isValidating: false
        });
        this.currentRetryAttempt = 0;
        (_c = (_b = this.options).onSuccess) === null || _c === void 0 ? void 0 : _c.call(_b, newData);
      } catch (err) {
        const error = err;
        this.setState({
          error,
          isLoading: false,
          isValidating: false
        });
        (_e = (_d = this.options).onError) === null || _e === undefined ? undefined : _e.call(_d, error);
        // Retry logic
        if (this.config.retry && this.currentRetryAttempt < this.config.retry.maxAttempts) {
          const retryContext = {
            error,
            attempt: this.currentRetryAttempt + 1,
            timestamp: Date.now()
          };
          if (((_g = (_f = this.config.retry).shouldRetryOnError) === null || _g === undefined ? undefined : _g.call(_f, retryContext)) !== false) {
            this.currentRetryAttempt++;
            const delay = (_k = (_j = (_h = this.config.retry).calculateDelay) === null || _j === undefined ? undefined : _j.call(_h, this.currentRetryAttempt, error)) !== null && _k !== undefined ? _k : this.config.retry.interval * Math.pow(2, this.currentRetryAttempt - 1);
            setTimeout(() => this.revalidate(), delay);
          }
        }
      }
    });
  }
  setupRevalidationStrategy() {
    var _a, _b;
    const rawStrategy = (_a = this.config.revalidate) === null || _a === undefined ? undefined : _a.strategy;
    if ((_b = this.config.revalidate) === null || _b === undefined ? undefined : _b.strategy) {
      const strategy = isRevalidateStrategyFunction(rawStrategy) ? {
        invoke: rawStrategy
      } : new DefaultRevalidateStrategy(this.config.revalidate.on);
      strategy.invoke(reason => {
        this.revalidate(reason);
      });
    }
  }
  setupRefreshInterval() {
    var _a;
    if (((_a = this.config.refresh) === null || _a === undefined ? undefined : _a.interval) && this.config.refresh.interval > 0) {
      this.refreshInterval = setInterval(() => {
        var _a, _b;
        if (document.hidden && !((_a = this.config.refresh) === null || _a === undefined ? undefined : _a.whenHidden) || !navigator.onLine && !((_b = this.config.refresh) === null || _b === undefined ? undefined : _b.whenOffline)) {
          return;
        }
        this.revalidate();
      }, this.config.refresh.interval);
      this.cleanupFns.push(() => {
        if (this.refreshInterval) {
          clearInterval(this.refreshInterval);
        }
      });
    }
  }
  mutate(data) {
    if (data !== undefined) {
      this.setState({
        data
      });
    }
    this.revalidate();
  }
  getState() {
    return Object.assign(Object.assign({}, this.state), {
      mutate: data => this.mutate(data),
      revalidate: () => this.revalidate()
    });
  }
  destroy() {
    this.cleanupFns.forEach(cleanup => cleanup());
  }
}

export { ApiError, AuthenticationError, CancellationError, CircuitBreakerInterceptor, DefaultRevalidateStrategy, Defer, Endpoint, ErrorContextInterceptor, Events, FetchRequestAdapter, Get, Header, HttpError, HttpHeaders, HttpResponse, NetworkError, PathVariable, Post, Progress, PromiseStatus, Query, Request, RequestMethod, RetryInterceptor, SWRInstance, TimeoutError, TimeoutInterceptor, ValidationError, XMLHttpRequestAdapter, createRequestDecorator, isInterceptor, isInterceptorConstructor, isInterceptorFunction, isRevalidateStrategyClass, isRevalidateStrategyFunction, isURL, joinPath, mergeAbortSignal, parseHeaders, resolveURL };
//# sourceMappingURL=index.es.js.map
