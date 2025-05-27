import { Generate, Inject, ApplicationContext, PostInject, Scope, InstanceScope } from '@vgerbot/ioc';
import { lazyMember } from '@vgerbot/lazy';
import { DEFAULT_BUCKET } from '@vgerbot/solidium-persistence';
import { Signal, runWithSolidiumOwner } from '@vgerbot/solidium';
import { ReplaySubject, lastValueFrom, switchMap, take } from 'rxjs';
import { getOwner, createRoot, createEffect, on } from 'solid-js';
import { leading, debounce } from '@solid-primitives/scheduled';

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


function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

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

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
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
  static of(body, headers, status, method) {
    return new HttpResponse({
      status: () => Promise.resolve(status),
      headers: () => Promise.resolve(headers),
      body: () => body,
      onDownload() {
        return () => undefined;
      },
      onUpload() {
        return () => undefined;
      },
      onBodyComplete() {
        return () => undefined;
      }
    }, {
      method
    });
  }
  constructor(source, init) {
    this.source = source;
    this.init = init;
  }
  status() {
    return this.source.status();
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
      var _d;
      const regex = /event:\s*?([^\s\n\r]+?)[\n\r\s]*data:\s*?(.*?)\s*$/i;
      try {
        for (var _e = true, _f = __asyncValues(this.textStream(encoding)), _g; _g = yield __await(_f.next()), _a = _g.done, !_a; _e = true) {
          _c = _g.value;
          _e = false;
          const chunk = _c;
          const [, event, data] = (_d = regex.exec(chunk)) !== null && _d !== void 0 ? _d : [];
          if (event !== 'message' || !data) {
            continue;
          }
          yield yield __await(JSON.parse(data));
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (!_e && !_a && (_b = _f.return)) yield __await(_b.call(_f));
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    });
  }
  onUpload(listener) {
    return this.source.onUpload(listener);
  }
  onDownload(listener) {
    return this.source.onDownload(listener);
  }
  onBodyComplete(listener) {
    return this.source.onBodyComplete(listener);
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
const ABORT_CONTROLLER$1 = Symbol('abort-controller');
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
    return this[ABORT_CONTROLLER$1].signal;
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
    this[ABORT_CONTROLLER$1].abort();
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
_a = STATUS, _b = ABORT_CONTROLLER$1;
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
  clear() {
    this.headers.clear();
  }
  getContentLength() {
    var _a;
    const [contentLengthStr] = (_a = this.get('content-length')) !== null && _a !== undefined ? _a : [];
    return parseInt(contentLengthStr) || 0;
  }
}

function readStream(stream) {
  return __asyncGenerator(this, arguments, function* readStream_1() {
    const reader = stream.getReader();
    try {
      while (true) {
        const {
          value,
          done
        } = yield __await(reader.read());
        if (done) {
          break;
        }
        yield yield __await(value);
      }
    } finally {
      reader.releaseLock();
    }
  });
}

function createProgressiveReadableStream(stream, progress = () => undefined) {
  let loaded = 0;
  const abortController = new AbortController();
  return new ReadableStream({
    start: controller => __awaiter(this, undefined, undefined, function* () {
      var _a, e_1, _b, _c;
      try {
        progress(loaded);
        try {
          for (var _d = true, _e = __asyncValues(readStream(stream)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const chunk = _c;
            loaded += chunk.byteLength;
            progress(loaded);
            controller.enqueue(chunk.buffer);
            if (abortController.signal.aborted) {
              break;
            }
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
      } catch (e) {
        controller.error(e);
      } finally {
        controller.close();
      }
    }),
    cancel: () => {
      abortController.abort();
    }
  });
}

class Progress {
  constructor(total, loaded, chunk) {
    this.total = total;
    this.loaded = loaded;
    this.chunk = chunk;
  }
  percent(suffix = '%', fractionDigits = 2) {
    const p = Math.pow(10, fractionDigits);
    return (this.total ? Math.trunc(this.loaded / this.total * 100 * p + 0.5) / p : 0).toFixed(fractionDigits) + suffix;
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

class BlobByteStream extends ProgressiveByteStream {
  constructor(blob) {
    super();
    this.blob = blob;
  }
  readAsStream() {
    const total = this.blob.size;
    return createProgressiveReadableStream(this.blob.stream(), loaded => {
      this.updateProgress(new Progress(total, loaded));
    });
  }
  readAsBlob(contentType) {
    return __awaiter(this, undefined, undefined, function* () {
      if (contentType === this.blob.type) {
        return this.blob;
      }
      return new Blob([this.blob], {
        type: contentType
      });
    });
  }
  readAsBuffer() {
    return this.blob.arrayBuffer();
  }
  total() {
    return Promise.resolve(this.blob.size);
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
    this.statusDefer = new Defer();
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
    this.executeRequestIfNeed = () => __awaiter(this, undefined, undefined, function* () {
      this.executeRequestIfNeed = () => undefined;
      if (this.isAborted) {
        return;
      }
      if (options.payload) {
        if (options.payload instanceof ReadableStream) {
          const reader = options.payload.getReader();
          const chunks = [];
          while (true) {
            const {
              value,
              done
            } = yield reader.read();
            if (value) {
              chunks.push(value);
            }
            if (done) {
              break;
            }
          }
          xhr.send(new Blob(chunks));
        } else {
          xhr.send(options.payload);
        }
      } else {
        xhr.send();
      }
    });
    xhr.addEventListener('readystatechange', () => {
      var _a;
      if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
        const rawHeaders = xhr.getAllResponseHeaders();
        const headers = new HttpHeaders(parseHeaders(rawHeaders));
        this.headersDefer.resolve(headers);
        this.statusDefer.resolve(xhr.status);
      } else if (xhr.readyState === XMLHttpRequest.DONE) {
        this.bodyDefer.resolve(new BlobByteStream((_a = xhr.response) !== null && _a !== undefined ? _a : new Blob([])));
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
  execute() {
    return __awaiter(this, undefined, undefined, function* () {
      this.executeRequestIfNeed();
      const {
        headersDefer,
        bodyDefer,
        statusDefer,
        events
      } = this;
      return {
        status() {
          return statusDefer.promise;
        },
        headers() {
          return headersDefer.promise;
        },
        body() {
          return bodyDefer.promise;
        },
        onDownload(listener) {
          return events.on('download', listener);
        },
        onUpload(listener) {
          return events.on('upload', listener);
        },
        onBodyComplete(listener) {
          let isListenerCancelled = false;
          bodyDefer.promise.then(body => {
            if (isListenerCancelled) {
              return;
            }
            listener(body);
          });
          return () => {
            isListenerCancelled = true;
          };
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

function resolveURL(routeTemplate, pathVariables, queryParameters) {
  const pathParamReplacedURL = routeTemplate.replace(/(:([a-z]+))/gi, (fullMatch, placeholder, variableName) => {
    var _a, _b;
    if (variableName in pathVariables) {
      return (_b = (_a = pathVariables[variableName]) === null || _a === undefined ? undefined : _a.toString()) !== null && _b !== undefined ? _b : fullMatch;
    }
    return fullMatch;
  });
  const urlObject = new URL(pathParamReplacedURL);
  queryParameters.forEach((value, key) => {
    if (Array.isArray(value)) {
      value.forEach(arrayItem => {
        urlObject.searchParams.append(key, arrayItem.toString());
      });
    } else {
      urlObject.searchParams.append(key, value.toString());
    }
  });
  return urlObject.toString();
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Base class for all HTTP-related errors
 */
class HttpError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = this.constructor.name;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Error thrown when a request times out
 */
class TimeoutError extends HttpError {
  constructor(message = 'Request timed out', context, cause) {
    super(message, cause);
    this.context = context;
  }
}
/**
 * Error thrown when there's a network issue
 */
class NetworkError extends HttpError {
  constructor(message = 'Network error occurred', cause) {
    super(message, cause);
  }
}
/**
 * Error thrown when a request is aborted
 */
class AbortError extends HttpError {
  constructor(message = 'Request was aborted', cause) {
    super(message, cause);
  }
}
/**
 * Error thrown when there's an issue parsing the response
 */
class ParseError extends HttpError {
  constructor(message = 'Failed to parse response', cause) {
    super(message, cause);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Base class for HTTP status code errors
 */
class HttpStatusError extends HttpError {
  constructor(status, statusText, headers, responseBody, message) {
    super(message || `HTTP Error ${status}: ${statusText}`);
    this.status = status;
    this.statusText = statusText;
    this.headers = headers;
    this.responseBody = responseBody;
  }
  /**
   * Check if this is a client error (4xx)
   */
  get isClientError() {
    return this.status >= 400 && this.status < 500;
  }
  /**
   * Check if this is a server error (5xx)
   */
  get isServerError() {
    return this.status >= 500;
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 400 Bad Request
 */
class BadRequestError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Bad Request') {
    super(400, 'Bad Request', headers, responseBody, message);
  }
}
/**
 * 401 Unauthorized
 */
class UnauthorizedError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Unauthorized') {
    super(401, 'Unauthorized', headers, responseBody, message);
  }
}
/**
 * 402 Payment Required
 */
class PaymentRequiredError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Payment Required') {
    super(402, 'Payment Required', headers, responseBody, message);
  }
}
/**
 * 403 Forbidden
 */
class ForbiddenError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Forbidden') {
    super(403, 'Forbidden', headers, responseBody, message);
  }
}
/**
 * 404 Not Found
 */
class NotFoundError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Not Found') {
    super(404, 'Not Found', headers, responseBody, message);
  }
}
/**
 * 405 Method Not Allowed
 */
class MethodNotAllowedError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Method Not Allowed') {
    super(405, 'Method Not Allowed', headers, responseBody, message);
  }
}
/**
 * 406 Not Acceptable
 */
class NotAcceptableError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Not Acceptable') {
    super(406, 'Not Acceptable', headers, responseBody, message);
  }
}
/**
 * 407 Proxy Authentication Required
 */
class ProxyAuthenticationRequiredError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Proxy Authentication Required') {
    super(407, 'Proxy Authentication Required', headers, responseBody, message);
  }
}
/**
 * 408 Request Timeout
 */
class RequestTimeoutError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Request Timeout') {
    super(408, 'Request Timeout', headers, responseBody, message);
  }
}
/**
 * 409 Conflict
 */
class ConflictError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Conflict') {
    super(409, 'Conflict', headers, responseBody, message);
  }
}
/**
 * 410 Gone
 */
