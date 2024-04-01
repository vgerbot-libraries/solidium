import { Inject, PreDestroy, Scope, InstanceScope, ApplicationContext, PostInject, Factory } from '@vgerbot/ioc';
import { createEffect, on, untrack, runWithOwner, createSignal, getOwner } from 'solid-js';
import { Signal, useService } from '@vgerbot/solidium';
import { lazyMember } from '@vgerbot/lazy';

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

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

const HTTP_CONFIGURER = Symbol('solidium-http-configurer');
const HTTP_CONFIGURATION = Symbol('solidium-http-configuration');
var CommonInterceptorNameEnum;
(function (CommonInterceptorNameEnum) {
  CommonInterceptorNameEnum["CACHE"] = "cache";
  CommonInterceptorNameEnum["LOGGING"] = "logging";
  CommonInterceptorNameEnum["RETRY"] = "retry";
  CommonInterceptorNameEnum["TIMEOUT"] = "timeout";
})(CommonInterceptorNameEnum || (CommonInterceptorNameEnum = {}));

class MemoryStorageProvider {
  constructor() {
    this._cache = new Map();
  }
  set(key, value) {
    this._cache.set(key, value);
    return Promise.resolve();
  }
  get(key) {
    return Promise.resolve(this._cache.get(key));
  }
  remove(key) {
    this._cache.delete(key);
    return Promise.resolve();
  }
}

