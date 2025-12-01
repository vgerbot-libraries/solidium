import { Inject, Factory, Generate, ApplicationContext, PostInject, Scope, InstanceScope } from '@vgerbot/ioc';
import { lazyMember } from '@vgerbot/lazy';
import { Persistence, DEFAULT_BUCKET, Bucket } from '@vgerbot/persistence';
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
            if (o && i >= o.length) o = void 0;
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

/**
 * Represents an HTTP response with utilities for parsing and streaming data.
 *
 * This class wraps the low-level {@link HttpSource} and provides convenient
 * methods for accessing response data in various formats:
 * - Plain text (`text()`)
 * - JSON (`json()`)
 * - Streaming text (`textStream()`)
 * - Streaming JSON/SSE (`jsonStream()`)
 * - Raw byte stream (`body()`)
 *
 * It also provides access to:
 * - Response status code
 * - Response headers
 * - Upload/download progress tracking
 *
 * Instances are typically created automatically by the framework and accessed
 * through the Resource abstraction or interceptors.
 *
 * @example
 * Accessing response in an interceptor:
 * ```typescript
 * class LoggingInterceptor implements Interceptor {
 *   async invoke(instance, method, params, next) {
 *     const response = await next(instance, method, params);
 *     const status = await response.status();
 *     const headers = await response.headers();
 *     console.log(`Response ${status}:`, headers.toJSON());
 *     return response;
 *   }
 * }
 * ```
 *
 * @example
 * Creating a response manually (e.g., for testing):
 * ```typescript
 * const response = HttpResponse.of(
 *   Promise.resolve(new BlobByteStream(new Blob(['{"data": "value"}']))),
 *   new HttpHeaders({ 'Content-Type': 'application/json' }),
 *   200,
 *   method
 * );
 *
 * const data = await response.json();
 * ```
 */
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
    return __awaiter(this, void 0, void 0, function* () {
      const stream = yield this.body();
      const buffer = yield stream.readAsBuffer();
      const decoder = new TextDecoder(encoding);
      return decoder.decode(buffer);
    });
  }
  json() {
    return __awaiter(this, void 0, void 0, function* () {
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
    Array.from(array).reduce((acc, item) => __awaiter(this, void 0, void 0, function* () {
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
    const listeners = (_a = this.listeners.get(event)) !== null && _a !== void 0 ? _a : new Set();
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
    (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.forEach(listener => {
      listener(...args);
    });
  }
}

/**
 * Manages HTTP headers with support for multiple values per header name.
 *
 * This class provides a convenient API for working with HTTP headers, supporting:
 * - Multiple values for the same header name
 * - Conversion to/from native `Headers` object
 * - Header merging and concatenation
 * - JSON serialization
 *
 * Unlike the native `Headers` class, this implementation:
 * - Stores values as arrays, allowing explicit multiple values
 * - Provides a fluent, chainable API
 * - Supports various initialization formats
 *
 * @example
 * Creating headers:
 * ```typescript
 * const headers = new HttpHeaders();
 * headers.set('Content-Type', 'application/json');
 * headers.set('Accept', 'application/json', 'text/plain');
 * ```
 *
 * @example
 * From object:
 * ```typescript
 * const headers = new HttpHeaders({
 *   'Content-Type': 'application/json',
 *   'Accept': ['application/json', 'text/plain']
 * });
 * ```
 *
 * @example
 * Merging headers:
 * ```typescript
 * const baseHeaders = new HttpHeaders({ 'Authorization': 'Bearer token' });
 * const requestHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
 * const combined = baseHeaders.concat(requestHeaders);
 * ```
 */
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
    const originValues = (_a = this.headers.get(name)) !== null && _a !== void 0 ? _a : [];
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
    const [contentLengthStr] = (_a = this.get('content-length')) !== null && _a !== void 0 ? _a : [];
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

function createProgressiveReadableStream(stream, progress = () => void 0) {
  let loaded = 0;
  const abortController = new AbortController();
  return new ReadableStream({
    start: controller => __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
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
  if (!(rawHeaders === null || rawHeaders === void 0 ? void 0 : rawHeaders.trim())) {
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
    const values = (_a = result.get(key)) !== null && _a !== void 0 ? _a : [];
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
    this.executeRequestIfNeed = () => __awaiter(this, void 0, void 0, function* () {
      this.executeRequestIfNeed = () => void 0;
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
        this.bodyDefer.resolve(new BlobByteStream((_a = xhr.response) !== null && _a !== void 0 ? _a : new Blob([])));
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
    return __awaiter(this, void 0, void 0, function* () {
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
      return (_b = (_a = pathVariables[variableName]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : fullMatch;
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
 * Base class for all HTTP-related errors in the library.
 *
 * This abstract class serves as the foundation for all HTTP error types, including:
 * - Network errors (timeouts, connection failures, aborts)
 * - HTTP status errors (4xx, 5xx)
 * - Parse errors (invalid JSON, etc.)
 * - Custom application errors
 *
 * All HTTP errors extend this base class, making it easy to catch and handle
 * any HTTP-related error with a single catch block.
 *
 * The library provides specific error classes for:
 * - **General Errors**: {@link TimeoutError}, {@link NetworkError}, {@link AbortError}, {@link ParseError}
 * - **Status Errors**: {@link HttpStatusError} and its subclasses
 * - **Client Errors (4xx)**: {@link BadRequestError}, {@link UnauthorizedError}, {@link NotFoundError}, etc.
 * - **Server Errors (5xx)**: {@link InternalServerError}, {@link ServiceUnavailableError}, etc.
 *
 * @example
 * Catching all HTTP errors:
 * ```typescript
 * try {
 *   const resource = api.getData();
 *   await resource.wait();
 * } catch (error) {
 *   if (error instanceof HttpError) {
 *     console.error('HTTP error occurred:', error.message);
 *     if (error.cause) {
 *       console.error('Caused by:', error.cause);
 *     }
 *   }
 * }
 * ```
 *
 * @example
 * Handling specific error types:
 * ```typescript
 * try {
 *   await api.getData().wait();
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     console.error('Request timed out');
 *   } else if (error instanceof UnauthorizedError) {
 *     // Redirect to login
 *   } else if (error instanceof NotFoundError) {
 *     // Show 404 page
 *   } else if (error instanceof HttpStatusError) {
 *     // Handle other HTTP status errors
 *     console.error(`HTTP ${error.status}: ${error.message}`);
 *   }
 * }
 * ```
 *
 * @example
 * Custom error handling in interceptor:
 * ```typescript
 * class ErrorHandlerInterceptor implements Interceptor {
 *   async invoke(instance, method, params, next) {
 *     try {
 *       return await next(instance, method, params);
 *     } catch (error) {
 *       if (error instanceof HttpError) {
 *         // Log to error tracking service
 *         errorTracker.captureException(error);
 *       }
 *       throw error;
 *     }
 *   }
 * }
 * ```
 */
class HttpError extends Error {
  /**
   * Creates a new HTTP error.
   *
   * @param message - Human-readable error message
   * @param cause - Optional underlying error that caused this error
   */
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
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
      if (error instanceof HttpStatusError) {
        return this.retryableStatuses.includes(error.status);
      }
      return true;
    });
  }
};
/**
 * Interceptor that automatically retries failed HTTP requests with exponential backoff.
 *
 * This interceptor implements intelligent retry logic for transient failures such as
 * network timeouts, temporary server errors (5xx), or connection issues. It uses
 * exponential backoff to gradually increase the delay between retries, reducing
 * server load while maximizing the chance of eventual success.
 *
 * Default behavior:
 * - Retries up to 3 times
 * - Uses exponential backoff starting at 1 second, doubling each retry
 * - Caps maximum delay at 10 seconds
 * - Retries on HTTP status codes: 408 (Timeout), 500, 502, 503, 504 (Server Errors)
 *
 * @example
 * Using default retry configuration:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [RetryInterceptor]
 * })
 * class API {
 *   @Get('/unstable-endpoint')
 *   getData() {
 *     return restful<Data>();
 *   }
 * }
 * // Automatically retries up to 3 times on failure
 * ```
 *
 * @example
 * Custom retry configuration:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [
 *     new RetryInterceptor({
 *       maxAttempts: 5,
 *       initialDelay: 500,
 *       maxDelay: 30000,
 *       retryableStatuses: [408, 429, 500, 502, 503, 504],
 *       async retryable(error) {
 *         // Custom retry logic
 *         if (error instanceof NetworkError) return true;
 *         if (error instanceof TimeoutError) return true;
 *         return false;
 *       }
 *     })
 *   ]
 * })
 * class API { }
 * ```
 *
 * @example
 * Method-specific retry:
 * ```typescript
 * @Get('/data')
 * @Request({
 *   retry: {
 *     maxAttempts: 5,
 *     initialDelay: 2000
 *   }
 * })
 * getData() {
 *   return restful<Data>();
 * }
 * ```
 */
class RetryInterceptor {
  constructor(config = {}) {
    this.config = Object.assign(Object.assign({}, DEFAULT_CONFIG$2), config);
  }
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  invoke(instance, method, params, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
/**
 * Interceptor that enforces a timeout on HTTP requests.
 *
 * This interceptor automatically aborts requests that take longer than the specified
 * timeout duration, preventing requests from hanging indefinitely. It's essential for
 * maintaining application responsiveness and resource management.
 *
 * The timeout is implemented using AbortController, which properly cancels the underlying
 * network request rather than just ignoring the response.
 *
 * Default behavior:
 * - Timeout after 30 seconds
 * - Throws {@link TimeoutError} when timeout is reached
 * - Properly aborts the underlying request
 *
 * @example
 * Global timeout for all endpoints:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   timeout: 10000  // 10 seconds
 * })
 * class API {
 *   @Get('/data')
 *   getData() {
 *     return restful<Data>();
 *   }
 * }
 * ```
 *
 * @example
 * Method-specific timeout:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class API {
 *   @Get('/fast-endpoint')
 *   @Request({ timeout: 5000 })  // 5 seconds
 *   getFastData() {
 *     return restful<Data>();
 *   }
 *
 *   @Get('/slow-endpoint')
 *   @Request({ timeout: 60000 })  // 60 seconds
 *   getSlowData() {
 *     return restful<Data>();
 *   }
 * }
 * ```
 *
 * @example
 * Handling timeout errors:
 * ```typescript
 * const resource = api.getData();
 *
 * try {
 *   await resource.wait();
 * } catch (error) {
 *   if (error instanceof TimeoutError) {
 *     console.error('Request timed out after', error.context.timeout, 'ms');
 *     // Show timeout message to user
 *   }
 * }
 * ```
 *
 * @example
 * Disable timeout for specific request:
 * ```typescript
 * @Get('/long-running-task')
 * @Request({ timeout: 0 })  // No timeout
 * startLongTask() {
 *   return restful<Task>();
 * }
 * ```
 */
class TimeoutInterceptor {
  constructor(config = {}) {
    this.config = Object.assign(Object.assign({}, DEFAULT_CONFIG$1), config);
  }
  invoke(instance, method, params, next) {
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
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
    return (_a = instance[METHODS]) === null || _a === void 0 ? void 0 : _a.get(name);
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
    return __awaiter(this, void 0, void 0, function* () {
      const adapter = this.createAdapter(instance, params);
      const source = yield adapter.execute();
      return new HttpResponse(source, {
        method: this
      });
    });
  }
  resolveURL(params) {
    var _a;
    return resolveURL(this.url, (_a = params.pathVariables) !== null && _a !== void 0 ? _a : {}, params.queryParams);
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
    const adapter = new ((_c = (_b = (_a = params.adapter) !== null && _a !== void 0 ? _a : this.metadata.getAdapter()) !== null && _b !== void 0 ? _b : instance[ADAPTER]) !== null && _c !== void 0 ? _c : XMLHttpRequestAdapter)(options);
    return adapter;
  }
}

const DEFAULT_CONFIG = {
  threshold: 5,
  resetTimeout: 60000 // 1 minute
};
/**
 * Interceptor implementing the Circuit Breaker pattern to prevent cascading failures.
 *
 * The Circuit Breaker pattern protects your application from repeatedly trying to execute
 * an operation that's likely to fail. When failures reach a threshold, the circuit "opens"
 * and subsequent requests fail immediately without attempting the actual call. After a
 * timeout period, the circuit enters a "half-open" state to test if the service has recovered.
 *
 * Circuit States:
 * - **CLOSED**: Normal operation. Requests pass through. Failures are counted.
 * - **OPEN**: Too many failures occurred. Requests fail immediately with {@link CircuitBreakerError}.
 * - **HALF_OPEN**: Testing recovery. One request is allowed through. Success closes the circuit,
 *   failure reopens it.
 *
 * Default behavior:
 * - Opens circuit after 5 consecutive failures
 * - Attempts to reset after 60 seconds
 *
 * This pattern is essential for:
 * - Preventing resource exhaustion from repeated failed requests
 * - Allowing failing services time to recover
 * - Failing fast instead of blocking threads/resources
 * - Improving overall system resilience
 *
 * @example
 * Basic usage with default configuration:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [CircuitBreakerInterceptor]
 * })
 * class API {
 *   @Get('/flaky-service')
 *   getData() {
 *     return restful<Data>();
 *   }
 * }
 *
 * // After 5 failures, subsequent calls fail immediately for 60 seconds
 * ```
 *
 * @example
 * Custom configuration:
 * ```typescript
 * const customCircuitBreaker = CircuitBreakerInterceptor.of({
 *   threshold: 3,        // Open after 3 failures
 *   resetTimeout: 30000  // Try again after 30 seconds
 * });
 *
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   interceptors: [customCircuitBreaker]
 * })
 * class API { }
 * ```
 *
 * @example
 * Handling circuit breaker errors:
 * ```typescript
 * try {
 *   const resource = api.getData();
 *   await resource.wait();
 * } catch (error) {
 *   if (error instanceof CircuitBreakerError) {
 *     console.log('Service temporarily unavailable');
 *     // Show cached data or fallback UI
 *   }
 * }
 * ```
 */
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
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
      if (this.blobPromise !== null) {
        return this.blobPromise;
      }
      const total = this.contentLength;
      let loaded = 0;
      this.blobPromise = new Promise((resolve, reject) => {
        const chunks = [];
        this.updateProgress(new Progress(total, 0));
        (() => __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
      const blob = yield this.readAsStoredBlob();
      return yield blob.arrayBuffer();
    });
  }
  readAsStream() {
    return new ReadableStream({
      start: controller => __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, arguments, void 0, function* (contentType = 'application/octet-stream') {
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
      this.executeRequestIfNeed = () => void 0;
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
    return __awaiter(this, void 0, void 0, function* () {
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
          return () => void 0;
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
function keep(...args) {
  return args;
}
class Http {
  static configure(config) {
    class HttpConfigurationFactory {
      produce() {
        var _a;
        (_a = config.cacheBucket) !== null && _a !== void 0 ? _a : config.cacheBucket = this.defaultBucket.name;
        return config;
      }
    }
    __decorate([Inject(), __metadata("design:type", Persistence)], HttpConfigurationFactory.prototype, "persistence", void 0);
    __decorate([Inject(DEFAULT_BUCKET), __metadata("design:type", Bucket)], HttpConfigurationFactory.prototype, "defaultBucket", void 0);
    __decorate([Factory(DEFAULT_HTTP_CONFIGURATION), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], HttpConfigurationFactory.prototype, "produce", null);
    keep(HttpConfigurationFactory);
    return Http;
  }
  init() {}
}

function buildEndpointClass(endpointClass, metadata) {
  Reflect.set(endpointClass.prototype, GET_INTERCEPTORS, function (exclude) {
    var _a, _b;
    const globalInterceptors = (_b = (_a = this[HTTP_CONFIGURATION]) === null || _a === void 0 ? void 0 : _a.interceptors) !== null && _b !== void 0 ? _b : [];
    return [...globalInterceptors, ...metadata.getInterceptors()].filter(it => !(exclude === null || exclude === void 0 ? void 0 : exclude.includes(it))).map(identifier => {
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
  lazyMember(endpointInstance => {
    return endpointInstance[APPLICATION_CONTEXT].getInstance(DEFAULT_HTTP_CONFIGURATION);
  })(endpointClass.prototype, HTTP_CONFIGURATION);
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
    headers.setAll((_a = this.options.headers) !== null && _a !== void 0 ? _a : {});
    return headers;
  }
  getTimeout() {
    var _a;
    return (_a = this.options.timeout) !== null && _a !== void 0 ? _a : 0;
  }
  getInterceptors() {
    var _a;
    return ((_a = this.options.interceptors) !== null && _a !== void 0 ? _a : []).concat(this.externalInterceptors);
  }
  getExcludeInterceptors() {
    var _a;
    return (_a = this.options.excludeInterceptors) !== null && _a !== void 0 ? _a : [];
  }
  getAdapter() {
    return this.options.adapter;
  }
  isReactive() {
    var _a;
    return (_a = this.options.reactive) !== null && _a !== void 0 ? _a : true;
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
      this.baseURL = (_a = endpointOptions.baseURL) !== null && _a !== void 0 ? _a : parent.baseURL;
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
    this.baseURL = joinPath(this.baseURL, (_b = endpointOptions.path) !== null && _b !== void 0 ? _b : '');
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
    return (_a = this.interceptors) !== null && _a !== void 0 ? _a : [];
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

/**
 * Decorator that marks a class as an HTTP endpoint and configures its base settings.
 *
 * Use this decorator to define a class that represents a collection of related HTTP API endpoints.
 * It configures the base URL, common headers, interceptors, and other settings that apply to all
 * methods within the class.
 *
 * @param options - Configuration options for the endpoint
 * @param options.baseURL - The base URL for all HTTP requests in this endpoint
 * @param options.path - Optional path segment to append to the base URL
 * @param options.timeout - Optional default timeout in milliseconds for all requests
 * @param options.headers - Optional default headers to include in all requests
 * @param options.adapter - Optional custom adapter for making HTTP requests
 * @param options.interceptors - Optional array of interceptors to apply to all requests
 * @param options.extends - Optional parent endpoint class to inherit configuration from
 *
 * @example
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com',
 *   path: '/v1/users',
 *   headers: {
 *     'Authorization': 'Bearer token'
 *   }
 * })
 * class UserAPI {
 *   @Get('/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 * ```
 *
 * @example
 * Extending another endpoint:
 * ```typescript
 * @Endpoint({
 *   baseURL: 'https://api.example.com'
 * })
 * class BaseAPI {}
 *
 * @Endpoint({
 *   extends: BaseAPI,
 *   path: '/users'
 * })
 * class UserAPI extends BaseAPI {
 *   // Methods here...
 * }
 * ```
 *
 * @returns A class decorator
 */
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

/**
 * Decorator that marks a method as an HTTP GET request handler.
 *
 * Use this decorator to define a method that performs an HTTP GET request.
 * GET requests are typically used to retrieve data from the server.
 *
 * @param options - Either a string path or a configuration object
 * @param options.path - The URL path for the request (can include path variables like `{id}`)
 * @param options.headers - Optional headers to include in the request
 * @param options.interceptors - Optional interceptors to apply to this specific request
 * @param options.excludeInterceptors - Optional interceptors to exclude from this request
 * @param options.timeout - Optional timeout in milliseconds for this request
 * @param options.retry - Optional retry configuration for failed requests
 * @param options.adapter - Optional custom adapter for this request
 *
 * @example
 * Simple usage with path string:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 * ```
 *
 * @example
 * Advanced usage with options:
 * ```typescript
 * @Get({
 *   path: '/users/{id}',
 *   timeout: 5000,
 *   headers: { 'Accept': 'application/json' },
 *   retry: { maxAttempts: 3 }
 * })
 * getUser(@PathVariable('id') id: string) {
 *   return restful<User>(id);
 * }
 * ```
 *
 * @returns A method decorator
 */
function Get(options) {
  return createRequestDecorator(options, 'GET');
}

/**
 * Decorator that marks a method as an HTTP POST request handler.
 *
 * Use this decorator to define a method that performs an HTTP POST request.
 * POST requests are typically used to create new resources or submit data to the server.
 *
 * @param options - Either a string path or a configuration object
 * @param options.path - The URL path for the request
 * @param options.headers - Optional headers to include in the request
 * @param options.interceptors - Optional interceptors to apply to this specific request
 * @param options.timeout - Optional timeout in milliseconds for this request
 * @param options.retry - Optional retry configuration for failed requests
 *
 * @example
 * Creating a new user:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Post('/users')
 *   createUser(@Payload() user: CreateUserDto) {
 *     return restful<User>(user);
 *   }
 * }
 * ```
 *
 * @example
 * With custom headers:
 * ```typescript
 * @Post({
 *   path: '/users',
 *   headers: { 'Content-Type': 'application/json' }
 * })
 * createUser(@Payload() user: CreateUserDto) {
 *   return restful<User>(user);
 * }
 * ```
 *
 * @returns A method decorator
 */
function Post(options) {
  return createRequestDecorator(options, 'POST');
}

/**
 * Decorator that marks a method as an HTTP PUT request handler.
 *
 * Use this decorator to define a method that performs an HTTP PUT request.
 * PUT requests are typically used to update existing resources on the server.
 *
 * @param options - Either a string path or a configuration object
 * @param options.path - The URL path for the request (can include path variables)
 * @param options.headers - Optional headers to include in the request
 * @param options.interceptors - Optional interceptors to apply to this specific request
 * @param options.timeout - Optional timeout in milliseconds for this request
 *
 * @example
 * Updating a user:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Put('/users/{id}')
 *   updateUser(
 *     @PathVariable('id') id: string,
 *     @Payload() user: UpdateUserDto
 *   ) {
 *     return restful<User>(id, user);
 *   }
 * }
 * ```
 *
 * @returns A method decorator
 */
function Put(options) {
  return createRequestDecorator(options, 'PUT');
}

/**
 * Decorator that marks a method as an HTTP DELETE request handler.
 *
 * Use this decorator to define a method that performs an HTTP DELETE request.
 * DELETE requests are typically used to remove resources from the server.
 *
 * @param options - Either a string path or a configuration object
 * @param options.path - The URL path for the request (can include path variables)
 * @param options.headers - Optional headers to include in the request
 * @param options.interceptors - Optional interceptors to apply to this specific request
 * @param options.timeout - Optional timeout in milliseconds for this request
 *
 * @example
 * Deleting a user:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Delete('/users/{id}')
 *   deleteUser(@PathVariable('id') id: string) {
 *     return restful<void>(id);
 *   }
 * }
 * ```
 *
 * @returns A method decorator
 */
function Delete(options) {
  return createRequestDecorator(options, 'DELETE');
}

function appendExecHandler(target, methodName, handler) {
  const metadata = EndpointMetadata.from(target).getMethodMetadata(methodName);
  metadata === null || metadata === void 0 ? void 0 : metadata.appendExecutionHandler(handler);
}

/**
 * Parameter decorator that binds a method parameter to an HTTP request header.
 *
 * Use this decorator to dynamically set HTTP headers based on method parameters.
 * This is useful for headers that vary per request, such as authorization tokens,
 * custom API keys, or content negotiation headers.
 *
 * @param name - The name of the HTTP header (e.g., 'Authorization', 'X-API-Key')
 * @param defaultValue - Optional default value(s) to use if the parameter is undefined
 *
 * @example
 * Dynamic authorization header:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(
 *     @PathVariable('id') id: string,
 *     @Header('Authorization') token: string
 *   ) {
 *     return restful<User>(id, token);
 *   }
 * }
 *
 * // Usage:
 * api.getUser('123', 'Bearer abc123');
 * // GET /users/123
 * // Authorization: Bearer abc123
 * ```
 *
 * @example
 * With default value:
 * ```typescript
 * @Get('/data')
 * getData(
 *   @Header('Accept', 'application/json') accept?: string
 * ) {
 *   return restful<Data>(accept);
 * }
 * ```
 *
 * @example
 * Multiple header values:
 * ```typescript
 * @Get('/data')
 * getData(
 *   @Header('Accept') acceptTypes: string[]
 * ) {
 *   return restful<Data>(acceptTypes);
 * }
 *
 * // Usage:
 * api.getData(['application/json', 'application/xml']);
 * ```
 *
 * @returns A parameter decorator
 */
function Header(name, defaultValue) {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target.constructor, methodName, (instance, metadata, params, args) => {
      var _a;
      const value = (_a = args[parameterIndex]) !== null && _a !== void 0 ? _a : defaultValue;
      if (value) {
        params.headers.append(name, ...(Array.isArray(value) ? value : [value]));
      }
    });
  };
}

/**
 * Parameter decorator that binds a method parameter to a path variable in the URL.
 *
 * Use this decorator to extract values from URL path segments (e.g., `/users/{id}`).
 * The decorated parameter value will replace the corresponding placeholder in the path.
 *
 * @param name - The name of the path variable in the URL template (e.g., 'id' for '/users/{id}')
 * @param defaultValue - Optional default value to use if the parameter is undefined
 *
 * @example
 * Basic usage:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // Usage:
 * const api = container.getInstance(UserAPI);
 * api.getUser('123'); // GET https://api.example.com/users/123
 * ```
 *
 * @example
 * With default value:
 * ```typescript
 * @Get('/users/{id}/posts/{postId}')
 * getUserPost(
 *   @PathVariable('id') userId: string,
 *   @PathVariable('postId', 'latest') postId?: string
 * ) {
 *   return restful<Post>(userId, postId);
 * }
 * ```
 *
 * @returns A parameter decorator
 */
function PathVariable(name, defaultValue) {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target.constructor, methodName, (instance, metadata, params, args) => {
      const value = args[parameterIndex];
      params.pathVariables[name] = (value !== null && value !== void 0 ? value : defaultValue) + '';
    });
  };
}

/**
 * Parameter decorator that binds a method parameter to a URL query parameter.
 *
 * Use this decorator to add query parameters to the request URL (e.g., `?page=1&limit=10`).
 * The decorated parameter value will be serialized and appended to the query string.
 * Supports both single values and arrays for multiple values with the same parameter name.
 *
 * @param name - The name of the query parameter
 * @param defaultValue - Optional default value to use if the parameter is undefined
 *
 * @example
 * Single query parameter:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users')
 *   getUsers(
 *     @Query('page') page: number,
 *     @Query('limit', 10) limit?: number
 *   ) {
 *     return restful<User[]>(page, limit);
 *   }
 * }
 *
 * // Usage:
 * api.getUsers(1, 20); // GET /users?page=1&limit=20
 * api.getUsers(2);     // GET /users?page=2&limit=10
 * ```
 *
 * @example
 * Array query parameter:
 * ```typescript
 * @Get('/users')
 * getUsers(@Query('ids') ids: string[]) {
 *   return restful<User[]>(ids);
 * }
 *
 * // Usage:
 * api.getUsers(['1', '2', '3']); // GET /users?ids=1&ids=2&ids=3
 * ```
 *
 * @returns A parameter decorator
 */
function Query(name, defaultValue) {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target.constructor, methodName, (instance, metadata, params, args) => {
      var _a;
      const value = (_a = args[parameterIndex]) !== null && _a !== void 0 ? _a : defaultValue;
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

/**
 * Parameter decorator that binds a method parameter to the HTTP request body.
 *
 * Use this decorator to specify which parameter should be sent as the request body payload.
 * The decorator automatically handles JSON serialization for plain objects and supports
 * standard body types like Blob, FormData, and ArrayBuffer.
 *
 * For plain objects, the decorator will:
 * - Automatically set `Content-Type: application/json` header
 * - JSON-stringify the object
 *
 * For BodyInit types (Blob, FormData, ArrayBuffer, etc.), the value is sent as-is.
 *
 * @example
 * Creating a resource with JSON payload:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Post('/users')
 *   createUser(@Payload() user: CreateUserDto) {
 *     return restful<User>(user);
 *   }
 * }
 *
 * // Usage:
 * api.createUser({ name: 'John', email: 'john@example.com' });
 * // POST /users
 * // Content-Type: application/json
 * // Body: {"name":"John","email":"john@example.com"}
 * ```
 *
 * @example
 * Uploading a file with FormData:
 * ```typescript
 * @Post('/users/{id}/avatar')
 * uploadAvatar(
 *   @PathVariable('id') id: string,
 *   @Payload() formData: FormData
 * ) {
 *   return upload<{ url: string }>(id, formData);
 * }
 *
 * // Usage:
 * const formData = new FormData();
 * formData.append('file', fileBlob);
 * api.uploadAvatar('123', formData);
 * ```
 *
 * @returns A parameter decorator
 */
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
/**
 * Manages the lifecycle and state of a single SWR (Stale-While-Revalidate) cache entry.
 *
 * An SWR instance represents a single cached API request with its associated configuration.
 * It handles:
 * - Initial data fetching and loading state
 * - Automatic revalidation on focus, reconnect, or custom events
 * - Background revalidation while serving stale data
 * - Request deduplication to prevent redundant fetches
 * - Error retry with exponential backoff
 * - Automatic polling/refresh at intervals
 * - Manual cache mutation and revalidation
 *
 * Instances are typically created and managed automatically by the {@link SWR} decorator
 * through the {@link SWRService}, but can also be created manually for advanced use cases.
 *
 * @template T - The type of data managed by this SWR instance
 *
 * @example
 * Automatic usage via decorator (recommended):
 * ```typescript
 * @Get('/users/{id}')
 * @SWR({ revalidate: { focus: true } })
 * getUser(@PathVariable('id') id: string) {
 *   return restful<User>(id);
 * }
 *
 * // SWRInstance is created and managed automatically
 * const resource = api.getUser('123');
 * ```
 *
 * @example
 * Manual instance creation (advanced):
 * ```typescript
 * const swrInstance = new SWRInstance<User>(
 *   'user-123',
 *   async (key) => {
 *     const response = await fetch(`/api/users/${key.split('-')[1]}`);
 *     return response.json();
 *   },
 *   {
 *     revalidate: { focus: true, reconnect: true },
 *     staleTime: 60000
 *   }
 * );
 *
 * // Listen to state changes
 * swrInstance.onStateChange((state) => {
 *   console.log('Data:', state.data);
 *   console.log('Loading:', state.isLoading);
 * });
 * ```
 */
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
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b, _c, _d, _e, _f;
      const now = Date.now();
      // Deduping
      const dedupingInterval = (_a = this.config.dedupingInterval) !== null && _a !== void 0 ? _a : 2000;
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
          if (((_c = (_b = this.config.retry).shouldRetryOnError) === null || _c === void 0 ? void 0 : _c.call(_b, retryContext)) !== false) {
            this.currentRetryAttempt++;
            const delay = (_f = (_e = (_d = this.config.retry).calculateDelay) === null || _e === void 0 ? void 0 : _e.call(_d, this.currentRetryAttempt, error)) !== null && _f !== void 0 ? _f : this.config.retry.interval * Math.pow(2, this.currentRetryAttempt - 1);
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
    } = (_a = this.config.revalidate) !== null && _a !== void 0 ? _a : {};
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
    if (((_a = this.config.refresh) === null || _a === void 0 ? void 0 : _a.interval) && this.config.refresh.interval > 0) {
      this.refreshInterval = setInterval(() => {
        var _a, _b;
        if (document.hidden && !((_a = this.config.refresh) === null || _a === void 0 ? void 0 : _a.whenHidden) || !navigator.onLine && !((_b = this.config.refresh) === null || _b === void 0 ? void 0 : _b.whenOffline)) {
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

/**
 * Decorator that enables SWR (Stale-While-Revalidate) pattern for an endpoint method.
 *
 * The SWR pattern provides:
 * - **Automatic caching**: Responses are cached and reused for subsequent requests
 * - **Background revalidation**: Cached data is served immediately while fresh data is fetched in the background
 * - **Focus revalidation**: Automatically refetches when the window regains focus
 * - **Network recovery**: Automatically refetches when network connection is restored
 * - **Polling**: Optional automatic refresh at specified intervals
 * - **Deduplication**: Multiple requests with the same key are deduplicated
 *
 * This significantly improves user experience by showing cached data instantly while ensuring
 * data freshness through background updates.
 *
 * @param config - SWR configuration options
 * @param config.key - Optional custom cache key (string or function)
 * @param config.revalidate - Revalidation triggers configuration
 * @param config.revalidate.focus - Auto revalidate on window focus (default: true)
 * @param config.revalidate.reconnect - Auto revalidate on network recovery (default: true)
 * @param config.revalidate.events - Custom events that trigger revalidation
 * @param config.refresh - Automatic refresh configuration
 * @param config.refresh.interval - Polling interval in milliseconds (0 to disable)
 * @param config.refresh.whenHidden - Continue polling when window is invisible
 * @param config.refresh.whenOffline - Continue polling when offline
 * @param config.retry - Error retry configuration
 * @param config.staleTime - Time in milliseconds before data becomes stale
 * @param config.dedupingInterval - Deduplication interval in milliseconds
 *
 * @example
 * Basic usage with default config:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   @SWR()
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // First call: fetches from server
 * const resource1 = api.getUser('123');
 *
 * // Second call: returns cached data immediately, revalidates in background
 * const resource2 = api.getUser('123');
 * ```
 *
 * @example
 * With custom revalidation settings:
 * ```typescript
 * @Get('/notifications')
 * @SWR({
 *   revalidate: {
 *     focus: true,        // Revalidate on window focus
 *     reconnect: true,    // Revalidate on network recovery
 *     events: ['user-action'] // Revalidate on custom events
 *   }
 * })
 * getNotifications() {
 *   return restful<Notification[]>();
 * }
 * ```
 *
 * @example
 * With polling:
 * ```typescript
 * @Get('/status')
 * @SWR({
 *   refresh: {
 *     interval: 5000,      // Poll every 5 seconds
 *     whenHidden: false,   // Pause when tab is hidden
 *     whenOffline: false   // Pause when offline
 *   }
 * })
 * getSystemStatus() {
 *   return restful<SystemStatus>();
 * }
 * ```
 *
 * @example
 * With custom cache key:
 * ```typescript
 * @Get('/users/{id}')
 * @SWR({
 *   key: (id: string) => `user-profile-${id}`,
 *   staleTime: 60000  // Consider data stale after 1 minute
 * })
 * getUser(@PathVariable('id') id: string) {
 *   return restful<User>(id);
 * }
 * ```
 *
 * @returns A method decorator
 *
 * @see {@link SWRConfig} for detailed configuration options
 * @see {@link SWRMutation} for invalidating SWR cache after mutations
 */
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

/**
 * Decorator that marks a mutation method and automatically invalidates related SWR cache.
 *
 * Use this decorator on mutation methods (POST, PUT, DELETE) that modify server data.
 * After the mutation completes successfully, it automatically triggers revalidation
 * of the specified SWR cache key, ensuring that all components using that cached data
 * receive fresh updates.
 *
 * This is essential for maintaining data consistency between read and write operations
 * in applications using the SWR pattern.
 *
 * @param _keygen - Cache key identifier for the SWR instance to invalidate
 *                  - Can be a static string matching an {@link SWR} decorator's key
 *                  - Can be a function that generates the key based on method arguments
 *
 * @example
 * Basic usage with static key:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   // Read operation with SWR caching
 *   @Get('/users/{id}')
 *   @SWR({ key: 'user-profile' })
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 *
 *   // Write operation that invalidates the cache
 *   @Put('/users/{id}')
 *   @SWRMutation('user-profile')
 *   updateUser(
 *     @PathVariable('id') id: string,
 *     @Payload() data: UpdateUserDto
 *   ) {
 *     return restful<User>(id, data);
 *   }
 * }
 *
 * // Usage:
 * // 1. Initial fetch - data is cached
 * const userResource = api.getUser('123');
 *
 * // 2. Update user - cache is automatically invalidated and refetched
 * await api.updateUser('123', { name: 'Jane' }).wait();
 *
 * // 3. userResource automatically receives updated data
 * ```
 *
 * @example
 * With dynamic key generator:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class PostAPI {
 *   @Get('/users/{userId}/posts')
 *   @SWR({ key: (userId: string) => `user-${userId}-posts` })
 *   getUserPosts(@PathVariable('userId') userId: string) {
 *     return restful<Post[]>(userId);
 *   }
 *
 *   @Post('/users/{userId}/posts')
 *   @SWRMutation((userId: string) => `user-${userId}-posts`)
 *   createPost(
 *     @PathVariable('userId') userId: string,
 *     @Payload() post: CreatePostDto
 *   ) {
 *     return restful<Post>(userId, post);
 *   }
 *
 *   @Delete('/posts/{postId}')
 *   @SWRMutation((postId: string, userId: string) => `user-${userId}-posts`)
 *   deletePost(
 *     @PathVariable('postId') postId: string,
 *     @Query('userId') userId: string
 *   ) {
 *     return restful(postId, userId);
 *   }
 * }
 *
 * // When a post is created or deleted, the post list is automatically refreshed
 * ```
 *
 * @example
 * Multiple related caches:
 * ```typescript
 * // If you need to invalidate multiple caches, you can compose multiple decorators
 * // or handle it manually in the method
 * @Post('/comments')
 * @SWRMutation('comments-list')
 * createComment(@Payload() comment: CreateCommentDto) {
 *   return restful<Comment>(comment);
 * }
 * ```
 *
 * @returns A method decorator that adds cache invalidation behavior
 *
 * @see {@link SWR} for the corresponding read operation decorator
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function SWRMutation(_keygen) {
  return decorateEndpointMethod((clazz, methodName, methodMetadata) => {
    methodMetadata.setExtra(EXTRA_METADATA_MUTATE, true);
    methodMetadata.appendInterceptor({
      invoke: (instance, method, params, next) => __awaiter(this, void 0, void 0, function* () {
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
        swrInstance === null || swrInstance === void 0 ? void 0 : swrInstance.mutate();
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
__decorate([Signal(), __metadata("design:type", Array)], ResourceExecutionState.prototype, "messages", void 0);
__decorate([Signal(), __metadata("design:type", Object)], ResourceExecutionState.prototype, "data", void 0);
__decorate([Signal(), __metadata("design:type", Object)], ResourceExecutionState.prototype, "reason", void 0);
__decorate([Signal(), __metadata("design:type", Number)], ResourceExecutionState.prototype, "status", void 0);
__decorate([PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], ResourceExecutionState.prototype, "init", null);
ResourceExecutionState = __decorate([Scope(InstanceScope.TRANSIENT), __metadata("design:paramtypes", [])], ResourceExecutionState);

/**
 * @internal Symbol for executing the resource
 */
const EXECUTE = Symbol('execute');
/**
 * @internal Symbol for setting data
 */
const SET_DATA = Symbol('setData');
/**
 * @internal Symbol for setting error
 */
const SET_ERROR = Symbol('setError');
/**
 * @internal Symbol for setup
 */
const SETUP = Symbol('setup');
/**
 * Abstract base class for all HTTP request resources.
 *
 * A Resource represents an HTTP request with reactive state management, providing:
 * - **Reactive state**: All state properties (data, loading, error, etc.) are reactive signals
 * - **Observable pattern**: Subscribe to state changes via RxJS Observables
 * - **Promise interface**: Wait for completion with `wait()` method
 * - **Lifecycle management**: Automatic abort controller and cleanup
 * - **Type safety**: Strong TypeScript typing for request/response data
 *
 * The Resource class is the foundation of the library's reactive HTTP layer, integrating
 * seamlessly with Solid.js components through signal-based reactivity.
 *
 * Resource lifecycle states (exposed as reactive properties):
 * - `idle`: Initial state before request starts
 * - `loading`: Request is in progress
 * - `opened`: Connection established (for streaming)
 * - `success`: Request completed successfully
 * - `failure`: Request failed with an error
 * - `aborted`: Request was aborted
 *
 * Specialized resource types:
 * - {@link RestfulResource}: Standard REST API calls with optional SWR
 * - {@link DownloadResource}: File downloads with progress tracking
 * - {@link UploadResource}: File uploads with progress tracking
 * - {@link JSONSSEResource}: Server-Sent Events with JSON parsing
 * - {@link TextSSEResource}: Server-Sent Events with text streaming
 *
 * @template T - The type of data returned by the request
 * @template B - The type of error body (defaults to unknown)
 *
 * @example
 * Using a resource in a Solid component:
 * ```typescript
 * function UserProfile(props: { userId: string }) {
 *   const api = useService(UserAPI);
 *   const userResource = api.getUser(props.userId);
 *
 *   return (
 *     <Show
 *       when={!userResource.loading}
 *       fallback={<div>Loading...</div>}
 *     >
 *       <Show
 *         when={userResource.success}
 *         fallback={<div>Error: {userResource.error?.message}</div>}
 *       >
 *         <div>Name: {userResource.data?.name}</div>
 *       </Show>
 *     </Show>
 *   );
 * }
 * ```
 *
 * @example
 * Subscribing to state changes:
 * ```typescript
 * const resource = api.getData();
 *
 * resource.subscribe((state) => {
 *   console.log('State changed:', {
 *     loading: state.loading,
 *     data: state.data,
 *     error: state.reason
 *   });
 * });
 * ```
 *
 * @example
 * Waiting for completion:
 * ```typescript
 * const resource = api.createUser(userData);
 *
 * try {
 *   const state = await resource.wait();
 *   if (state.success) {
 *     console.log('User created:', state.data);
 *   }
 * } catch (error) {
 *   console.error('Failed to create user:', error);
 * }
 * ```
 *
 * @example
 * Manual reload:
 * ```typescript
 * const resource = api.getData();
 *
 * // Later, reload the data
 * resource.reload(true); // force=true bypasses cache
 * ```
 */
class Resource {
  constructor() {
    this.$state = new ReplaySubject(1);
    this.abortController = new AbortController();
  }
  get data() {
    var _a;
    return (_a = this.state) === null || _a === void 0 ? void 0 : _a.data;
  }
  get error() {
    var _a;
    return (_a = this.state) === null || _a === void 0 ? void 0 : _a.reason;
  }
  get messages() {
    var _a, _b;
    return (_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.messages) !== null && _b !== void 0 ? _b : [];
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
    return __awaiter(this, arguments, void 0, function* (force = false) {
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
    const lastExecutionAbortController = (_a = this.state) === null || _a === void 0 ? void 0 : _a.abortController;
    lastExecutionAbortController === null || lastExecutionAbortController === void 0 ? void 0 : lastExecutionAbortController.abort();
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
    }, (instance, method, params) => __awaiter(this, void 0, void 0, function* () {
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
      const contentType = (_a = headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.join(', ');
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
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
      var _a, e_2, _b, _c;
      var _d;
      const httpStatus = yield response.status();
      const headers = yield response.headers();
      const contentType = (_d = headers.get('content-type')) === null || _d === void 0 ? void 0 : _d.join(', ');
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
__decorate([Signal(), __metadata("design:type", ResourceExecutionState)], Resource.prototype, "state", void 0);
__decorate([Inject(), __metadata("design:type", ApplicationContext)], Resource.prototype, "ioc", void 0);
__decorate([PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], Resource.prototype, "init", null);

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

/**
 * Resource implementation for standard RESTful HTTP requests.
 *
 * This is the primary resource type used by the {@link restful} execution function
 * for standard REST API calls (GET, POST, PUT, DELETE, etc.). It extends the base
 * {@link Resource} class with:
 * - SWR (Stale-While-Revalidate) integration
 * - Automatic cache management
 * - Background revalidation
 * - Cache mutation support
 *
 * When decorated with {@link SWR}, RestfulResource automatically:
 * - Caches responses based on a unique key
 * - Serves cached data immediately while revalidating in the background
 * - Revalidates on focus, reconnect, or custom events
 * - Deduplicates concurrent requests with the same key
 * - Provides automatic polling/refresh capabilities
 *
 * The resource integrates with the {@link SWRService} to manage cache instances
 * and coordinate updates across multiple components using the same data.
 *
 * @template T - The type of response data
 * @template E - The type of error body (defaults to unknown)
 *
 * @example
 * Basic RESTful request (no SWR):
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // Usage
 * const resource = api.getUser('123');
 * // Fetches fresh data every time
 * ```
 *
 * @example
 * With SWR caching and revalidation:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   @SWR({
 *     key: (id) => `user-${id}`,
 *     revalidate: { focus: true, reconnect: true },
 *     staleTime: 60000  // Consider stale after 1 minute
 *   })
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // First call: fetches from server
 * const resource1 = api.getUser('123');
 *
 * // Second call: returns cached data, revalidates in background
 * const resource2 = api.getUser('123');
 * ```
 *
 * @example
 * Mutation with automatic cache invalidation:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   @SWR({ key: (id) => `user-${id}` })
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 *
 *   @Put('/users/{id}')
 *   @SWRMutation((id: string) => `user-${id}`)
 *   updateUser(
 *     @PathVariable('id') id: string,
 *     @Payload() data: UpdateUserDto
 *   ) {
 *     return restful<User>(id, data);
 *   }
 * }
 *
 * // When updateUser completes, the getUser cache is automatically invalidated
 * ```
 *
 * @see {@link Resource} for the base class documentation
 * @see {@link SWR} for caching configuration
 * @see {@link SWRMutation} for cache invalidation
 * @see {@link restful} for the execution function
 */
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
    const mutate = (_a = methodMetadata.getExtra(EXTRA_METADATA_MUTATE)) !== null && _a !== void 0 ? _a : false;
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
    instance === null || instance === void 0 ? void 0 : instance.onStateChange(state => {
      this.state = state.data;
    });
  }
};
__decorate([Inject(), __metadata("design:type", SWRService)], RestfulResource.prototype, "swrService", void 0);
RestfulResource = __decorate([Scope(InstanceScope.TRANSIENT)], RestfulResource);

/**
 * Executes a RESTful HTTP request and returns a reactive resource.
 *
 * This is the primary execution function for standard REST API calls (GET, POST, PUT, DELETE).
 * It returns a {@link RestfulResource} that provides reactive state management and integrates
 * with SWR (stale-while-revalidate) pattern when configured.
 *
 * The returned resource exposes:
 * - `data`: The response data (reactive)
 * - `error`: Any error that occurred (reactive)
 * - `loading`: Loading state indicator (reactive)
 * - `success`: Success state indicator (reactive)
 * - `failure`: Failure state indicator (reactive)
 * - `reload()`: Method to manually reload the request
 * - `wait()`: Promise that resolves when the request completes
 *
 * @template T - The expected response data type
 * @template A - The arguments tuple type (automatically inferred)
 * @param args - Arguments to pass through to the execution context (typically unused in the function body)
 *
 * @returns A reactive {@link RestfulResource} containing request state and data
 *
 * @example
 * Basic usage with GET request:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class UserAPI {
 *   @Get('/users/{id}')
 *   getUser(@PathVariable('id') id: string) {
 *     return restful<User>(id);
 *   }
 * }
 *
 * // In component:
 * const api = useService(UserAPI);
 * const resource = api.getUser('123');
 *
 * // Access reactive state:
 * createEffect(() => {
 *   if (resource.loading) console.log('Loading...');
 *   if (resource.success) console.log('User:', resource.data);
 *   if (resource.failure) console.log('Error:', resource.error);
 * });
 * ```
 *
 * @example
 * With POST request:
 * ```typescript
 * @Post('/users')
 * createUser(@Payload() user: CreateUserDto) {
 *   return restful<User>(user);
 * }
 *
 * // Usage:
 * const resource = api.createUser({ name: 'John', email: 'john@example.com' });
 * await resource.wait(); // Wait for completion
 * ```
 *
 * @example
 * With SWR pattern:
 * ```typescript
 * @Get('/users/{id}')
 * @SWR({ revalidate: { focus: true } })
 * getUser(@PathVariable('id') id: string) {
 *   return restful<User>(id);
 * }
 * // Automatically revalidates when window regains focus
 * ```
 */
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
      const contentType = (_a = headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.join(', ');
      if (isTextEventStream(contentType)) {
        yield __await(yield* __asyncDelegator(__asyncValues(response.jsonStream())));
      } else {
        yield __await(yield* __asyncDelegator(__asyncValues(_super.resolveResponseBody.call(this, response))));
      }
    });
  }
};
JSONSSEResource = __decorate([Scope(InstanceScope.TRANSIENT)], JSONSSEResource);

/**
 * Executes a Server-Sent Events (SSE) request that streams JSON objects.
 *
 * Use this function for real-time streaming endpoints that send JSON data over SSE.
 * Each server-sent event will be automatically parsed as JSON and made available through
 * the {@link JSONSSEResource}. The resource accumulates all received messages in the
 * `messages` array while also providing the latest message in `data`.
 *
 * This function automatically uses the {@link FetchRequestAdapter} which is required
 * for streaming responses.
 *
 * The returned resource exposes:
 * - `data`: The most recent JSON message received
 * - `messages`: Array of all JSON messages received so far
 * - `loading`, `success`, `failure`: State indicators
 * - `opened`: Indicates if the SSE connection is established
 *
 * @template T - The type of JSON objects in the SSE stream
 * @param args - Arguments to pass through to the execution context
 *
 * @returns A {@link JSONSSEResource} for handling the SSE stream
 *
 * @throws {Error} If called outside of an endpoint method context
 *
 * @example
 * Live updates stream:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class EventAPI {
 *   @Get('/events/stream')
 *   streamEvents(@Query('topic') topic: string) {
 *     return jsonsse<EventData>(topic);
 *   }
 * }
 *
 * interface EventData {
 *   id: string;
 *   type: string;
 *   payload: unknown;
 * }
 *
 * // Usage:
 * const resource = api.streamEvents('notifications');
 *
 * // Access latest message:
 * createEffect(() => {
 *   const latestEvent = resource.data;
 *   if (latestEvent) {
 *     console.log('New event:', latestEvent);
 *   }
 * });
 *
 * // Access all messages:
 * createEffect(() => {
 *   console.log('All events:', resource.messages);
 * });
 * ```
 *
 * @example
 * Real-time chat:
 * ```typescript
 * @Get('/chat/{roomId}/messages')
 * streamMessages(@PathVariable('roomId') roomId: string) {
 *   return jsonsse<ChatMessage>(roomId);
 * }
 *
 * interface ChatMessage {
 *   id: string;
 *   author: string;
 *   text: string;
 *   timestamp: number;
 * }
 *
 * // Usage:
 * const resource = api.streamMessages('room-123');
 *
 * // Render all messages:
 * <For each={resource.messages}>
 *   {(message) => <div>{message.author}: {message.text}</div>}
 * </For>
 * ```
 *
 * @see {@link JSONSSEResource} for more details on the resource type
 */
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
__decorate([Signal(), __metadata("design:type", Progress)], ProgressiveResource.prototype, "progress", void 0);

let DownloadResource = class DownloadResource extends ProgressiveResource {
  handleResponse(response, state) {
    const _super = Object.create(null, {
      handleResponse: {
        get: () => super.handleResponse
      }
    });
    return __awaiter(this, void 0, void 0, function* () {
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
__decorate([Signal(), __metadata("design:type", Progress)], DownloadResource.prototype, "progress", void 0);
DownloadResource = __decorate([Scope(InstanceScope.TRANSIENT)], DownloadResource);

/**
 * Executes a file download request with progress tracking.
 *
 * Use this function for downloading files from the server. It returns a {@link DownloadResource}
 * that provides download progress tracking in addition to standard resource state management.
 *
 * The returned resource exposes:
 * - `data`: The downloaded file as a {@link ByteStream}
 * - `progress`: Download progress information (bytes downloaded, total size, percentage)
 * - `loading`, `success`, `failure`: State indicators
 * - Standard resource methods and properties
 *
 * @param args - Arguments to pass through to the execution context
 *
 * @returns A {@link DownloadResource} with progress tracking capabilities
 *
 * @example
 * Downloading a file:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class FileAPI {
 *   @Get('/files/{id}/download')
 *   downloadFile(@PathVariable('id') fileId: string) {
 *     return download(fileId);
 *   }
 * }
 *
 * // Usage:
 * const resource = api.downloadFile('abc123');
 *
 * // Track progress:
 * createEffect(() => {
 *   const progress = resource.progress;
 *   if (progress) {
 *     console.log(`Downloaded: ${progress.percentage}%`);
 *   }
 * });
 *
 * // Get the file when complete:
 * resource.wait().then(state => {
 *   const blob = state.data?.readAsBlob();
 *   // Create download link, etc.
 * });
 * ```
 *
 * @example
 * Save downloaded file:
 * ```typescript
 * const resource = api.downloadFile('report.pdf');
 * await resource.wait();
 *
 * const blob = await resource.data?.readAsBlob();
 * const url = URL.createObjectURL(blob);
 * const link = document.createElement('a');
 * link.href = url;
 * link.download = 'report.pdf';
 * link.click();
 * ```
 */
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
    return __awaiter(this, void 0, void 0, function* () {
      response.onUpload(progress => {
        this.updateProgress(progress);
      });
      return _super.handleResponse.call(this, response, state);
    });
  }
}
__decorate([Signal(), __metadata("design:type", Progress)], UploadResource.prototype, "progress", void 0);

/**
 * Executes a file upload request with progress tracking.
 *
 * Use this function for uploading files to the server. It returns an {@link UploadResource}
 * that provides upload progress tracking in addition to standard resource state management.
 *
 * The returned resource exposes:
 * - `data`: The response from the server after upload completes
 * - `progress`: Upload progress information (bytes uploaded, total size, percentage)
 * - `loading`, `success`, `failure`: State indicators
 * - Standard resource methods and properties
 *
 * @param args - Arguments to pass through to the execution context
 *
 * @returns An {@link UploadResource} with progress tracking capabilities
 *
 * @example
 * Uploading a file with FormData:
 * ```typescript
 * @Endpoint({ baseURL: 'https://api.example.com' })
 * class FileAPI {
 *   @Post('/files/upload')
 *   uploadFile(@Payload() formData: FormData) {
 *     return upload<{ fileId: string; url: string }>(formData);
 *   }
 * }
 *
 * // Usage:
 * const formData = new FormData();
 * formData.append('file', fileBlob, 'document.pdf');
 * formData.append('category', 'reports');
 *
 * const resource = api.uploadFile(formData);
 *
 * // Track upload progress:
 * createEffect(() => {
 *   const progress = resource.progress;
 *   if (progress) {
 *     console.log(`Uploaded: ${progress.percentage}%`);
 *     console.log(`${progress.loaded} / ${progress.total} bytes`);
 *   }
 * });
 *
 * // Handle completion:
 * resource.wait().then(state => {
 *   if (state.success) {
 *     console.log('File uploaded:', state.data);
 *   }
 * });
 * ```
 *
 * @example
 * With avatar upload:
 * ```typescript
 * @Post('/users/{id}/avatar')
 * uploadAvatar(
 *   @PathVariable('id') userId: string,
 *   @Payload() formData: FormData
 * ) {
 *   return upload<{ avatarUrl: string }>(userId, formData);
 * }
 *
 * // Usage:
 * const formData = new FormData();
 * formData.append('avatar', avatarBlob);
 * const resource = api.uploadAvatar('user123', formData);
 * ```
 */
function upload(...args) {
  return execute(args, UploadResource);
}

/**
 * Creates a time-based caching policy with a fixed TTL (Time-To-Live).
 *
 * This factory function creates a simple caching policy where cached entries
 * expire after a fixed duration. It's the most common caching strategy for
 * data that changes predictably over time.
 *
 * @param ttl - The time-to-live in milliseconds (how long cached data remains valid)
 * @param name - Optional name for the policy (defaults to 'TimeBasedPolicy(${ttl}ms)')
 * @returns A new {@link CachePolicy} instance
 *
 * @example
 * ```typescript
 * const fiveMinutePolicy = CachePolicies.createTimeBasedPolicy(5 * 60 * 1000);
 * const oneHourPolicy = CachePolicies.createTimeBasedPolicy(60 * 60 * 1000);
 *
 * @Get('/data')
 * @Cache({ policy: fiveMinutePolicy })
 * getData() {
 *   return restful<Data>();
 * }
 * ```
 */
function createTimeBasedPolicy(ttl, name = `TimeBasedPolicy(${ttl}ms)`) {
  return {
    name,
    shouldCache: () => true,
    getTTL: () => ttl,
    isValid: entry => entry.expiresAt > Date.now()
  };
}
/**
 * Collection of predefined caching policies for common use cases.
 *
 * This object provides convenient, ready-to-use caching policies that cover
 * the most common caching scenarios. You can use these directly or create
 * custom policies using {@link createTimeBasedPolicy} or by implementing
 * the {@link CachePolicy} interface.
 *
 * @example
 * Using predefined policies:
 * ```typescript
 * // No caching
 * @Get('/live-data')
 * @Cache({ policy: CachePolicies.NoCache })
 * getLiveData() {
 *   return restful<Data>();
 * }
 *
 * // Default 5-minute cache
 * @Get('/user-profile')
 * @Cache({ policy: CachePolicies.Default })
 * getUserProfile() {
 *   return restful<User>();
 * }
 * ```
 *
 * @example
 * Creating custom time-based policies:
 * ```typescript
 * const oneHourCache = CachePolicies.createTimeBasedPolicy(60 * 60 * 1000);
 * const oneDay Cache = CachePolicies.createTimeBasedPolicy(24 * 60 * 60 * 1000);
 *
 * @Get('/daily-stats')
 * @Cache({ policy: oneDayCache })
 * getDailyStats() {
 *   return restful<Stats>();
 * }
 * ```
 */
const CachePolicies = {
  /**
   * No caching policy - all requests bypass the cache.
   *
   * Use this when you need to ensure data is always fresh,
   * or to disable caching for specific endpoints.
   */
  NoCache: {
    name: 'NoCache',
    shouldCache: () => false,
    getTTL: () => 0,
    isValid: () => false
  },
  /**
   * Default caching policy - caches responses for 5 minutes.
   *
   * A reasonable default for most API endpoints that don't require
   * real-time data but benefit from reduced server load.
   */
  Default: createTimeBasedPolicy(5 * 60 * 1000, 'Default'),
  /**
   * Factory function to create custom time-based caching policies.
   *
   * @see {@link createTimeBasedPolicy} for documentation and examples
   */
  createTimeBasedPolicy
};

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
    return (_a = this.config.policy) !== null && _a !== void 0 ? _a : CachePolicies.Default;
  }
  constructor(config = {}) {
    this.config = Object.assign(Object.assign({}, DEFAULT_CACHE_CONFIG), config);
  }
  getBucket() {
    return __awaiter(this, void 0, void 0, function* () {
      var _a, _b;
      if (this.bucket) {
        return this.bucket;
      }
      const bucketName = (_a = this.config.bucketName) !== null && _a !== void 0 ? _a : (_b = this.httpConfig) === null || _b === void 0 ? void 0 : _b.cacheBucket;
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
    return __awaiter(this, void 0, void 0, function* () {
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
        response.onBodyComplete(body => __awaiter(this, void 0, void 0, function* () {
          var _a, _b, _c;
          const headers = yield response.headers();
          const bodyArrayBuffer = yield body.readAsBuffer();
          // Determine expiration time
          const headerExpiration = this.getExpirationFromHeaders(headers);
          const ttl = this.policy.getTTL(method, params);
          const expiresAt = headerExpiration !== null && headerExpiration !== void 0 ? headerExpiration : ttl === 0 ? 0 : Date.now() + ttl;
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
            const overrideEntry = (_c = (_b = (_a = this.policy).overrideCacheEntry) === null || _b === void 0 ? void 0 : _b.call(_a, cacheEntry, method, params)) !== null && _c !== void 0 ? _c : cacheEntry;
            // Store in cache
            yield bucket.setItem(cacheKey, overrideEntry);
          }
        }));
      }
      return response;
    });
  }
}
__decorate([Inject(), __metadata("design:type", ApplicationContext)], CacheInterceptor.prototype, "appCtx", void 0);
__decorate([Inject(DEFAULT_HTTP_CONFIGURATION), __metadata("design:type", Object)], CacheInterceptor.prototype, "httpConfig", void 0);

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

export { AbortError, BadGatewayError, BadRequestError, Cache, CacheInterceptor, CachePolicies, CancellationError, CircuitBreakerError, CircuitBreakerInterceptor, ConflictError, DEFAULT_CACHE_CONFIG, DEFAULT_HTTP_CONFIGURATION, Defer, Delete, EXECUTE, Endpoint, ErrorContextInterceptor, Events, ExpectationFailedError, FailedDependencyError, FetchRequestAdapter, ForbiddenError, GatewayTimeoutError, Get, GoneError, HTTPVersionNotSupportedError, Header, Http, HttpError, HttpHeaders, HttpResponse, HttpStatusError, ImATeapotError, InsufficientStorageError, InternalServerError, Key, LengthRequiredError, LockedError, LoopDetectedError, MaxRetryAttemptsReachedError, MethodNotAllowedError, MisdirectedRequestError, NetworkAuthenticationRequiredError, NetworkError, NotAcceptableError, NotExtendedError, NotFoundError, NotImplementedError, ParseError, PathVariable, Payload, PayloadTooLargeError, PaymentRequiredError, Post, PreconditionFailedError, PreconditionRequiredError, Progress, PromiseStatus, ProxyAuthenticationRequiredError, Put, Query, RangeNotSatisfiableError, Request, RequestHeaderFieldsTooLargeError, RequestMethod, RequestStatus, RequestTimeoutError, Resource, ResourceError, RestfulResource, RetryInterceptor, SETUP, SET_DATA, SET_ERROR, SWR, SWRInstance, SWRMutation, ServerError, ServiceUnavailableError, TimeoutError, TimeoutInterceptor, TooEarlyError, TooManyRequestsError, URITooLongError, UnauthorizedError, UnavailableForLegalReasonsError, UnprocessableEntityError, UnsupportedMediaTypeError, UpgradeRequiredError, VariantAlsoNegotiatesError, XMLHttpRequestAdapter, buildEndpointClass, createRequestDecorator, download, isInterceptor, isInterceptorConstructor, isURL, joinPath, jsonsse, mergeAbortSignal, parseHeaders, resolveURL, restful, upload };
//# sourceMappingURL=index.es.js.map