class GoneError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Gone') {
    super(410, 'Gone', headers, responseBody, message);
  }
}
/**
 * 411 Length Required
 */
class LengthRequiredError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Length Required') {
    super(411, 'Length Required', headers, responseBody, message);
  }
}
/**
 * 412 Precondition Failed
 */
class PreconditionFailedError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Precondition Failed') {
    super(412, 'Precondition Failed', headers, responseBody, message);
  }
}
/**
 * 413 Payload Too Large
 */
class PayloadTooLargeError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Payload Too Large') {
    super(413, 'Payload Too Large', headers, responseBody, message);
  }
}
/**
 * 414 URI Too Long
 */
class URITooLongError extends HttpStatusError {
  constructor(headers, responseBody, message = 'URI Too Long') {
    super(414, 'URI Too Long', headers, responseBody, message);
  }
}
/**
 * 415 Unsupported Media Type
 */
class UnsupportedMediaTypeError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Unsupported Media Type') {
    super(415, 'Unsupported Media Type', headers, responseBody, message);
  }
}
/**
 * 416 Range Not Satisfiable
 */
class RangeNotSatisfiableError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Range Not Satisfiable') {
    super(416, 'Range Not Satisfiable', headers, responseBody, message);
  }
}
/**
 * 417 Expectation Failed
 */
class ExpectationFailedError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Expectation Failed') {
    super(417, 'Expectation Failed', headers, responseBody, message);
  }
}
/**
 * 418 I'm a teapot
 */
class ImATeapotError extends HttpStatusError {
  constructor(headers, responseBody,
  // eslint-disable-next-line quotes
  message = "I'm a teapot") {
    // eslint-disable-next-line quotes
    super(418, "I'm a teapot", headers, responseBody, message);
  }
}
/**
 * 421 Misdirected Request
 */
class MisdirectedRequestError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Misdirected Request') {
    super(421, 'Misdirected Request', headers, responseBody, message);
  }
}
/**
 * 422 Unprocessable Entity
 */
class UnprocessableEntityError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Unprocessable Entity') {
    super(422, 'Unprocessable Entity', headers, responseBody, message);
  }
}
/**
 * 423 Locked
 */
class LockedError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Locked') {
    super(423, 'Locked', headers, responseBody, message);
  }
}
/**
 * 424 Failed Dependency
 */
class FailedDependencyError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Failed Dependency') {
    super(424, 'Failed Dependency', headers, responseBody, message);
  }
}
/**
 * 425 Too Early
 */
class TooEarlyError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Too Early') {
    super(425, 'Too Early', headers, responseBody, message);
  }
}
/**
 * 426 Upgrade Required
 */
class UpgradeRequiredError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Upgrade Required') {
    super(426, 'Upgrade Required', headers, responseBody, message);
  }
}
/**
 * 428 Precondition Required
 */
class PreconditionRequiredError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Precondition Required') {
    super(428, 'Precondition Required', headers, responseBody, message);
  }
}
/**
 * 429 Too Many Requests
 */
class TooManyRequestsError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Too Many Requests') {
    super(429, 'Too Many Requests', headers, responseBody, message);
  }
}
/**
 * 431 Request Header Fields Too Large
 */
class RequestHeaderFieldsTooLargeError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Request Header Fields Too Large') {
    super(431, 'Request Header Fields Too Large', headers, responseBody, message);
  }
}
/**
 * 451 Unavailable For Legal Reasons
 */