class ContentDisposition {
  constructor(type) {
    this.type = type;
  }
  /**
   *
   * @returns the header value for this content disposition as defined in RFC 6266.
   */
  toString() {
    let result = this.type;
    // Append parameters if they exist
    const parameters = [];
    if (this.filename) {
      parameters.push(`filename="${this.encodeHeaderValue(this.filename)}"`);
    }
    if (this.name) {
      parameters.push(`name="${this.encodeHeaderValue(this.name)}"`);
    }
    if (this.charset) {
      parameters.push(`charset=${this.charset}`);
    }
    if (this.creationDate) {
      parameters.push(`creation-date=${this.formatDateValue(this.creationDate)}`);
    }
    if (this.modificationDate) {
      parameters.push(`modification-date=${this.formatDateValue(this.modificationDate)}`);
    }
    if (this.readDate) {
      parameters.push(`read-date=${this.formatDateValue(this.readDate)}`);
    }
    if (this.size) {
      parameters.push(`size=${this.size}`);
    }
    // Append parameters to the result string if they exist
    if (parameters.length > 0) {
      result += '; ' + parameters.join('; ');
    }
    return result;
  }
  encodeHeaderValue(value) {
    // Encode the value if it contains special characters
    if (/[^\w\d!#$&.+\-^_`|~]/.test(value)) {
      return encodeURIComponent(value);
    }
    return value;
  }
  formatDateValue(value) {
    // Format the date using ISO 8601 format
    return value.toISOString();
  }
  static empty() {
    return new ContentDisposition('');
  }
  /**
   * Parse the contentDisposition string and return a ContentDisposition object
   * @param contentDisposition string
   * @returns ContentDisposition object
   */
  static parse(contentDisposition) {
    const parts = contentDisposition.split(';');
    // The first part is the disposition type
    const type = parts[0].trim();
    // Initialize an object with the required type
    const contentDispositionObject = new ContentDisposition(type);
    // Parse the parameters
    for (let i = 1; i < parts.length; i++) {
      const parameter = parts[i].trim();
      const [name, value] = parameter.split('=');
      const trimmedValue = value.trim();
      // Check for encoding and decode if necessary
      const decodedValue = trimmedValue.startsWith('"') && trimmedValue.endsWith('"') ? this.decodeHeaderValue(trimmedValue) : trimmedValue;
      switch (name.toLowerCase()) {
        case 'filename':
          contentDispositionObject.filename = decodedValue;
          break;
        case 'name':
          contentDispositionObject.name = decodedValue;
          break;
        case 'charset':
          contentDispositionObject.charset = decodedValue;
          break;
        case 'creation-date':
          contentDispositionObject.creationDate = this.parseDateValue(decodedValue);
          break;
        case 'modification-date':
          contentDispositionObject.modificationDate = this.parseDateValue(decodedValue);
          break;
        case 'read-date':
          contentDispositionObject.readDate = this.parseDateValue(decodedValue);
          break;
        case 'size':
          contentDispositionObject.size = parseInt(decodedValue);
          break;
      }
    }
    return contentDispositionObject;
  }
  static decodeHeaderValue(value) {
    // Remove leading and trailing double quotes and decode the value
    return decodeURIComponent(value.slice(1, -1));
  }
  static parseDateValue(value) {
    const parsedDate = Date.parse(value);
    if (isNaN(parsedDate)) {
      throw new Error('Invalid date format');
    }
    return new Date(parsedDate);
  }
  static from(options) {
    const instance = new ContentDisposition(options.type);
    Object.assign(instance, options);
    return instance;
  }
  clone() {
    return ContentDisposition.from(this);
  }
}

var CharsetEnum;
(function (CharsetEnum) {
  CharsetEnum["UTF_8"] = "UTF-8";
  CharsetEnum["ISO_8859_1"] = "ISO-8859-1";
  CharsetEnum["ISO_8859_2"] = "ISO-8859-2";
  CharsetEnum["ISO_8859_3"] = "ISO-8859-3";
  CharsetEnum["ISO_8859_4"] = "ISO-8859-4";
  CharsetEnum["ISO_8859_5"] = "ISO-8859-5";
  CharsetEnum["ISO_8859_6"] = "ISO-8859-6";
  CharsetEnum["ISO_8859_7"] = "ISO-8859-7";
  CharsetEnum["ISO_8859_8"] = "ISO-8859-8";
  CharsetEnum["ISO_8859_9"] = "ISO-8859-9";
  CharsetEnum["ISO_8859_10"] = "ISO-8859-10";
  CharsetEnum["ISO_8859_11"] = "ISO-8859-11";
  CharsetEnum["ISO_8859_13"] = "ISO-8859-13";
  CharsetEnum["ISO_8859_14"] = "ISO-8859-14";
  CharsetEnum["ISO_8859_15"] = "ISO-8859-15";
  CharsetEnum["ISO_8859_16"] = "ISO-8859-16";
  CharsetEnum["WINDOWS_1250"] = "windows-1250";
  CharsetEnum["WINDOWS_1251"] = "windows-1251";
  CharsetEnum["WINDOWS_1252"] = "windows-1252";
  CharsetEnum["WINDOWS_1253"] = "windows-1253";
  CharsetEnum["WINDOWS_1254"] = "windows-1254";
  CharsetEnum["WINDOWS_1255"] = "windows-1255";
  CharsetEnum["WINDOWS_1256"] = "windows-1256";
  CharsetEnum["WINDOWS_1257"] = "windows-1257";
  CharsetEnum["WINDOWS_1258"] = "windows-1258";
  CharsetEnum["EUC_JP"] = "EUC-JP";
  CharsetEnum["SHIFT_JIS"] = "Shift_JIS";
  CharsetEnum["ISO_2022_JP"] = "ISO-2022-JP";
  CharsetEnum["GB2312"] = "GB2312";
  CharsetEnum["BIG5"] = "Big5";
  CharsetEnum["EUC_KR"] = "EUC-KR";
  CharsetEnum["KOI8_R"] = "KOI8-R";
  CharsetEnum["UTF_16BE"] = "UTF-16BE";
  CharsetEnum["UTF_16LE"] = "UTF-16LE";
  CharsetEnum["UTF_32BE"] = "UTF-32BE";
  CharsetEnum["UTF_32LE"] = "UTF-32LE";
  CharsetEnum["IBM424_rtl"] = "IBM424_rtl";
  CharsetEnum["IBM424_ltr"] = "IBM424_ltr";
  CharsetEnum["IBM420_rtl"] = "IBM420_rtl";
  CharsetEnum["IBM420_ltr"] = "IBM420_ltr";
  CharsetEnum["IBM424"] = "IBM424";
  CharsetEnum["IBM420"] = "IBM420";
})(CharsetEnum || (CharsetEnum = {}));

class ContentType {
  static from(mediaType, charset = CharsetEnum.UTF_8) {
    return new ContentType(mediaType, charset);
  }
  static none() {
    return ContentType.from('');
  }
  constructor(_mediaType, _charset) {
    this._mediaType = _mediaType;
    this._charset = _charset;
  }
  clone() {
    return new ContentType(this._mediaType, this._charset);
  }
  toString() {
    return this._mediaType + (this._charset ? ';' + this._charset : '');
  }
  mediaType() {
    return this._mediaType;
  }
  charset() {
    return this._charset;
  }
  isNone() {
    return !this._mediaType;
  }
}

class HttpHeadersImpl {
  static fromNativeHeaders(headers) {
    const newHeaders = new HttpHeadersImpl();
    headers.forEach((value, key) => {
      newHeaders.set(key, value);
    });
    return newHeaders;
  }
  static empty() {
    return new HttpHeadersImpl();
  }
  constructor(headers = new Map()) {
    this.headers = headers;
  }
  set(name, value) {
    name = name.toLowerCase();
    if (Array.isArray(value)) {
      this.headers.set(name, value);
    } else {
      this.headers.set(name, [value]);
    }
    return this;
  }
  append(name, value) {
    name = name.toLowerCase();
    const values = this.get(name);
    this.headers.set(name, values.concat(value));
    return this;
  }
  remove(name) {
    this.headers.delete(name);
    return this;
  }
  get(name) {
    return this.headers.get(name.toLowerCase()) || [];
  }
  getAll() {
    return this.headers;
  }
  mergeAll(...other) {
    other.forEach(other => {
      other.getAll().forEach((value, key) => {
        const values = this.get(key);
        value.forEach(valueItem => {
          if (!values.includes(valueItem)) {
            values.push(valueItem);
          }
        });
        this.set(key, values);
      });
    });
    return this;
  }
  getContentDisposition() {
    const contentDisposition = this.get('Content-Disposition')[0];
    if (!contentDisposition) {
      return ContentDisposition.empty();
    }
    return ContentDisposition.parse(contentDisposition);
  }
  getContentType() {
    const contentType = this.get('Content-Type')[0];
    if (!contentType) {
      return ContentType.none();
    }
    const [media, charset] = contentType.split(';');
    return ContentType.from(media, charset);
  }
  getContentLength() {
    const contentLength = this.get('Content-Length')[0];
    const len = parseInt(contentLength);
    return isFinite(len) ? len : 0;
  }
  setAccept(contentType) {
    this.set('Accept', contentType.toString());
    return this;
  }
  setBasicAuth(username, password) {
    if (typeof username !== 'string' || password && typeof password !== 'string') {
      throw new Error('Username and password must be strings');
    }
    const credentials = btoa(`${username}:${password}`);
    this.set('Authorization', `Basic ${credentials}`);
    return this;
  }
  setBearAuth(token) {
    this.set('Authorization', `Bearer ${token}`);
    return this;
  }
  setContentType(contentType) {
    this.set('Content-Type', contentType.toString());
    return this;
  }
  setUserAgent(userAgent) {
    this.set('User-Agent', userAgent);
    return this;
  }
  setRange(range) {
    this.set('Range', range.toString());
    return this;
  }
  toNativeHeaders() {
    const nativeHeaders = new Headers({});
    this.headers.forEach((value, key) => {
      value.forEach(valueItem => {
        nativeHeaders.append(key, valueItem);
      });
    });
    return nativeHeaders;
  }
  clone() {
    const headers = new Map();
    this.headers.forEach((value, key) => {
      headers.set(key, value.slice(0));
    });
    return new HttpHeadersImpl(headers);
  }
}

var HttpMethod;
(function (HttpMethod) {
  HttpMethod["GET"] = "GET";
  HttpMethod["HEAD"] = "HEAD";
  HttpMethod["POST"] = "POST";
  HttpMethod["PUT"] = "PUT";
  HttpMethod["DELETE"] = "DELETE";
  HttpMethod["PATCH"] = "PATCH";
})(HttpMethod || (HttpMethod = {}));

class CachedHttpResponse {
  constructor(request, cachedData) {
    this.request = request;
    this.cachedData = cachedData;
    const headersMap = new Map();
    for (const name in cachedData.headers) {
      headersMap.set(name, cachedData.headers[name]);
    }
    this.headers = new HttpHeadersImpl(headersMap);
    this.status = parseInt(cachedData.status, 10);
    this.statusText = cachedData.statusText;
  }
  body() {
    return __awaiter(this, void 0, void 0, function* () {
      const response = yield fetch(this.cachedData.body);
      return response.blob();
    });
  }
  clone() {
    return new CachedHttpResponse(this.request, this.cachedData);
  }
}
class DefaultCacheStrategy {
  execute(request, next) {
    switch (request.method) {
      case HttpMethod.PUT:
      case HttpMethod.DELETE:
      case HttpMethod.PATCH:
      case HttpMethod.POST:
        return next();
    }
    if (request.disableCache) {
      return next();
    }
    const provider = request.configuration.storageProvider;
    const key = request.key;
    return provider.get(key).then(value => {
      if (!value) {
        return next().then(response => {
          return serializeResponse(response).then(data => {
            return provider.set(key, JSON.stringify(data));
          }).then(() => {
            return response;
          });
        });
      }
      const cachedData = JSON.parse(value);
      return new CachedHttpResponse(request, cachedData);
    });
  }
  clearCache(request) {
    const provider = request.configuration.storageProvider;
    const key = request.key;
    return provider.remove(key);
  }
}
function serializeResponse(response) {
  return __awaiter(this, void 0, void 0, function* () {
    const headersMap = response.headers.getAll();
    const headersRecord = {};
    headersMap.forEach((value, key) => {
      headersRecord[key] = value;
    });
    const dataURI = yield response.body().then(blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      return new Promise((resolve, reject) => {
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
      });
    });
    return {
      body: dataURI,
      headers: headersRecord,
      status: response.status + '',
      statusText: response.statusText
    };
  });
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function isTriggerInstance(value) {
  return isObject(value) && typeof value.dispatch === 'function';
}

function noop() {
  // DO NOTHING
}

class ImmediateTrigger {
  dispatch(requestTrigger) {
    requestTrigger();
    return noop;
  }
}

class TimmerTrigger {
  static of(interval) {
    return class extends TimmerTrigger {
      constructor() {
        super(interval);
      }
    };
  }
  constructor(interval = 1000) {
    this.interval = interval;
  }
  dispatch(requestTrigger) {
    const timmerId = setInterval(() => {
      requestTrigger();
    }, this.interval);
    return () => {
      clearInterval(timmerId);
    };
  }
}

class WindowEventTrigger {
  constructor(eventType) {
    this.eventType = eventType;
  }
  dispatch(requestTrigger) {
    const eventListener = () => {
      requestTrigger(true);
    };
    window.addEventListener(this.eventType, eventListener);
    return () => {
      window.removeEventListener(this.eventType, eventListener);
    };
  }
}

class WindowFocusTrigger extends WindowEventTrigger {
  constructor() {
    super('focus');
  }
}

class OnOnlineTrigger extends WindowEventTrigger {
  constructor() {
    super('online');
  }
}

class IdleTrigger {
  dispatch(requestTrigger) {
    let stopped = false;
    requestIdleCallback(() => {
      if (stopped) return;
      requestTrigger();
    });
    return () => {
      stopped = true;
    };
  }
}

class SmartTrigger {
  constructor({
    immediate,
    idle,
    interval,
    onFocus,
    onOnline
  }) {
    this.triggers = [];
    if (idle) {
      this.triggers.push(new IdleTrigger());
    } else if (immediate) {
      this.triggers.push(new ImmediateTrigger());
    }
    if (typeof interval === 'number' && interval > 0) {
      this.triggers.push(new TimmerTrigger(interval));
    }
    if (onFocus) {
      this.triggers.push(new WindowFocusTrigger());
    }
    if (onOnline) {
      this.triggers.push(new OnOnlineTrigger());
    }
  }
  dispatch(requestTrigger) {
    let promise;
    function ensureSingleTrigger() {
      return __awaiter(this, void 0, void 0, function* () {
        if (!!promise) {
          return;
        }
        promise = requestTrigger().finally(() => {
          promise = undefined;
        });
      });
    }
    const stops = this.triggers.map(trigger => trigger.dispatch(ensureSingleTrigger));
    return () => {
      stops.forEach(stop => stop());
    };
  }
}

function createTrigger(appCtx, options) {
  if (isObject(options)) {
    return new SmartTrigger(options);
  }
  if (typeof options === 'function') {
    return appCtx.getInstance(options);
  }
  if (isTriggerInstance(options)) {
    return options;
  }
}

class Defer {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

class EmptyEntity {
  contentType() {
    return ContentType.none();
  }
  data() {
    return Promise.resolve(new Blob([]));
  }
  size() {
    return 0;
  }
  clone() {
    return new EmptyEntity();
  }
}

class FormDataEntity {
  constructor(formdata) {
    this.formdata = formdata;
  }
  contentType() {
    return ContentType.none();
  }
  data() {
    return Promise.resolve(this.formdata);
  }
  size() {
    return -1;
  }
  clone() {
    const newFormData = new FormData();
    this.formdata.forEach((value, key) => {
      this.formdata.append(key, value);
    });
    return new FormDataEntity(newFormData);
  }
}

var MediaTypeEnum;
(function (MediaTypeEnum) {
  MediaTypeEnum["APPLICATION_ATOM_XML"] = "application/atom+xml";
  MediaTypeEnum["APPLICATION_CBOR"] = "application/cbor";
  MediaTypeEnum["APPLICATION_FORM_URLENCODED"] = "application/x-www-form-urlencoded";
  MediaTypeEnum["APPLICATION_GRAPHQL"] = "application/graphql";
  MediaTypeEnum["APPLICATION_GRAPHQL_RESPONSE"] = "application/graphql-response+json";
  MediaTypeEnum["APPLICATION_JSON"] = "application/json";
  MediaTypeEnum["APPLICATION_NDJSON"] = "application/x-ndjson";
  MediaTypeEnum["APPLICATION_OCTET_STREAM"] = "application/octet-stream";
  MediaTypeEnum["APPLICATION_PDF"] = "application/pdf";
  MediaTypeEnum["APPLICATION_PROBLEM_JSON"] = "application/problem+json";
  MediaTypeEnum["APPLICATION_PROBLEM_XML"] = "application/problem+xml";
  MediaTypeEnum["APPLICATION_PROTOBUF"] = "application/x-protobuf";
  MediaTypeEnum["APPLICATION_RSS_XML"] = "application/rss+xml";
  MediaTypeEnum["APPLICATION_STREAM_JSON"] = "application/stream+json";
  MediaTypeEnum["APPLICATION_XHTML_XML"] = "application/xhtml+xml";
  MediaTypeEnum["APPLICATION_XML"] = "application/xml";
  MediaTypeEnum["IMAGE_GIF"] = "image/gif";
  MediaTypeEnum["IMAGE_JPEG"] = "image/jpeg";
  MediaTypeEnum["IMAGE_PNG"] = "image/png";
  MediaTypeEnum["MULTIPART_FORM_DATA"] = "multipart/form-data";
  MediaTypeEnum["MULTIPART_MIXED"] = "multipart/mixed";
  MediaTypeEnum["MULTIPART_RELATED"] = "multipart/related";
  MediaTypeEnum["TEXT_EVENT_STREAM"] = "text/event-stream";
  MediaTypeEnum["TEXT_HTML"] = "text/html";
  MediaTypeEnum["TEXT_MARKDOWN"] = "text/markdown";
  MediaTypeEnum["TEXT_PLAIN"] = "text/plain";
  MediaTypeEnum["TEXT_XML"] = "text/xml";
})(MediaTypeEnum || (MediaTypeEnum = {}));

class JSONEntity {
  constructor(_getJson) {
    this._getJson = _getJson;
  }
  contentType() {
    return ContentType.from(MediaTypeEnum.APPLICATION_JSON, CharsetEnum.UTF_8);
  }
  data() {
    return __awaiter(this, void 0, void 0, function* () {
      const json = yield this.jsonPromise;
      return new Blob([json], {
        type: MediaTypeEnum.APPLICATION_JSON
      });
    });
  }
  parsed() {
    return __awaiter(this, void 0, void 0, function* () {
      const obj = yield this.jsonObjectPromise;
      return obj;
    });
  }
  size() {
    throw new Error('Method not implemented.');
  }
  clone() {
    return new JSONEntity(this._getJson);
  }
}
__decorate([lazyMember(function () {
  return this._getJson();
}), __metadata("design:type", Promise)], JSONEntity.prototype, "jsonPromise", void 0);
__decorate([lazyMember(function () {
  return __awaiter(this, void 0, void 0, function* () {
    const json = yield this.jsonPromise;
    return JSON.parse(json);
  });
}), __metadata("design:type", Promise)], JSONEntity.prototype, "jsonObjectPromise", void 0);

class OctetStreamEntity {
  constructor(_getData, _size) {
    this._getData = _getData;
    this._size = _size;
  }
  contentType() {
    return ContentType.from('application/octet-stream');
  }
  data() {
    return this.dataPromise;
  }
  size() {
    return this._size;
  }
  clone() {
    return new OctetStreamEntity(this._getData, this._size);
  }
}
__decorate([lazyMember(instance => {
  return instance._getData();
}), __metadata("design:type", Promise)], OctetStreamEntity.prototype, "dataPromise", void 0);

class PlainTextEntity {
  constructor(_text) {
    this._text = _text;
  }
  contentType() {
    return ContentType.from('text/plain');
  }
  data() {
    return Promise.resolve(this._data);
  }
  size() {
    return this._data.size;
  }
  clone() {
    return new PlainTextEntity(this._text);
  }
}
__decorate([lazyMember(instance => {
  const encoder = new TextEncoder();
  const u8a = encoder.encode(instance._text);
  return new Blob([u8a], {
    type: instance.contentType().toString()
  });
}), __metadata("design:type", Blob)], PlainTextEntity.prototype, "_data", void 0);

class URLSearchParamsEntity {
  constructor(formdata) {
    this.formdata = formdata;
  }
  contentType() {
    return ContentType.none();
  }
  data() {
    return Promise.resolve(this.formdata);
  }
  size() {
    return -1;
  }
  clone() {
    const newFormData = new URLSearchParams();
    this.formdata.forEach((value, key) => {
      this.formdata.append(key, value);
    });
    return new URLSearchParamsEntity(newFormData);
  }
}

function isArrayBufferView(data) {
  if (typeof data.buffer === 'object' && typeof data.byteLength === 'number' && typeof data.byteOffset === 'number') {
    return false;
  }
  return true;
}

function isHttpEntity(value) {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (typeof value.contentType !== 'function') {
    return false;
  }
  if (typeof value.data !== 'function') {
    return false;
  }
  if (typeof value.size !== 'function') {
    return false;
  }
  return true;
}

function isJSON(value) {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (value instanceof ReadableStream) {
    return false;
  }
  if (value instanceof Blob) {
    return false;
  }
  if (value instanceof ArrayBuffer) {
    return false;
  }
  if (value instanceof FormData) {
    return false;
  }
  if (value instanceof URLSearchParams) {
    return false;
  }
  if (isArrayBufferView(value)) {
    return false;
  }
  return !isHttpEntity(value);
}

function createEntity(data) {
  if (data === undefined) {
    return new EmptyEntity();
  }
  if (isJSON(data)) {
    const json = JSON.stringify(data);
    return new JSONEntity(() => Promise.resolve(json));
  }
  if (isHttpEntity(data)) {
    return data;
  }
  if (isArrayBufferView(data) || data instanceof ArrayBuffer) {
    return new OctetStreamEntity(() => Promise.resolve(new Blob([data])), data.byteLength);
  }
  if (data instanceof Blob) {
    return new OctetStreamEntity(() => Promise.resolve(data), data.size);
  }
  if (data instanceof FormData) {
    return new FormDataEntity(data);
  }
  if (data instanceof URLSearchParams) {
    return new URLSearchParamsEntity(data);
  }
  if (data instanceof ReadableStream) {
    return new OctetStreamEntity(() => Promise.resolve(data), -1);
  }
  return new PlainTextEntity(data + '');
}

function resolveURL(baseURL, url) {
  if (url instanceof URL) {
    return url;
  }
  if (typeof url === 'string') {
    if (/^\w+\:\/\/[^\/].+/.test(url)) {
      return new URL(url);
    }
  }
  if (!url && !baseURL) {
    if (!baseURL) {
      throw new Error('Cannot resolve base URL and request URL, both of them are not defined!');
    }
  }
  if (!url) {
    return new URL('', baseURL);
  }
  if (!baseURL) {
    if (typeof globalThis.location === 'object') {
      baseURL = globalThis.location.origin;
    } else {
      throw new Error('Cannot resolve base URL, current is not runing in browser environment!');
    }
  }
  return new URL(url, baseURL);
}

class HttpRequestImpl {
  constructor(configuration, requestOptions) {
    this.configuration = configuration;
    this.requestOptions = requestOptions;
    const url = resolveURL(configuration.baseUrl, requestOptions.url);
    const searchParams = Object.assign(Object.assign({}, configuration.search), requestOptions.search || {});
    for (const key in searchParams) {
      const value = searchParams[key];
      if (Array.isArray(value)) {
        value.forEach(it => url.searchParams.append(key, it));
      } else {
        url.searchParams.set(key, value);
      }
    }
    this.url = url;
    const body = createEntity(requestOptions.body);
    this.body = body;
    this.headers = requestOptions.headers ? configuration.headers.mergeAll(requestOptions.headers) : configuration.headers.clone();
    this.method = requestOptions.method || HttpMethod.GET;
    this.disableCache = requestOptions.disableCache || false;
  }
  clone() {
    return new HttpRequestImpl(this.configuration, this.requestOptions);
  }
  get key() {
    if (this.requestOptions['key']) {
      return this.requestOptions.key;
    }
    return this.url.toString();
  }
}

class PassiveTrigger {
  dispatch() {
    return noop;
  }
}

var ResourceStatus;
(function (ResourceStatus) {
  ResourceStatus["IDLE"] = "idle";
  ResourceStatus["PENDING"] = "pending";
  ResourceStatus["SUCCESS"] = "success";
  ResourceStatus["FAILURE"] = "failure";
})(ResourceStatus || (ResourceStatus = {}));
let WorkerResource = class WorkerResource {
  constructor() {
    this.status = ResourceStatus.IDLE;
    this.stopTrigger = noop;
    this.responseDefer = new Defer();
  }
  get idle() {
    return this.status === ResourceStatus.IDLE;
  }
  get pending() {
    return this.status === ResourceStatus.PENDING;
  }
  get success() {
    return this.status === ResourceStatus.SUCCESS;
  }
  get failure() {
    return this.status === ResourceStatus.FAILURE;
  }
  get completed() {
    return this.success || this.failure;
  }
  get response() {
    return this._response;
  }
  get error() {
    return this._error;
  }
  get responsePromise() {
    return this.responseDefer.promise;
  }
  init(configuration, createResourceOptions) {
    createEffect(on(() => {
      return this.convertToRequestOptions(createResourceOptions);
    }, requestOptions => {
      this.stopTrigger();
      this.request = new HttpRequestImpl(configuration, requestOptions);
      const trigger = createTrigger(this.appCtx, requestOptions.trigger) || configuration.trigger || new PassiveTrigger();
      this.stopTrigger = trigger.dispatch(() => {
        return this.refetch();
      });
    }));
  }
  convertToRequestOptions(options) {
    const obtainProperty = key => {
      const value = options[key];
      if (typeof value === 'function') {
        return value();
      }
      return value;
    };
    return {
      key: obtainProperty('key'),
      url: obtainProperty('url'),
      method: options.method || HttpMethod.GET,
      body: obtainProperty('body'),
      headers: options.headers,
      search: obtainProperty('search'),
      trigger: options.trigger
    };
  }
  onCleanup() {
    this.stopTrigger();
  }
  refetch(clearCache) {
    return __awaiter(this, void 0, void 0, function* () {
      if (this.pending) {
        try {
          yield this.responseDefer.promise;
        } catch (_) {
          // IGNORE
        }
        this.responseDefer = new Defer();
      }
      this.status = ResourceStatus.PENDING;
      this._response = undefined;
      this._error = undefined;
      try {
        const configuration = this.request.configuration;
        const response = yield this.executeRequest(clearCache);
        yield configuration.validateStatus(response);
        this.status = ResourceStatus.SUCCESS;
        this._response = response;
        this.responseDefer.resolve(response);
      } catch (error) {
        this.status = ResourceStatus.FAILURE;
        this.responseDefer.reject(error);
      }
    });
  }
  executeRequest(clearCache) {
    return __awaiter(this, void 0, void 0, function* () {
      const configuration = this.request.configuration;
      const executeRequest = request => __awaiter(this, void 0, void 0, function* () {
        const cacheStrategy = request.configuration.cacheStrategy;
        if (clearCache) {
          yield cacheStrategy.clearCache(request);
        }
        return request.configuration.cacheStrategy.execute(request, cachedResponse => __awaiter(this, void 0, void 0, function* () {
          if (cachedResponse) {
            return Promise.resolve(cachedResponse);
          } else {
            const fetcher = request.configuration.fetcher;
            return fetcher(request);
          }
        }));
      });
      const interceptedRequestExecutor = configuration.interceptors.reduceRight((next, interceptor) => {
        return request => {
          return interceptor.intercept(request, next);
        };
      }, executeRequest);
      return interceptedRequestExecutor(this.request.clone());
    });
  }
};
__decorate([Inject(), __metadata("design:type", ApplicationContext)], WorkerResource.prototype, "appCtx", void 0);
__decorate([Signal, __metadata("design:type", String)], WorkerResource.prototype, "status", void 0);
__decorate([Signal, __metadata("design:type", Object)], WorkerResource.prototype, "_response", void 0);
__decorate([Signal, __metadata("design:type", Object)], WorkerResource.prototype, "_error", void 0);
__decorate([PreDestroy(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], WorkerResource.prototype, "onCleanup", null);
WorkerResource = __decorate([Scope(InstanceScope.TRANSIENT)], WorkerResource);

class HttpInterceptorRegistryImpl {
  constructor() {
    this.interceptors = [];
  }
  addInterceptor(interceptor, name) {
    if (typeof interceptor === 'function') {
      this.interceptors.push({
        name,
        intercept(request, next) {
          return interceptor(request, next);
        }
      });
    } else {
      this.interceptors.push(interceptor);
    }
  }
  getInterceptors() {
    return this.interceptors.slice(0);
  }
}

function internalValidateStatus(response) {
  return __awaiter(this, void 0, void 0, function* () {
    if (response.status >= 400) {
      throw new Error(response.statusText);
    }
  });
}

const internalFetcher = request => __awaiter(void 0, void 0, void 0, function* () {
  const cannotHaveBody = request.method === HttpMethod.GET || request.method === HttpMethod.HEAD;
  const data = cannotHaveBody ? undefined : yield request.body.data();
  const requestNativeHeaders = new Headers({});
  const requestHeadersMap = request.headers.getAll();
  requestHeadersMap.forEach((values, key) => {
    values.forEach(value => {
      requestNativeHeaders.append(key, value);
    });
  });
  const contentType = request.body.contentType();
  if (!contentType.isNone() && !requestNativeHeaders.has('Content-Type')) {
    requestNativeHeaders.set('Content-Type', contentType.toString());
  }
  const response = yield fetch(request.url, {
    method: request.method,
    headers: requestNativeHeaders,
    body: data
  });
  const responseHeaders = HttpHeadersImpl.fromNativeHeaders(response.headers);
  let bodyPromise;
  return {
    body: () => {
      if (!bodyPromise) {
        bodyPromise = response.blob();
      }
      return bodyPromise;
    },
    headers: responseHeaders,
    status: response.status,
    statusText: response.statusText,
    request: request
  };
});

class HttpClient {
  constructor() {
    this.configurationOptions = {};
    this.interceptorRegistry = new HttpInterceptorRegistryImpl();
  }
  static configure(configuration) {
    class HttpConfigurationFactory {
      getConfiguration() {
        return configuration;
      }
    }
    __decorate([Factory(HTTP_CONFIGURATION), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], HttpConfigurationFactory.prototype, "getConfiguration", null);
    return HttpClient;
  }
  afterInjected() {
    var _a;
    const {
      baseUrl,
      headers,
      interceptors,
      search,
      fetcher,
      storageProvider: storageProviderClass,
      cacheStrategy: cacheStrategyClass,
      trigger: triggerOption
    } = this.configurationOptions;
    const appCtx = this.appCtx;
    const storageProvider = appCtx.getInstance(storageProviderClass || MemoryStorageProvider);
    const cacheStrategy = appCtx.getInstance(cacheStrategyClass || DefaultCacheStrategy);
    const defaultTrigger = createTrigger(this.appCtx, triggerOption || {
      immediate: true
    });
    this.configuration = {
      baseUrl: undefined,
      interceptors: [],
      headers: HttpHeadersImpl.empty(),
      search: {},
      fetcher: internalFetcher,
      storageProvider: storageProvider,
      cacheStrategy,
      trigger: defaultTrigger,
      clone() {
        return Object.assign(Object.assign({}, this), {
          interceptors: this.interceptors.slice(0),
          search: Object.assign({}, this.search),
          storageProvider: appCtx.getInstance(storageProviderClass || MemoryStorageProvider),
          cacheStrategy: appCtx.getInstance(cacheStrategyClass || DefaultCacheStrategy),
          trigger: defaultTrigger
        });
      },
      validateStatus: internalValidateStatus
    };
    if (baseUrl) {
      this.configuration.baseUrl = new URL(baseUrl);
    }
    if (headers) {
      for (const key in headers) {
        this.configuration.headers.set(key, headers[key]);
      }
    }
    if (interceptors) {
      interceptors.forEach(interceptor => {
        if (typeof interceptor === 'function') {
          this.interceptorRegistry.addInterceptor({
            name: 'functional-interceptor',
            intercept: interceptor
          });
        } else {
          this.interceptorRegistry.addInterceptor(interceptor);
        }
      });
    }
    if (search) {
      for (const key in search) {
        this.configuration.search[key] = search[key] + '';
      }
    }
    this.configuration.fetcher = request => {
      return untrack(() => {
        return (fetcher || this.configuration.fetcher)(request);
      });
    };
    (_a = this.configurers) === null || _a === void 0 ? void 0 : _a.forEach(configurer => {
      configurer.configHeaders && configurer.configHeaders(this.configuration.headers);
      configurer.addInterceptors && configurer.addInterceptors(this.interceptorRegistry);
    });
    this.configuration.interceptors.push(...this.interceptorRegistry.getInterceptors());
  }
  createResource(options) {
    const worker = this.appCtx.getInstance(WorkerResource);
    worker.init(this.configuration.clone(), options);
    return worker;
  }
}
__decorate([Inject(HTTP_CONFIGURATION), __metadata("design:type", Object)], HttpClient.prototype, "configurationOptions", void 0);
__decorate([Inject(HTTP_CONFIGURER), __metadata("design:type", Array)], HttpClient.prototype, "configurers", void 0);
__decorate([Inject(), __metadata("design:type", ApplicationContext)], HttpClient.prototype, "appCtx", void 0);
__decorate([PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], HttpClient.prototype, "afterInjected", null);

class DelegateResource {
  get idle() {
    return this.target.idle;
  }
  get pending() {
    return this.target.pending;
  }
  get success() {
    return this.target.success;
  }
  get failure() {
    return this.target.failure;
  }
  get completed() {
    return this.target.completed;
  }
  get request() {
    return this.target.request;
  }
  get error() {
    return this.target.error;
  }
  constructor(target) {
    this.target = target;
  }
  refetch(force) {
    return this.target.refetch(force);
  }
}

class DataHttpResponse {
  body() {
    return this.origin.body();
  }
  get headers() {
    return this.origin.headers;
  }
  get status() {
    return this.origin.status;
  }
  get statusText() {
    return this.origin.statusText;
  }
  get request() {
    return this.origin.request;
  }
  clone() {
    return new DataHttpResponse(this.origin.clone(), this.owner, this.parser);
  }
  get data() {
    return this._dataSignal[0]();
  }
  get parser_error() {
    return this._parserErrorSignal[0]();
  }
  constructor(origin, owner, parser) {
    this.origin = origin;
    this.owner = owner;
    this.parser = parser;
    this._dataSignal = runWithOwner(owner, () => {
      return createSignal();
    });
    this._parserErrorSignal = runWithOwner(owner, () => {
      return createSignal();
    });
    this.origin.body().then(blob => parser(blob).catch(reason => {
      this._parserErrorSignal[1](reason);
      return undefined;
    })).then(data => {
      this._dataSignal[1](data);
    });
  }
}
class DataResource extends DelegateResource {
  get data() {
    var _a;
    return (_a = this.response) === null || _a === void 0 ? void 0 : _a.data;
  }
  get parser_error() {
    var _a;
    return (_a = this.response) === null || _a === void 0 ? void 0 : _a.parser_error;
  }
  get responsePromise() {
    return this.target.responsePromise.then(() => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.response;
    });
  }
  constructor(target, parser) {
    super(target);
    this.parser = parser;
    this.owner = getOwner();
  }
}
__decorate([lazyMember({
  evaluate: instance => {
    const origin = instance.target.response;
    return origin ? new DataHttpResponse(origin, instance.owner, instance.parser) : undefined;
  },
  resetBy: [instance => instance.target.response],
  enumerable: true
}), __metadata("design:type", Object)], DataResource.prototype, "response", void 0);

function useHttpClient() {
  return useService(HttpClient);
}

function useResource(options) {
  const client = useHttpClient();
  return client.createResource(options);
}

function useData(options, parser) {
  const res = useResource(options);
  return new DataResource(res, parser);
}

function useArrayBuffer(options) {
  return useData(options, blob => {
    return blob.arrayBuffer();
  });
}

function useJSON(options) {
  return useData(options, blob => {
    return blob.text().then(text => JSON.parse(text));
  });
}

function usePlainText(options) {
  return useData(options, blob => {
    return blob.text();
  });
}

function useBlob(options) {
  return useData(options, blob => Promise.resolve(blob));
}

export { HttpClient, useArrayBuffer, useBlob, useData, useJSON, usePlainText };
//# sourceMappingURL=index.es.js.map