class UnavailableForLegalReasonsError extends HttpStatusError {
  constructor(headers, responseBody, message = 'Unavailable For Legal Reasons') {
    super(451, 'Unavailable For Legal Reasons', headers, responseBody, message);
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Base class for server errors (5xx)
 */
class ServerError extends HttpStatusError {
  constructor(status, statusText, headers, responseBody, message) {
    super(status, statusText, headers, responseBody, message || `Server Error: ${status} ${statusText}`);
  }
}
/**
 * 500 Internal Server Error
 */
class InternalServerError extends ServerError {
  constructor(headers, responseBody, message = 'Internal Server Error') {
    super(500, 'Internal Server Error', headers, responseBody, message);
  }
}
/**
 * 501 Not Implemented
 */
class NotImplementedError extends ServerError {
  constructor(headers, responseBody, message = 'Not Implemented') {
    super(501, 'Not Implemented', headers, responseBody, message);
  }
}
/**
 * 502 Bad Gateway
 */
class BadGatewayError extends ServerError {
  constructor(headers, responseBody, message = 'Bad Gateway') {
    super(502, 'Bad Gateway', headers, responseBody, message);
  }
}
/**
 * 503 Service Unavailable
 */
class ServiceUnavailableError extends ServerError {
  constructor(headers, responseBody, message = 'Service Unavailable') {
    super(503, 'Service Unavailable', headers, responseBody, message);
  }
}
/**
 * 504 Gateway Timeout
 */
class GatewayTimeoutError extends ServerError {
  constructor(headers, responseBody, message = 'Gateway Timeout') {
    super(504, 'Gateway Timeout', headers, responseBody, message);
  }
}
/**
 * 505 HTTP Version Not Supported
 */
class HTTPVersionNotSupportedError extends ServerError {
  constructor(headers, responseBody, message = 'HTTP Version Not Supported') {
    super(505, 'HTTP Version Not Supported', headers, responseBody, message);
  }
}
/**
 * 506 Variant Also Negotiates
 */
class VariantAlsoNegotiatesError extends ServerError {
  constructor(headers, responseBody, message = 'Variant Also Negotiates') {
    super(506, 'Variant Also Negotiates', headers, responseBody, message);
  }
}
/**
 * 507 Insufficient Storage
 */
class InsufficientStorageError extends ServerError {
  constructor(headers, responseBody, message = 'Insufficient Storage') {
    super(507, 'Insufficient Storage', headers, responseBody, message);
  }
}
/**
 * 508 Loop Detected
 */
class LoopDetectedError extends ServerError {
  constructor(headers, responseBody, message = 'Loop Detected') {
    super(508, 'Loop Detected', headers, responseBody, message);
  }
}
/**
 * 510 Not Extended
 */
class NotExtendedError extends ServerError {
  constructor(headers, responseBody, message = 'Not Extended') {
    super(510, 'Not Extended', headers, responseBody, message);
  }
}
/**
 * 511 Network Authentication Required
 */
class NetworkAuthenticationRequiredError extends ServerError {
  constructor(headers, responseBody, message = 'Network Authentication Required') {
    super(511, 'Network Authentication Required', headers, responseBody, message);
  }
}

class ErrorContextInterceptor {
  invoke(instance, method, params, next) {
    return __awaiter(this, undefined, undefined, function* () {
      try {
        return yield next(instance, method, params);
      } catch (error) {
        if (error instanceof HttpError) {
          // Enhance error context with request details
          Object.defineProperty(error, 'context', {
            value: {
              methodName: method.name.toString(),
              timestamp: new Date().toISOString(),
              headers: params.headers.toJSON(),
              pathVariables: params.pathVariables,
              queryParams: params.queryParams
            }
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
      if (error instanceof HttpStatusError) {
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
  invoke(instance, method, params, next) {
    return __awaiter(this, undefined, undefined, function* () {
      let attempt = 0;
      let delay = this.config.initialDelay;
      while (attempt < this.config.maxAttempts) {
        try {
          return yield next(instance, method, params);
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
        throw new MaxRetryAttemptsReachedError(attempt, error);
      }
    });
  }
}
class MaxRetryAttemptsReachedError extends HttpError {
  constructor(attempts, originalError) {
    super('Max retry attempts reached');
    this.attempts = attempts;
    this.originalError = originalError;
  }
}

function mergeAbortSignal(...signals) {
  const filtedSignals = signals.filter(it => !!it);
  if (filtedSignals.length === 1) {
    return filtedSignals[0];
  }
  const controller = new AbortController();
  const mergedSignal = controller.signal;
  filtedSignals.forEach(signal => {
    signal.addEventListener('abort', () => {
      controller.abort();
    });
  });
  return mergedSignal;
}

const DEFAULT_CONFIG$1 = {
  timeout: 30000 // 30 seconds
};
class TimeoutInterceptor {
  constructor(config = {}) {
    this.config = Object.assign(Object.assign({}, DEFAULT_CONFIG$1), config);
  }
  invoke(instance, method, params, next) {
    return __awaiter(this, undefined, undefined, function* () {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);
      try {
        // Merge the timeout signal with any existing signal
        const signal = mergeAbortSignal(params.signal, controller.signal);
        return yield Promise.race([next(instance, method, Object.assign(Object.assign({}, params), {
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

/**
 * Symbol constants used for endpoint instance storage and retrieval
 */
/** Stores HTTP methods (GET, POST, etc.) associated with an endpoint */
const METHODS = Symbol('endpoint-request-methods');
/** Stores interceptors that process requests/responses for an endpoint */
const GET_INTERCEPTORS = Symbol('endpoint-get-interceptors');
/** Stores the HTTP adapter configuration for an endpoint */
const ADAPTER = Symbol('endpoint-adapter');
/** Stores the interceptor construction logic for an endpoint */
const CONSTRUCT_INTERCEPTORS = Symbol('endpoint-construct-interceptors');
const ABORT_CONTROLLER = Symbol('abort-controller');
const APPLICATION_CONTEXT = Symbol('application-context');
const HTTP_CONFIGURATION = Symbol('http-configuration');

/**
 * Represents an error that occurred during resource processing
 */
class ResourceError {
  static wrap(error) {
    if (error instanceof ResourceError) {
      return error;
    }
    return new ResourceError(error);
  }
  /**
   * Create a new ResourceError
   */
  constructor(error) {
    this.originalError = error;
    if (error instanceof HttpStatusError) {
      this.httpStatus = error.status;
      this.httpStatusText = error.statusText;
      this.responseBody = error.responseBody;
      this.message = error.message;
      this.name = error.name;
    } else if (error instanceof HttpError) {
      this.message = error.message;
      this.name = error.name;
    } else if (error instanceof Error) {
      this.message = error.message;
      this.name = error.name;
    } else {
      this.message = String(error);
      this.name = 'UnknownError';
    }
  }
  /**
   * Check if this is a client error (4xx)
   */
  get isClientError() {
    return !!this.httpStatus && this.httpStatus >= 400 && this.httpStatus < 500;
  }
  /**
   * Check if this is a server error (5xx)
   */
  get isServerError() {
    return !!this.httpStatus && this.httpStatus >= 500;
  }
  /**
   * Check if this is a network error
   */
  get isNetworkError() {
    return this.name === 'NetworkError';
  }
  /**
   * Check if this is a timeout error
   */
  get isTimeoutError() {
    return this.name === 'TimeoutError';
  }
  /**
   * Check if this is an abort error
   */
  get isAbortError() {
    return this.name === 'AbortError';
  }
  /**
   * Check if this is a parse error
   */
  get isParseError() {
    return this.name === 'ParseError';
  }
  /**
   * Convert to string
   */
  toString() {
    return `${this.name}: ${this.message}`;
  }
}

class ErrorWrappingInterceptor {
  invoke(instance, method, params, next) {
    return __awaiter(this, undefined, undefined, function* () {
      try {
        const response = yield next(instance, method, params);
        return response;
      } catch (error) {
        // Handle different error types
        if (error instanceof DOMException && error.name === 'AbortError') {
          // Convert DOMException AbortError to our AbortError
          const abortError = new AbortError('Request was aborted', error);
          throw new ResourceError(abortError);
        } else if (error instanceof TypeError && error.message.includes('NetworkError')) {
          // Handle network errors
          const networkError = new NetworkError('Network error occurred', error);
          throw new ResourceError(networkError);
        } else if (error instanceof TypeError && error.message.includes('timeout')) {
          // Handle timeout errors
          const timeoutError = new TimeoutError('Request timed out', {}, error);
          throw new ResourceError(timeoutError);
        } else if (error instanceof SyntaxError && error.message.includes('JSON')) {
          // Handle JSON parsing errors
          const parseError = new ParseError('Failed to parse JSON response', error);
          throw new ResourceError(parseError);
        } else {
          throw new ResourceError(error);
        }
      }
    });
  }
}

class RequestMethod {
  static get(instance, name) {
    var _a;
    return (_a = instance[METHODS]) === null || _a === undefined ? undefined : _a.get(name);
  }
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
    this.baseInterceptors.push(new ErrorWrappingInterceptor());
    this.baseInterceptors.push(new ErrorContextInterceptor());
    const retryConfig = this.metadata.getRetryConfig();
    if (retryConfig) {
      this.baseInterceptors.push(new RetryInterceptor(retryConfig));
    }
  }
  getAllInterceptors(instance) {
    const timeout = this.metadata.getTimeout() || this.endpointMetadata.getTimeout();
    const extInterceptors = [];
    if (timeout > 0) {
      extInterceptors.push(new TimeoutInterceptor({
        timeout
      }));
    } else if (timeout !== 0) {
      extInterceptors.push(new TimeoutInterceptor());
    }
    const excludeInterceptors = this.metadata.getExcludeInterceptors();
    const endpointInterceptors = instance[GET_INTERCEPTORS](excludeInterceptors);
    const methodInterceptors = instance[CONSTRUCT_INTERCEPTORS](this.metadata.getInterceptors());
    const allInterceptors = [...this.baseInterceptors, ...extInterceptors, ...endpointInterceptors, ...methodInterceptors];
    return allInterceptors;
  }
  invoke(instance, params) {
    return __awaiter(this, undefined, undefined, function* () {
      const adapter = this.createAdapter(instance, params);
      const source = yield adapter.execute();
      return new HttpResponse(source, {
        method: this
      });
    });
  }
  resolveURL(params) {
    var _a;
    return resolveURL(this.url, (_a = params.pathVariables) !== null && _a !== undefined ? _a : {}, params.queryParams);
  }
  createAdapter(instance, params) {
    var _a, _b, _c;
    const url = this.resolveURL(params);
    const method = this.metadata.getHttpMethod();
    const headers = this.metadata.getHeaders();
    const signal = mergeAbortSignal(instance[ABORT_CONTROLLER].signal, params.signal);
    const options = {
      url,
      method,
      headers: headers.concat(params.headers),
      payload: params.payload,
      signal,
      invokeMethod: this
    };
    const adapter = new ((_c = (_b = (_a = params.adapter) !== null && _a !== undefined ? _a : this.metadata.getAdapter()) !== null && _b !== undefined ? _b : instance[ADAPTER]) !== null && _c !== undefined ? _c : XMLHttpRequestAdapter)(options);
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
  invoke(instance, method, params, next) {
    return __awaiter(this, undefined, undefined, function* () {
      if (this.state === 'OPEN') {
        if (this.shouldReset()) {
          this.state = 'HALF_OPEN';
        } else {
          throw new CircuitBreakerError();
        }
      }
      try {
        const response = yield next(instance, method, params);
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
class CircuitBreakerError extends HttpError {
  constructor(message = 'Circuit breaker is open') {
    super(message);
  }
}

class NativeReadableStream extends ProgressiveByteStream {
  constructor(contentLength, stream) {
    super();
    this.contentLength = contentLength;
    this.stream = stream;
    this.blobPromise = null;
  }
  total() {
    return Promise.resolve(this.contentLength);
  }
  readAsStoredBlob() {
    return __awaiter(this, undefined, undefined, function* () {
      if (this.blobPromise !== null) {
        return this.blobPromise;
      }
      const total = this.contentLength;
      let loaded = 0;
      this.blobPromise = new Promise((resolve, reject) => {
        const chunks = [];
        this.updateProgress(new Progress(total, 0));
        (() => __awaiter(this, undefined, undefined, function* () {
          var _a, e_1, _b, _c;
          try {
            for (var _d = true, _e = __asyncValues(readStream(this.stream)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
              _c = _f.value;
              _d = false;
              const chunk = _c;
              loaded += chunk.byteLength;
              chunks.push(chunk);
              this.updateProgress(new Progress(total, loaded));
            }
          } catch (e_1_1) {
            e_1 = {
              error: e_1_1
            };
          } finally {
            try {
              if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
          const blob = new Blob(chunks);
          resolve(blob);
        }))().catch(reject);
      });
      return this.blobPromise;
    });
  }
  readAsBuffer() {
    return __awaiter(this, undefined, undefined, function* () {
      const blob = yield this.readAsStoredBlob();
      return yield blob.arrayBuffer();
    });
  }
  readAsStream() {
    return new ReadableStream({
      start: controller => __awaiter(this, undefined, undefined, function* () {
        var _a, e_2, _b, _c;
        try {
          const blob = yield this.readAsStoredBlob();
          const blobStream = blob.stream();
          try {
            for (var _d = true, _e = __asyncValues(readStream(blobStream)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
              _c = _f.value;
              _d = false;
              const chunk = _c;
              controller.enqueue(chunk.buffer);
            }
          } catch (e_2_1) {
            e_2 = {
              error: e_2_1
            };
          } finally {
            try {
              if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
          controller.close();
        } catch (error) {
          console.error('Error in readAsStream:', error);
          controller.error(error);
        }
      })
    });
  }
  readAsBlob() {
    return __awaiter(this, arguments, undefined, function* (contentType = 'application/octet-stream') {
      const blob = yield this.readAsStoredBlob();
      // If the requested content type is different from the stored blob's type,
      // create a new blob with the requested type
      if (blob.type !== contentType) {
        return new Blob([blob], {
          type: contentType
        });
      }
      return blob;
    });
  }
}

class FetchRequestAdapter {
  constructor(options) {
    this.events = new Events();
    this.headersDefer = new Defer();
    this.bodyDefer = new Defer();
    this.statusDefer = new Defer();
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
        this.statusDefer.resolve(response.status);
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
  execute() {
    return __awaiter(this, undefined, undefined, function* () {
      this.executeRequestIfNeed();
      const {
        headersDefer,
        bodyDefer,
        statusDefer,
        events
      } = this;
      return {
        status() {
          return statusDefer.promise;
        },
        headers() {
          return headersDefer.promise;
        },
        body() {
          return bodyDefer.promise;
        },
        onDownload(listener) {
          return events.on('download', listener);
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onUpload(_listener) {
          return () => undefined;
        },
        onBodyComplete(listener) {
          let isListenerCancelled = false;
          bodyDefer.promise.then(body => {
            if (isListenerCancelled) {
              return;
            }
            listener(body);
          });
          return () => {
            isListenerCancelled = true;
          };
        }
      };
    });
  }
}

const DEFAULT_HTTP_CONFIGURATION = Symbol('solidium-default-http-configuration');

function buildEndpointClass(endpointClass, metadata) {
  Reflect.set(endpointClass.prototype, GET_INTERCEPTORS, function (exclude) {
    var _a, _b;
    const globalInterceptors = (_b = (_a = this[HTTP_CONFIGURATION]) === null || _a === undefined ? undefined : _a.interceptors) !== null && _b !== undefined ? _b : [];
    return [...globalInterceptors, ...metadata.getInterceptors()].filter(it => !(exclude === null || exclude === undefined ? undefined : exclude.includes(it))).map(identifier => {
      if (isInterceptor(identifier)) {
        return identifier;
      }
      return this[APPLICATION_CONTEXT].getInstance(identifier);
    }).flat();
  });
  Reflect.set(endpointClass.prototype, ADAPTER, metadata.getAdaptor());
  Generate(function (appCtx) {
    return interceptors => {
      return interceptors.map(identifier => {
        if (typeof identifier === 'object') {
          return identifier;
        }
        return appCtx.getInstance(identifier);
      }).flat();
    };
  })(endpointClass.prototype, CONSTRUCT_INTERCEPTORS);
  lazyMember(() => new AbortController())(endpointClass.prototype, ABORT_CONTROLLER);
  lazyMember(() => {
    const methods = new Map();
    metadata.getMethods().forEach((methodMetadata, methodName) => {
      methods.set(methodName, new RequestMethod(methodName, metadata, methodMetadata));
    });
    return methods;
  })(endpointClass.prototype, METHODS);
  Inject(ApplicationContext)(endpointClass.prototype, APPLICATION_CONTEXT);
  Inject(DEFAULT_HTTP_CONFIGURATION)(endpointClass.prototype, HTTP_CONFIGURATION);
}

class RequestMethodMetadata {
  constructor(name) {
    this.name = name;
    this.executionHandlers = [];
    this.extra = new Map();
    this.options = {
      path: '/',
      method: 'GET'
    };
    this.externalInterceptors = [];
  }
  setOptions(options) {
    Object.assign(this.options, options);
  }
  getExtra(key) {
    return this.extra.get(key);
  }
  setExtra(key, value) {
    this.extra.set(key, value);
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
    return ((_a = this.options.interceptors) !== null && _a !== undefined ? _a : []).concat(this.externalInterceptors);
  }
  getExcludeInterceptors() {
    var _a;
    return (_a = this.options.excludeInterceptors) !== null && _a !== undefined ? _a : [];
  }
  getAdapter() {
    return this.options.adapter;
  }
  isReactive() {
    var _a;
    return (_a = this.options.reactive) !== null && _a !== undefined ? _a : true;
  }
  appendInterceptor(interceptor) {
    this.externalInterceptors.push(interceptor);
  }
}

const ENDPOINT_METADATA_KEY = '@http:endpoint';
class EndpointMetadata {
  static from(target) {
    if (Reflect.hasMetadata(ENDPOINT_METADATA_KEY, target)) {
      return Reflect.getMetadata(ENDPOINT_METADATA_KEY, target);
    }
    const metadata = new EndpointMetadata();
    Reflect.defineMetadata(ENDPOINT_METADATA_KEY, metadata, target);
    Reflect.defineMetadata(ENDPOINT_METADATA_KEY, metadata, target.prototype);
    buildEndpointClass(target, metadata);
    return metadata;
  }
  static fromInstance(target) {
    const prototype = Object.getPrototypeOf(target);
    const metadata = Reflect.getMetadata(ENDPOINT_METADATA_KEY, prototype);
    if (metadata instanceof EndpointMetadata) {
      return metadata;
    }
    return EndpointMetadata.from(prototype.constructor);
  }
  constructor() {
    this.timeout = 0;
    this.headers = new HttpHeaders();
    this.methods = new Map();
  }
  setOptions(endpointOptions) {
    var _a, _b;
    if ('extends' in endpointOptions) {
      const parent = EndpointMetadata.from(endpointOptions.extends);
      this.baseURL = (_a = endpointOptions.baseURL) !== null && _a !== undefined ? _a : parent.baseURL;
      this.timeout = parent.timeout;
      this.headers = this.headers.concat(parent.headers);
      this.interceptors = parent.interceptors;
      this.adapter = parent.adapter;
    } else {
      this.baseURL = endpointOptions.baseURL;
    }
    if (!this.baseURL) {
      if (typeof document === 'object') {
        this.baseURL = document.baseURI;
      } else {
        throw new Error('baseURL is not set');
      }
    }
    this.baseURL = joinPath(this.baseURL, (_b = endpointOptions.path) !== null && _b !== undefined ? _b : '');
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
    let metadata = this.methods.get(methodName);
    if (!metadata) {
      this.methods.set(methodName, metadata = new RequestMethodMetadata(methodName));
    }
    return metadata;
  }
  setMethodMetadata(methodName, methodMetadata) {
    this.methods.set(methodName, methodMetadata);
  }
  getMethods() {
    return this.methods;
  }
  getInterceptors() {
    var _a;
    return (_a = this.interceptors) !== null && _a !== undefined ? _a : [];
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

/* eslint-disable @typescript-eslint/no-explicit-any */
function decorateEndpointMethod(decorator) {
  return function decorateMethod(target, context, descriptor) {
    if (typeof target === 'function' && typeof context === 'object') {
      const propertyKey = context.name;
      context.addInitializer(function () {
        const clazz = this.constructor;
        const method = EndpointMetadata.from(clazz).getMethodMetadata(propertyKey);
        const descriptor = decorator(clazz, propertyKey, method);
        if (descriptor) {
          Reflect.set(this, propertyKey, descriptor.value);
        }
      });
    } else if (typeof target === 'object' && typeof context !== 'object' && typeof descriptor === 'object') {
      const propertyKey = context;
      const clazz = target.constructor;
      const method = EndpointMetadata.from(clazz).getMethodMetadata(propertyKey);
      const descriptor = decorator(clazz, propertyKey, method);
      return descriptor;
    }
  };
}

let executionContext;
function getExecutionContext() {
  return executionContext;
}
function setExecutionContext(context) {
  executionContext = context;
}

function Request(options) {
  return decorateEndpointMethod((clazz, methodName, methodMetadata) => {
    methodMetadata.setOptions(options);
    return {
      value: delegator(Reflect.get(clazz.prototype, methodName), methodMetadata)
    };
  });
  function delegator(originFunction, methodMetadata) {
    return function (...args) {
      const params = {
        method: methodMetadata.getHttpMethod(),
        headers: methodMetadata.getHeaders().clone(),
        pathVariables: {},
        queryParams: new URLSearchParams(),
        adapter: methodMetadata.getAdapter(),
        args
      };
      const instance = this;
      const method = instance[METHODS].get(methodMetadata.name);
      if (!method) {
        const error = new Error(`Not found method ${methodMetadata.name.toString()}`);
        throw error;
      }
      setExecutionContext({
        instance,
        method,
        params
      });
      return originFunction.apply(this, args);
    };
  }
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

function Put(options) {
  return createRequestDecorator(options, 'PUT');
}

function Delete(options) {
  return createRequestDecorator(options, 'DELETE');
}

function appendExecHandler(target, methodName, handler) {
  const metadata = EndpointMetadata.from(target).getMethodMetadata(methodName);
  metadata === null || metadata === undefined ? undefined : metadata.appendExecutionHandler(handler);
}

function Header(name, defaultValue) {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target.constructor, methodName, (instance, metadata, params, args) => {
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
    appendExecHandler(target.constructor, methodName, (instance, metadata, params, args) => {
      const value = args[parameterIndex];
      params.pathVariables[name] = (value !== null && value !== undefined ? value : defaultValue) + '';
    });
  };
}

function Query(name, defaultValue) {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target.constructor, methodName, (instance, metadata, params, args) => {
      var _a;
      const value = (_a = args[parameterIndex]) !== null && _a !== undefined ? _a : defaultValue;
      if (Array.isArray(value)) {
        value.forEach(value => {
          params.queryParams.append(name, value);
        });
      } else if (value !== null && value !== undefined) {
        params.queryParams.set(name, value + '');
      }
    });
  };
}

function isBodyInit(value) {
  return value instanceof Blob || value instanceof ArrayBuffer || ArrayBuffer.isView(value) || value instanceof FormData || value instanceof URLSearchParams || value instanceof ReadableStream || typeof value === 'string';
}

function Payload() {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target.constructor, methodName, (instance, metadata, params, args) => {
      const value = args[parameterIndex];
      if (isBodyInit(value)) {
        params.payload = value;
      } else {
        params.headers.set('Content-Type', 'application/json');
        params.payload = JSON.stringify(value);
      }
    });
  };
}

const defaultConfig = {
  revalidate: {
    focus: true,
    reconnect: true,
    ifStale: true,
    events: []
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
const STATE_CHANGE_EVENT = 'stateChange';
const ERROR_EVENT = 'error';
const SUCCESS_EVENT = 'success';
class SWRInstance {
  get signal() {
    return this.abortController.signal;
  }
  constructor(key, fetcher, options = {}) {
    this.key = key;
    this.fetcher = fetcher;
    this.options = options;
    this.lastFetchTime = 0;
    this.currentRetryAttempt = 0;
    this.cleanupFns = [];
    this.abortController = new AbortController();
    this.events = new Events();
    this.config = Object.assign(Object.assign({}, defaultConfig), options);
    this.state = {
      data: options.initialData,
      isLoading: true,
      isValidating: false
    };
    this.initRevalidationStrategy();
    this.setupRefreshInterval();
  }
  onStateChange(listener) {
    return this.events.on(STATE_CHANGE_EVENT, listener);
  }
  setState(newState) {
    this.state = Object.assign(Object.assign({}, this.state), newState);
    this.events.emit(STATE_CHANGE_EVENT, this.state);
  }
  revalidate(reason) {
    return __awaiter(this, undefined, undefined, function* () {
      var _a, _b, _c, _d, _e, _f;
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
        const newData = yield this.fetcher(this.key);
        this.setState({
          data: newData,
          error: undefined,
          isLoading: false,
          isValidating: false
        });
        this.currentRetryAttempt = 0;
        this.events.emit(SUCCESS_EVENT, newData);
      } catch (err) {
        const error = err;
        this.setState({
          error,
          isLoading: false,
          isValidating: false
        });
        this.events.emit(ERROR_EVENT, error);
        // Retry logic
        if (this.config.retry && this.currentRetryAttempt < this.config.retry.maxAttempts) {
          const retryContext = {
            error,
            attempt: this.currentRetryAttempt + 1,
            timestamp: Date.now()
          };
          if (((_c = (_b = this.config.retry).shouldRetryOnError) === null || _c === undefined ? undefined : _c.call(_b, retryContext)) !== false) {
            this.currentRetryAttempt++;
            const delay = (_f = (_e = (_d = this.config.retry).calculateDelay) === null || _e === undefined ? undefined : _e.call(_d, this.currentRetryAttempt, error)) !== null && _f !== undefined ? _f : this.config.retry.interval * Math.pow(2, this.currentRetryAttempt - 1);
            setTimeout(() => this.revalidate(), delay);
          }
        }
      }
    });
  }
  initRevalidationStrategy() {
    var _a;
    const {
      focus,
      reconnect,
      events
    } = (_a = this.config.revalidate) !== null && _a !== undefined ? _a : {};
    if (typeof window === 'undefined') {
      return;
    }
    if (focus !== false) {
      window.addEventListener('focus', () => {
        this.revalidate('focus');
      }, {
        signal: this.signal
      });
    }
    if (reconnect) {
      window.addEventListener('online', () => {
        this.revalidate('reconnect');
      }, {
        signal: this.signal
      });
    }
    if (events) {
      events.forEach(event => {
        window.addEventListener(event, () => {
          this.revalidate(event);
        }, {
          signal: this.signal
        });
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
Object.assign(window, {
  SWRInstance
});

const EXTRA_METADATA_SWR_CONFIG = Symbol('swr-config');
const EXTRA_METADATA_MUTATE = Symbol('swr-mutate');
const EXTRA_METADATA_SWR_KEYGEN = Symbol('swr-key-gen');

function SWR(config = {}) {
  return decorateEndpointMethod((clazz, methodName, methodMetadata) => {
    methodMetadata.setExtra(EXTRA_METADATA_SWR_KEYGEN, config.key);
    methodMetadata.setExtra(EXTRA_METADATA_SWR_CONFIG, config);
  });
}

class SWRService {
  constructor() {
    this.instances = new Map();
  }
  obtainInstance(key) {
    return this.instances.get(key);
  }
  useSWR(keygen, fetcher, config) {
    const key = keygen();
    if (!this.instances.has(key)) {
      const instance = new SWRInstance(key, fetcher, config);
      this.instances.set(key, instance);
      return instance;
    } else {
      return this.instances.get(key);
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SWRMutation(_keygen) {
  return decorateEndpointMethod((clazz, methodName, methodMetadata) => {
    methodMetadata.setExtra(EXTRA_METADATA_MUTATE, true);
    methodMetadata.appendInterceptor({
      invoke: (instance, method, params, next) => __awaiter(this, undefined, undefined, function* () {
        const result = yield next(instance, method, params);
        const swrService = instance[APPLICATION_CONTEXT].getInstance(SWRService);
        const args = params.args;
        const key = (() => {
          if (typeof _keygen === 'string') {
            return _keygen;
          }
          if (typeof _keygen === 'function') {
            return _keygen(...args);
          }
          return method.resolveURL(params);
        })();
        const swrInstance = swrService.obtainInstance(key);
        swrInstance === null || swrInstance === undefined ? undefined : swrInstance.mutate();
        return result;
      })
    });
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Key(key) {
  return (target, propertyKey) => {
    const methodName = typeof propertyKey === 'object' ? propertyKey.name : propertyKey;
    const methodMetadata = EndpointMetadata.from(target.constructor).getMethodMetadata(methodName);
    methodMetadata.setExtra(EXTRA_METADATA_SWR_KEYGEN, key);
  };
}

const JSON_CONTENT_TYPES = ['application/json', 'application/json-patch+json', 'application/vnd.api+json', 'application/geo+json', 'application/schema+json'];
function isJSON(contentType) {
  return !!contentType && JSON_CONTENT_TYPES.some(type => contentType.includes(type));
}
function isText(contentType) {
  return !!contentType && /^text\/.*|application\/(javascript|ecmascript|xml|html|x-www-form-urlencoded)/i.test(contentType);
}
function isTextEventStream(contentType) {
  return !!contentType && contentType.includes('text/event-stream');
}

/**
 * Factory for creating HTTP status error instances
 */
const HttpStatusErrorFactory = {
  // Map of status codes to error class constructors
  errorMap: new Map([
  // Client errors (4xx)
  [400, BadRequestError], [401, UnauthorizedError], [402, PaymentRequiredError], [403, ForbiddenError], [404, NotFoundError], [405, MethodNotAllowedError], [406, NotAcceptableError], [407, ProxyAuthenticationRequiredError], [408, RequestTimeoutError], [409, ConflictError], [410, GoneError], [411, LengthRequiredError], [412, PreconditionFailedError], [413, PayloadTooLargeError], [414, URITooLongError], [415, UnsupportedMediaTypeError], [416, RangeNotSatisfiableError], [417, ExpectationFailedError], [418, ImATeapotError], [421, MisdirectedRequestError], [422, UnprocessableEntityError], [423, LockedError], [424, FailedDependencyError], [425, TooEarlyError], [426, UpgradeRequiredError], [428, PreconditionRequiredError], [429, TooManyRequestsError], [431, RequestHeaderFieldsTooLargeError], [451, UnavailableForLegalReasonsError],
  // Server errors (5xx)
  [500, InternalServerError], [501, NotImplementedError], [502, BadGatewayError], [503, ServiceUnavailableError], [504, GatewayTimeoutError], [505, HTTPVersionNotSupportedError], [506, VariantAlsoNegotiatesError], [507, InsufficientStorageError], [508, LoopDetectedError], [510, NotExtendedError], [511, NetworkAuthenticationRequiredError]]),
  /**
   * Create an appropriate HTTP status error instance based on the status code
   *
   * @param status HTTP status code
   * @param method HTTP method
   * @param headers HTTP headers
   * @param responseBody Response body
   * @returns An instance of the appropriate HTTP status error class
   */
  createError(status, method, headers, responseBody) {
    // Look up the error class in the map
    const ErrorClass = this.errorMap.get(status);
    if (ErrorClass) {
      return new ErrorClass(headers, responseBody);
    }
    // Handle server errors not in the map
    if (status >= 500) {
      return new ServerError(status, method, headers, responseBody);
    }
    // Generic HTTP status error for other codes
    return new HttpStatusError(status, method, headers, responseBody);
  }
};

var RequestStatus;
(function (RequestStatus) {
  RequestStatus[RequestStatus["IDLE"] = 0] = "IDLE";
  RequestStatus[RequestStatus["OPENED"] = 1] = "OPENED";
  RequestStatus[RequestStatus["LOADING"] = 2] = "LOADING";
  RequestStatus[RequestStatus["SUCCESS"] = 3] = "SUCCESS";
  RequestStatus[RequestStatus["ERROR"] = 4] = "ERROR";
  RequestStatus[RequestStatus["ABORTED"] = 5] = "ABORTED";
})(RequestStatus || (RequestStatus = {}));

let ResourceExecutionState = class ResourceExecutionState extends ReplaySubject {
  constructor() {
    super(1);
    this.messages = [];
    this.status = RequestStatus.IDLE;
    this.headers = new HttpHeaders();
    this.httpStatus = 0;
    this.abortController = new AbortController();
  }
  init() {
    this.subscribe({
      next: value => {
        this.data = value;
        this.messages = this.messages.concat(value);
      },
      error: err => {
        this.reason = err;
        this.status = err instanceof ResourceError && err.isAbortError ? RequestStatus.ABORTED : RequestStatus.ERROR;
      }
    });
  }
  headerReceived(headers, httpStatus) {
    this.headers = headers;
    this.httpStatus = httpStatus;
  }
  get idle() {
    return this.status === RequestStatus.IDLE;
  }
  get opened() {
    return this.status === RequestStatus.OPENED;
  }
  get loading() {
    return this.status === RequestStatus.LOADING;
  }
  get success() {
    return this.status === RequestStatus.SUCCESS;
  }
  get aborted() {
    return this.status === RequestStatus.ABORTED;
  }
  get failure() {
    return this.status === RequestStatus.ERROR;
  }
  reset() {
    this.status = RequestStatus.IDLE;
    this.headers.clear();
    this.httpStatus = 0;
    this.data = undefined;
    this.reason = null;
    this.messages = [];
  }
};
__decorate([Signal(), __metadata("design:type", Array)], ResourceExecutionState.prototype, "messages", undefined);
__decorate([Signal(), __metadata("design:type", Object)], ResourceExecutionState.prototype, "data", undefined);
__decorate([Signal(), __metadata("design:type", Object)], ResourceExecutionState.prototype, "reason", undefined);
__decorate([Signal(), __metadata("design:type", Number)], ResourceExecutionState.prototype, "status", undefined);
__decorate([PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], ResourceExecutionState.prototype, "init", null);
ResourceExecutionState = __decorate([Scope(InstanceScope.TRANSIENT), __metadata("design:paramtypes", [])], ResourceExecutionState);

const EXECUTE = Symbol('execute');
const SET_DATA = Symbol('setData');
const SET_ERROR = Symbol('setError');
const SETUP = Symbol('setup');
class Resource {
  constructor() {
    this.$state = new ReplaySubject(1);
    this.abortController = new AbortController();
  }
  get data() {
    var _a;
    return (_a = this.state) === null || _a === undefined ? undefined : _a.data;
  }
  get error() {
    var _a;
    return (_a = this.state) === null || _a === undefined ? undefined : _a.reason;
  }
  get messages() {
    var _a, _b;
    return (_b = (_a = this.state) === null || _a === undefined ? undefined : _a.messages) !== null && _b !== undefined ? _b : [];
  }
  get idle() {
    return this.state ? this.state.idle : true;
  }
  get opened() {
    return this.state ? this.state.opened : false;
  }
  get loading() {
    return this.state ? this.state.loading : false;
  }
  get success() {
    return this.state ? this.state.success : false;
  }
  get aborted() {
    return this.state ? this.state.aborted : false;
  }
  get failure() {
    return this.state ? this.state.failure : false;
  }
  init() {
    this.$state.subscribe({
      next: value => {
        this.state = value;
      }
    });
  }
  [SETUP](context) {
    if (this.context) {
      throw new Error('Unknown Error: Cannot setup resource more than once');
    }
    this.context = context;
  }
  wait() {
    return lastValueFrom(this.$state.pipe(switchMap(state => state), take(1)));
  }
  subscribe(observerOrNext) {
    return this.$state.subscribe(observerOrNext);
  }
  reload() {
    return __awaiter(this, arguments, undefined, function* (force = false) {
      if (this.context) {
        return this[EXECUTE](force);
      }
    });
  }
  [EXECUTE](force = false, state = this.ioc.getInstance(ResourceExecutionState)) {
    var _a;
    const context = this.context;
    if (!context) {
      throw new Error('Execution context is not setup!');
    }
    const lastExecutionAbortController = (_a = this.state) === null || _a === undefined ? undefined : _a.abortController;
    lastExecutionAbortController === null || lastExecutionAbortController === undefined ? undefined : lastExecutionAbortController.abort();
    this.$state.next(state);
    const {
      instance,
      method,
      params
    } = context;
    // Add force parameter to the request params
    const requestParams = Object.assign(Object.assign({}, params), {
      force
    });
    state.status = RequestStatus.LOADING;
    let signal = params.signal;
    if (signal) {
      signal = mergeAbortSignal(params.signal, this.abortController.signal);
    } else {
      signal = lastExecutionAbortController ? mergeAbortSignal(lastExecutionAbortController.signal, this.abortController.signal) : this.abortController.signal;
    }
    const allInterceptors = method.getAllInterceptors(instance);
    const sendRequest = allInterceptors.reduceRight((next, interceptor) => (instance, method, params) => {
      return interceptor.invoke(instance, method, params, next);
    }, (instance, method, params) => __awaiter(this, undefined, undefined, function* () {
      state.status = RequestStatus.OPENED;
      const response = yield method.invoke(instance, Object.assign(Object.assign({}, params), {
        signal
      }));
      state.status = RequestStatus.LOADING;
      return response;
    }));
    sendRequest(instance, method, requestParams).then(response => {
      return this.handleResponse(response, state);
    }).catch(error => {
      state.error(ResourceError.wrap(error));
    });
  }
  resolveResponseBody(response) {
    return __asyncGenerator(this, arguments, function* resolveResponseBody_1() {
      var _a;
      const headers = yield __await(response.headers());
      const contentType = (_a = headers.get('content-type')) === null || _a === undefined ? undefined : _a.join(', ');
      if (isJSON(contentType)) {
        try {
          yield yield __await(yield __await(response.json()));
        } catch (error) {
          // Handle JSON parsing error
          if (error instanceof SyntaxError) {
            const parseError = new ParseError('Failed to parse JSON response', error);
            throw parseError;
          }
          throw error;
        }
      } else if (isText(contentType)) {
        yield yield __await(response.text());
      } else if (isTextEventStream(contentType)) {
        yield __await(yield* __asyncDelegator(__asyncValues(response.textStream())));
      } else {
        const byteStream = yield __await(response.body());
        yield yield __await(byteStream.readAsBlob());
      }
    });
  }
  handleResponse(response, state) {
    return __awaiter(this, undefined, undefined, function* () {
      var _a, e_1, _b, _c;
      const httpStatus = yield response.status();
      state.headerReceived(yield response.headers(), httpStatus);
      if (httpStatus < 200 || httpStatus >= 400) {
        yield this.handleHttpErrorResponse(response);
      } else {
        try {
          for (var _d = true, _e = __asyncValues(this.resolveResponseBody(response)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
            _c = _f.value;
            _d = false;
            const data = _c;
            state.next(data);
          }
        } catch (e_1_1) {
          e_1 = {
            error: e_1_1
          };
        } finally {
          try {
            if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        state.status = RequestStatus.SUCCESS;
        state.complete();
      }
    });
  }
  handleHttpErrorResponse(response) {
    return __awaiter(this, undefined, undefined, function* () {
      var _a, e_2, _b, _c;
      var _d;
      const httpStatus = yield response.status();
      const headers = yield response.headers();
      const contentType = (_d = headers.get('content-type')) === null || _d === undefined ? undefined : _d.join(', ');
      const datas = [];
      try {
        for (var _e = true, _f = __asyncValues(this.resolveResponseBody(response)), _g; _g = yield _f.next(), _a = _g.done, !_a; _e = true) {
          _c = _g.value;
          _e = false;
          const data = _c;
          datas.push(data);
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (!_e && !_a && (_b = _f.return)) yield _b.call(_f);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
      const responseBody = isTextEventStream(contentType) ? datas : datas[0];
      // Use the factory to create the appropriate HTTP status error
      const httpError = HttpStatusErrorFactory.createError(httpStatus, response.init.method.toString(), headers, responseBody);
      throw httpError;
    });
  }
}
__decorate([Signal(), __metadata("design:type", ResourceExecutionState)], Resource.prototype, "state", undefined);
__decorate([Inject(), __metadata("design:type", ApplicationContext)], Resource.prototype, "ioc", undefined);
__decorate([PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], Resource.prototype, "init", null);

class ArgumentsTracker {
  track(args, callback) {
    const hasAccessor = !!args.find(it => typeof it === 'function');
    if (!hasAccessor) {
      callback(args);
      return () => {};
    }
    return runWithSolidiumOwner(this, () => {
      const owner = getOwner();
      let _dispose = () => {};
      createRoot(dispose => {
        _dispose = dispose;
        const trigger = leading(debounce, resolvedArgs => {
          for (let i = 0; i < args.length; i++) {
            if (typeof args[i] === 'function') {
              if (resolvedArgs[i] === null || resolvedArgs[i] === undefined) {
                return;
              }
            }
          }
          callback(resolvedArgs);
        });
        createEffect(on(args.map(it => {
          if (typeof it === 'function') {
            return it;
          }
          return () => it;
        }), trigger));
      }, owner);
      return () => {
        _dispose();
      };
    });
  }
}

function execute(args, ResourceType) {
  const context = getExecutionContext();
  if (!context) {
    throw new Error('Unknown error!');
  }
  const appCtx = context.instance[APPLICATION_CONTEXT];
  const methodMetadata = context.method.metadata;
  const isReactive = methodMetadata.isReactive();
  const tracker = appCtx.getInstance(ArgumentsTracker);
  const resource = appCtx.getInstance(ResourceType);
  resource[SETUP](context);
  const dispose = tracker.track(args, args => {
    const executionHandlers = methodMetadata.getExecutionHandlers();
    const {
      instance,
      method,
      params
    } = context;
    executionHandlers.forEach(handler => {
      handler(instance, method, params, args);
    });
    resource[EXECUTE]();
    if (!isReactive) {
      Promise.resolve().then(() => {
        dispose();
      });
    }
  });
  return resource;
}

let RestfulResource = class RestfulResource extends Resource {
  [EXECUTE](force = false) {
    var _a;
    const context = this.context;
    if (!context) {
      throw new Error('Execution context is not setup!');
    }
    const args = context.params.args;
    const methodMetadata = context.method.metadata;
    const _keygen = methodMetadata.getExtra(EXTRA_METADATA_SWR_KEYGEN);
    const mutate = (_a = methodMetadata.getExtra(EXTRA_METADATA_MUTATE)) !== null && _a !== undefined ? _a : false;
    const swrConfig = methodMetadata.getExtra(EXTRA_METADATA_SWR_CONFIG);
    if (mutate && swrConfig) {
      throw new Error('@SWR and @SWRMutation cannot be used together');
    }
    if (!swrConfig) {
      const state = this.ioc.getInstance(ResourceExecutionState);
      return super[EXECUTE](force, state);
    }
    const keygen = () => {
      if (typeof _keygen === 'string') {
        return _keygen;
      }
      if (typeof _keygen === 'function') {
        return _keygen(...args);
      }
      return context.method.resolveURL(context.params);
    };
    const instance = this.swrService.useSWR(keygen, () => {
      const state = this.ioc.getInstance(ResourceExecutionState);
      super[EXECUTE](force, state);
      return lastValueFrom(state).then(() => state);
    }, swrConfig);
    instance === null || instance === undefined ? undefined : instance.onStateChange(state => {
      this.state = state.data;
    });
  }
};
__decorate([Inject(), __metadata("design:type", SWRService)], RestfulResource.prototype, "swrService", undefined);
RestfulResource = __decorate([Scope(InstanceScope.TRANSIENT)], RestfulResource);

function restful(...args) {
  return execute(args, RestfulResource);
}

let JSONSSEResource = class JSONSSEResource extends Resource {
  resolveResponseBody(response) {
    const _super = Object.create(null, {
      resolveResponseBody: {
        get: () => super.resolveResponseBody
      }
    });
    return __asyncGenerator(this, arguments, function* resolveResponseBody_1() {
      var _a;
      const headers = yield __await(response.headers());
      const contentType = (_a = headers.get('content-type')) === null || _a === undefined ? undefined : _a.join(', ');
      if (isTextEventStream(contentType)) {
        yield __await(yield* __asyncDelegator(__asyncValues(response.jsonStream())));
      } else {
        yield __await(yield* __asyncDelegator(__asyncValues(_super.resolveResponseBody.call(this, response))));
      }
    });
  }
};
JSONSSEResource = __decorate([Scope(InstanceScope.TRANSIENT)], JSONSSEResource);

function jsonsse(...args) {
  const context = getExecutionContext();
  if (!context) {
    throw new Error('No request context. Make sure to call `request` only within endpoint methods.');
  }
  context.params.adapter = FetchRequestAdapter;
  return execute(args, JSONSSEResource);
}

class ProgressiveResource extends Resource {
  constructor() {
    super(...arguments);
    this.progress = new Progress(0, 0);
  }
  updateProgress(progress) {
    this.progress = progress;
  }
}
__decorate([Signal(), __metadata("design:type", Progress)], ProgressiveResource.prototype, "progress", undefined);

let DownloadResource = class DownloadResource extends ProgressiveResource {
  handleResponse(response, state) {
    const _super = Object.create(null, {
      handleResponse: {
        get: () => super.handleResponse
      }
    });
    return __awaiter(this, undefined, undefined, function* () {
      // Set up progress tracking
      response.onDownload(progress => {
        this.updateProgress(progress);
      });
      return _super.handleResponse.call(this, response, state);
    });
  }
  updateProgress(progress) {
    this.progress = progress;
  }
  resolveResponseBody(response) {
    return __asyncGenerator(this, arguments, function* resolveResponseBody_1() {
      yield yield __await(response.body());
    });
  }
};
__decorate([Signal(), __metadata("design:type", Progress)], DownloadResource.prototype, "progress", undefined);
DownloadResource = __decorate([Scope(InstanceScope.TRANSIENT)], DownloadResource);

function download(...args) {
  return execute(args, DownloadResource);
}

class UploadResource extends ProgressiveResource {
  constructor() {
    super(...arguments);
    this.progress = new Progress(0, 0);
  }
  updateProgress(progress) {
    this.progress = progress;
  }
  handleResponse(response, state) {
    const _super = Object.create(null, {
      handleResponse: {
        get: () => super.handleResponse
      }
    });
    return __awaiter(this, undefined, undefined, function* () {
      response.onUpload(progress => {
        this.updateProgress(progress);
      });
      return _super.handleResponse.call(this, response, state);
    });
  }
}
__decorate([Signal(), __metadata("design:type", Progress)], UploadResource.prototype, "progress", undefined);

function upload(...args) {
  return execute(args, UploadResource);
}

/**
 * Creates a time-based caching policy with a fixed TTL
 *
 * @param ttl The time-to-live in milliseconds
 * @param name The name of the policy
 * @returns A new cache policy
 */
function createTimeBasedPolicy(ttl, name = `TimeBasedPolicy(${ttl}ms)`) {
  return {
    name,
    shouldCache: () => true,
    getTTL: () => ttl,
    isValid: entry => entry.expiresAt > Date.now()
  };
}
const CachePolicies = {
  /**
   * Default caching policy - caches for 5 minutes
   */
  Default: createTimeBasedPolicy(5 * 60 * 1000, 'Default')};

const DEFAULT_CACHE_CONFIG = {
  policy: CachePolicies.Default,
  respectCacheControl: true
};

/**
 * An interceptor that caches HTTP responses and serves them from cache when appropriate.
 *
 * By default, it only caches GET requests and respects Cache-Control headers.
 *
 * @example
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com'
 * })
 * class ExampleAPI {
 *   @Get('/user/:id')
 *   @Cache({
 *     Policies.createTimeBasedPolicy(60 * 1000)
 *   })
 *   getUser(id: string) {
 *     return restful(id);
 *   }
 * }
 * ```
 */
class CacheInterceptor {
  static createWithConfig(config = {}) {
    class SubCacheInterceptor extends CacheInterceptor {
      constructor() {
        super(config);
      }
    }
    return SubCacheInterceptor;
  }
  get policy() {
    var _a;
    return (_a = this.config.policy) !== null && _a !== undefined ? _a : CachePolicies.Default;
  }
  constructor(config = {}) {
    this.config = Object.assign(Object.assign({}, DEFAULT_CACHE_CONFIG), config);
  }
  getBucket() {
    return __awaiter(this, undefined, undefined, function* () {
      var _a, _b;
      if (this.bucket) {
        return this.bucket;
      }
      const bucketName = (_a = this.config.bucketName) !== null && _a !== undefined ? _a : (_b = this.httpConfig) === null || _b === undefined ? undefined : _b.cacheBucket;
      if (bucketName) {
        try {
          this.bucket = this.appCtx.getInstance(bucketName);
          return this.bucket;
        } catch (_c) {
          // Bucket not found, fall back to default
        }
      }
      this.bucket = this.appCtx.getInstance(DEFAULT_BUCKET);
      return this.bucket;
    });
  }
  generateCacheKey(method, params) {
    if (this.config.generateKey) {
      return this.config.generateKey(method, params);
    }
    // Default cache key generation
    const url = method.resolveURL(params);
    return `http-cache:${url}`;
  }
  shouldCache(method, params) {
    if (params.force) {
      return false;
    }
    if (this.config.shouldCache) {
      return this.config.shouldCache(method, params);
    }
    return this.policy.shouldCache(method, params);
  }
  getExpirationFromHeaders(headers) {
    if (!this.config.respectCacheControl) {
      return null;
    }
    const cacheControl = headers.get('cache-control');
    if (!cacheControl) {
      return null;
    }
    // Parse Cache-Control header
    const directives = cacheControl.map(d => d.trim());
    // Check for no-cache or no-store directives
    if (directives.includes('no-cache') || directives.includes('no-store')) {
      return 0; // Don't cache
    }
    // Check for max-age directive
    const maxAgeDirective = directives.find(d => d.startsWith('max-age='));
    if (maxAgeDirective) {
      const maxAge = parseInt(maxAgeDirective.split('=')[1], 10);
      if (!isNaN(maxAge)) {
        return Date.now() + maxAge * 1000;
      }
    }
    return null;
  }
  invoke(instance, method, params, next) {
    return __awaiter(this, undefined, undefined, function* () {
      // Skip caching for non-cacheable methods or when force=true
      if (!this.shouldCache(method, params)) {
        return next(instance, method, params);
      }
      const cacheKey = this.generateCacheKey(method, params);
      const bucket = yield this.getBucket();
      // Try to get from cache
      const cachedEntry = yield bucket.getItem(cacheKey);
      if (cachedEntry && this.policy.isValid(cachedEntry, method, params)) {
        // Cache hit and not expired
        const {
          response
        } = cachedEntry;
        // Create a response from the cached data
        const headers = new HttpHeaders(response.headers);
        // Create a new HttpResponse from the cached data
        return HttpResponse.of(Promise.resolve(new BlobByteStream(new Blob([response.body]))), headers, response.status, method);
      }
      // Cache miss or expired, make the actual request
      const response = yield next(instance, method, params);
      // Only cache successful responses
      const status = yield response.status();
      if (status >= 200 && status < 300) {
        response.onBodyComplete(body => __awaiter(this, undefined, undefined, function* () {
          var _a, _b, _c;
          const headers = yield response.headers();
          const bodyArrayBuffer = yield body.readAsBuffer();
          // Determine expiration time
          const headerExpiration = this.getExpirationFromHeaders(headers);
          const ttl = this.policy.getTTL(method, params);
          const expiresAt = headerExpiration !== null && headerExpiration !== undefined ? headerExpiration : ttl === 0 ? 0 : Date.now() + ttl;
          // Don't cache if expiration is 0 (no-cache)
          if (expiresAt > 0) {
            const cacheEntry = {
              response: {
                status,
                headers: headers.toJSON(),
                body: new Uint8Array(bodyArrayBuffer)
              },
              cachedAt: Date.now(),
              expiresAt,
              metadata: {}
            };
            // use policy to override cache metadata
            const overrideEntry = (_c = (_b = (_a = this.policy).overrideCacheEntry) === null || _b === undefined ? undefined : _b.call(_a, cacheEntry, method, params)) !== null && _c !== undefined ? _c : cacheEntry;
            // Store in cache
            yield bucket.setItem(cacheKey, overrideEntry);
          }
        }));
      }
      return response;
    });
  }
}
__decorate([Inject(), __metadata("design:type", ApplicationContext)], CacheInterceptor.prototype, "appCtx", undefined);
__decorate([Inject(DEFAULT_HTTP_CONFIGURATION), __metadata("design:type", Object)], CacheInterceptor.prototype, "httpConfig", undefined);

/**
 * Decorator that applies the CacheInterceptor to an endpoint method.
 *
 * @example
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com'
 * })
 * class ExampleAPI {
 *   @Get('/users/{id}')
 *   @Cache({
 *     policy: CachePolicies.createTimeBasedPolicy(60 * 1000) // 1 minute cache
 *   })
 *   getUser(id: number) {
 *     return restful<User>();
 *   }
 * }
 * ```
 */
function Cache(config = DEFAULT_CACHE_CONFIG) {
  return decorateEndpointMethod((clazz, methodName, methodMetadata) => {
    methodMetadata.appendInterceptor(CacheInterceptor.createWithConfig(config));
  });
}

export { AbortError, BadGatewayError, BadRequestError, Cache, CacheInterceptor, CachePolicies, CancellationError, CircuitBreakerError, CircuitBreakerInterceptor, ConflictError, DEFAULT_CACHE_CONFIG, Defer, Delete, EXECUTE, Endpoint, ErrorContextInterceptor, Events, ExpectationFailedError, FailedDependencyError, FetchRequestAdapter, ForbiddenError, GatewayTimeoutError, Get, GoneError, HTTPVersionNotSupportedError, Header, HttpError, HttpHeaders, HttpResponse, HttpStatusError, ImATeapotError, InsufficientStorageError, InternalServerError, Key, LengthRequiredError, LockedError, LoopDetectedError, MaxRetryAttemptsReachedError, MethodNotAllowedError, MisdirectedRequestError, NetworkAuthenticationRequiredError, NetworkError, NotAcceptableError, NotExtendedError, NotFoundError, NotImplementedError, ParseError, PathVariable, Payload, PayloadTooLargeError, PaymentRequiredError, Post, PreconditionFailedError, PreconditionRequiredError, Progress, PromiseStatus, ProxyAuthenticationRequiredError, Put, Query, RangeNotSatisfiableError, Request, RequestHeaderFieldsTooLargeError, RequestMethod, RequestStatus, RequestTimeoutError, Resource, ResourceError, RestfulResource, RetryInterceptor, SETUP, SET_DATA, SET_ERROR, SWR, SWRInstance, SWRMutation, ServerError, ServiceUnavailableError, TimeoutError, TimeoutInterceptor, TooEarlyError, TooManyRequestsError, URITooLongError, UnauthorizedError, UnavailableForLegalReasonsError, UnprocessableEntityError, UnsupportedMediaTypeError, UpgradeRequiredError, VariantAlsoNegotiatesError, XMLHttpRequestAdapter, buildEndpointClass, createRequestDecorator, download, isInterceptor, isInterceptorConstructor, isURL, joinPath, jsonsse, mergeAbortSignal, parseHeaders, resolveURL, restful, upload };
//# sourceMappingURL=index.es.js.map
