'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ioc = require('@vgerbot/ioc');
var solidium = require('@vgerbot/solidium');
var lazy = require('@vgerbot/lazy');
var solidJs = require('solid-js');

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
/* global Reflect, Promise, SuppressedError, Symbol */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

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

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
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

var HTTP_CONFIGURER = Symbol('solidium-http-configurer');
var HTTP_CONFIGURATION = Symbol('solidium-http-configuration');
var CommonInterceptorNameEnum;
(function (CommonInterceptorNameEnum) {
  CommonInterceptorNameEnum["CACHE"] = "cache";
  CommonInterceptorNameEnum["LOGGING"] = "logging";
  CommonInterceptorNameEnum["RETRY"] = "retry";
  CommonInterceptorNameEnum["TIMEOUT"] = "timeout";
})(CommonInterceptorNameEnum || (CommonInterceptorNameEnum = {}));

var LRUCache = /** @class */function () {
  function LRUCache(capacity) {
    if (capacity === void 0) {
      capacity = 500;
    }
    this.capacity = capacity;
    this.lookup = new Map();
    this.reverseLookup = new Map();
    this.length = 0;
    this.head = undefined;
    this.tail = undefined;
  }
  /** if the value is an object this returns a direct reference */
  LRUCache.prototype.get = function (key) {
    var node = this.lookup.get(key);
    if (!node) return undefined;
    this.detach(node);
    this.prepend(node);
    return node.value;
  };
  LRUCache.prototype.set = function (key, value) {
    var node = this.lookup.get(key);
    if (!node) {
      node = {
        value: value
      };
      this.length++;
      this.prepend(node);
      this.trimCache();
      this.lookup.set(key, node);
      this.reverseLookup.set(node, key);
    } else {
      this.detach(node);
      this.prepend(node);
      node.value = value;
    }
  };
  LRUCache.prototype.delete = function (key) {
    var node = this.lookup.get(key);
    if (!node) {
      return;
    }
    this.detach(node);
    this.length--;
  };
  LRUCache.prototype.keys = function () {
    return Array.from(this.lookup.keys());
  };
  LRUCache.prototype.trimCache = function () {
    if (this.length <= this.capacity) return;
    var tail = this.tail;
    this.detach(tail);
    var key = this.reverseLookup.get(tail);
    this.lookup.delete(key);
    this.reverseLookup.delete(tail);
  };
  LRUCache.prototype.detach = function (node) {
    if (node.prev) {
      node.prev.next = node.next;
    }
    if (node.next) {
      node.next.prev = node.prev;
    }
    if (this.head === node) {
      this.head = this.head.next;
    }
    if (this.tail === node) {
      this.tail = this.tail.prev;
    }
    node.next = undefined;
    node.prev = undefined;
  };
  LRUCache.prototype.prepend = function (node) {
    if (!this.head) {
      this.head = node;
      this.tail = node;
      return;
    }
    node.next = this.head;
    this.head.prev = node;
    this.head = node;
  };
  return LRUCache;
}();

var MemoryStorageProvider = /** @class */function () {
  function MemoryStorageProvider() {
    this._cache = new LRUCache();
  }
  MemoryStorageProvider.prototype.set = function (key, value) {
    this._cache.set(key, value);
    return Promise.resolve();
  };
  MemoryStorageProvider.prototype.get = function (key) {
    return Promise.resolve(this._cache.get(key));
  };
  MemoryStorageProvider.prototype.remove = function (key) {
    this._cache.delete(key);
    return Promise.resolve();
  };
  return MemoryStorageProvider;
}();

var ContentDisposition = /** @class */function () {
  function ContentDisposition(type) {
    this.type = type;
  }
  /**
   *
   * @returns the header value for this content disposition as defined in RFC 6266.
   */
  ContentDisposition.prototype.toString = function () {
    var result = this.type;
    // Append parameters if they exist
    var parameters = [];
    if (this.filename) {
      parameters.push("filename=\"".concat(this.encodeHeaderValue(this.filename), "\""));
    }
    if (this.name) {
      parameters.push("name=\"".concat(this.encodeHeaderValue(this.name), "\""));
    }
    if (this.charset) {
      parameters.push("charset=".concat(this.charset));
    }
    if (this.creationDate) {
      parameters.push("creation-date=".concat(this.formatDateValue(this.creationDate)));
    }
    if (this.modificationDate) {
      parameters.push("modification-date=".concat(this.formatDateValue(this.modificationDate)));
    }
    if (this.readDate) {
      parameters.push("read-date=".concat(this.formatDateValue(this.readDate)));
    }
    if (this.size) {
      parameters.push("size=".concat(this.size));
    }
    // Append parameters to the result string if they exist
    if (parameters.length > 0) {
      result += '; ' + parameters.join('; ');
    }
    return result;
  };
  ContentDisposition.prototype.encodeHeaderValue = function (value) {
    // Encode the value if it contains special characters
    if (/[^\w\d!#$&.+\-^_`|~]/.test(value)) {
      return encodeURIComponent(value);
    }
    return value;
  };
  ContentDisposition.prototype.formatDateValue = function (value) {
    // Format the date using ISO 8601 format
    return value.toISOString();
  };
  ContentDisposition.empty = function () {
    return new ContentDisposition('');
  };
  /**
   * Parse the contentDisposition string and return a ContentDisposition object
   * @param contentDisposition string
   * @returns ContentDisposition object
   */
  ContentDisposition.parse = function (contentDisposition) {
    var parts = contentDisposition.split(';');
    // The first part is the disposition type
    var type = parts[0].trim();
    // Initialize an object with the required type
    var contentDispositionObject = new ContentDisposition(type);
    // Parse the parameters
    for (var i = 1; i < parts.length; i++) {
      var parameter = parts[i].trim();
      var _a = parameter.split('='),
        name_1 = _a[0],
        value = _a[1];
      var trimmedValue = value.trim();
      // Check for encoding and decode if necessary
      var decodedValue = trimmedValue.startsWith('"') && trimmedValue.endsWith('"') ? this.decodeHeaderValue(trimmedValue) : trimmedValue;
      switch (name_1.toLowerCase()) {
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
  };
  ContentDisposition.decodeHeaderValue = function (value) {
    // Remove leading and trailing double quotes and decode the value
    return decodeURIComponent(value.slice(1, -1));
  };
  ContentDisposition.parseDateValue = function (value) {
    var parsedDate = Date.parse(value);
    if (isNaN(parsedDate)) {
      throw new Error('Invalid date format');
    }
    return new Date(parsedDate);
  };
  ContentDisposition.from = function (options) {
    var instance = new ContentDisposition(options.type);
    Object.assign(instance, options);
    return instance;
  };
  ContentDisposition.prototype.clone = function () {
    return ContentDisposition.from(this);
  };
  return ContentDisposition;
}();

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

var ContentType = /** @class */function () {
  function ContentType(_mediaType, _charset) {
    this._mediaType = _mediaType;
    this._charset = _charset;
  }
  ContentType.from = function (mediaType, charset) {
    if (charset === void 0) {
      charset = CharsetEnum.UTF_8;
    }
    return new ContentType(mediaType, charset);
  };
  ContentType.none = function () {
    return ContentType.from('');
  };
  ContentType.prototype.clone = function () {
    return new ContentType(this._mediaType, this._charset);
  };
  ContentType.prototype.toString = function () {
    return this._mediaType + (this._charset ? ';' + this._charset : '');
  };
  ContentType.prototype.mediaType = function () {
    return this._mediaType;
  };
  ContentType.prototype.charset = function () {
    return this._charset;
  };
  ContentType.prototype.isNone = function () {
    return !this._mediaType;
  };
  return ContentType;
}();

var HttpHeadersImpl = /** @class */function () {
  function HttpHeadersImpl(headers) {
    if (headers === void 0) {
      headers = new Map();
    }
    this.headers = headers;
  }
  HttpHeadersImpl.fromNativeHeaders = function (headers) {
    var newHeaders = new HttpHeadersImpl();
    headers.forEach(function (value, key) {
      newHeaders.set(key, value);
    });
    return newHeaders;
  };
  HttpHeadersImpl.empty = function () {
    return new HttpHeadersImpl();
  };
  HttpHeadersImpl.prototype.set = function (name, value) {
    name = name.toLowerCase();
    if (Array.isArray(value)) {
      this.headers.set(name, value);
    } else {
      this.headers.set(name, [value]);
    }
    return this;
  };
  HttpHeadersImpl.prototype.append = function (name, value) {
    name = name.toLowerCase();
    var values = this.get(name);
    this.headers.set(name, values.concat(value));
    return this;
  };
  HttpHeadersImpl.prototype.remove = function (name) {
    this.headers.delete(name);
    return this;
  };
  HttpHeadersImpl.prototype.get = function (name) {
    return this.headers.get(name.toLowerCase()) || [];
  };
  HttpHeadersImpl.prototype.getAll = function () {
    return this.headers;
  };
  HttpHeadersImpl.prototype.mergeAll = function () {
    var _this = this;
    var other = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      other[_i] = arguments[_i];
    }
    other.forEach(function (other) {
      other.getAll().forEach(function (value, key) {
        var values = _this.get(key);
        value.forEach(function (valueItem) {
          if (!values.includes(valueItem)) {
            values.push(valueItem);
          }
        });
        _this.set(key, values);
      });
    });
    return this;
  };
  HttpHeadersImpl.prototype.getContentDisposition = function () {
    var contentDisposition = this.get('Content-Disposition')[0];
    if (!contentDisposition) {
      return ContentDisposition.empty();
    }
    return ContentDisposition.parse(contentDisposition);
  };
  HttpHeadersImpl.prototype.getContentType = function () {
    var contentType = this.get('Content-Type')[0];
    if (!contentType) {
      return ContentType.none();
    }
    var _a = contentType.split(';'),
      media = _a[0],
      charset = _a[1];
    return ContentType.from(media, charset);
  };
  HttpHeadersImpl.prototype.getContentLength = function () {
    var contentLength = this.get('Content-Length')[0];
    var len = parseInt(contentLength);
    return isFinite(len) ? len : 0;
  };
  HttpHeadersImpl.prototype.setAccept = function (contentType) {
    this.set('Accept', contentType.toString());
    return this;
  };
  HttpHeadersImpl.prototype.setBasicAuth = function (username, password) {
    if (typeof username !== 'string' || password && typeof password !== 'string') {
      throw new Error('Username and password must be strings');
    }
    var credentials = btoa("".concat(username, ":").concat(password));
    this.set('Authorization', "Basic ".concat(credentials));
    return this;
  };
  HttpHeadersImpl.prototype.setBearAuth = function (token) {
    this.set('Authorization', "Bearer ".concat(token));
    return this;
  };
  HttpHeadersImpl.prototype.setContentType = function (contentType) {
    this.set('Content-Type', contentType.toString());
    return this;
  };
  HttpHeadersImpl.prototype.setUserAgent = function (userAgent) {
    this.set('User-Agent', userAgent);
    return this;
  };
  HttpHeadersImpl.prototype.setRange = function (range) {
    this.set('Range', range.toString());
    return this;
  };
  HttpHeadersImpl.prototype.toNativeHeaders = function () {
    var nativeHeaders = new Headers({});
    this.headers.forEach(function (value, key) {
      value.forEach(function (valueItem) {
        nativeHeaders.append(key, valueItem);
      });
    });
    return nativeHeaders;
  };
  HttpHeadersImpl.prototype.clone = function () {
    var headers = new Map();
    this.headers.forEach(function (value, key) {
      headers.set(key, value.slice(0));
    });
    return new HttpHeadersImpl(headers);
  };
  return HttpHeadersImpl;
}();

var HttpMethod;
(function (HttpMethod) {
  HttpMethod["GET"] = "GET";
  HttpMethod["HEAD"] = "HEAD";
  HttpMethod["POST"] = "POST";
  HttpMethod["PUT"] = "PUT";
  HttpMethod["DELETE"] = "DELETE";
  HttpMethod["PATCH"] = "PATCH";
})(HttpMethod || (HttpMethod = {}));

var CachedHttpResponse = /** @class */function () {
  function CachedHttpResponse(request, cachedData) {
    this.request = request;
    this.cachedData = cachedData;
    var headersMap = new Map();
    for (var name_1 in cachedData.headers) {
      headersMap.set(name_1, cachedData.headers[name_1]);
    }
    this.headers = new HttpHeadersImpl(headersMap);
    this.status = parseInt(cachedData.status, 10);
    this.statusText = cachedData.statusText;
  }
  CachedHttpResponse.prototype.body = function () {
    return __awaiter(this, void 0, void 0, function () {
      var response;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, fetch(this.cachedData.body)];
          case 1:
            response = _a.sent();
            return [2 /*return*/, response.blob()];
        }
      });
    });
  };
  CachedHttpResponse.prototype.clone = function () {
    return new CachedHttpResponse(this.request, this.cachedData);
  };
  return CachedHttpResponse;
}();
var DefaultCacheStrategy = /** @class */function () {
  function DefaultCacheStrategy() {}
  DefaultCacheStrategy.prototype.execute = function (request, next) {
    switch (request.method) {
      case HttpMethod.PUT:
      case HttpMethod.DELETE:
      case HttpMethod.PATCH:
      case HttpMethod.POST:
        return next();
    }
    var cacheOption = request.cacheOption;
    if (cacheOption === false || typeof cacheOption === 'object' && cacheOption.expire <= 0) {
      return next();
    }
    var provider = request.configuration.storageProvider;
    // TODO: cache provider
    var key = request.key;
    return provider.get(key).then(function (value) {
      if (!value) {
        return next().then(function (response) {
          return serializeResponse(response).then(function (data) {
            return provider.set(key, JSON.stringify(data));
          }).then(function () {
            return response;
          });
        });
      }
      var cachedData = JSON.parse(value);
      return new CachedHttpResponse(request, cachedData);
    });
  };
  DefaultCacheStrategy.prototype.clearCache = function (request) {
    var provider = request.configuration.storageProvider;
    var key = request.key;
    return provider.remove(key);
  };
  return DefaultCacheStrategy;
}();
function serializeResponse(response) {
  return __awaiter(this, void 0, void 0, function () {
    var headersMap, headersRecord, dataURI;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          headersMap = response.headers.getAll();
          headersRecord = {};
          headersMap.forEach(function (value, key) {
            headersRecord[key] = value;
          });
          return [4 /*yield*/, response.body().then(function (blob) {
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            return new Promise(function (resolve, reject) {
              reader.onload = function () {
                resolve(reader.result);
              };
              reader.onerror = reject;
            });
          })];
        case 1:
          dataURI = _a.sent();
          return [2 /*return*/, {
            body: dataURI,
            headers: headersRecord,
            status: response.status + '',
            statusText: response.statusText
          }];
      }
    });
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

var ImmediateTrigger = /** @class */function () {
  function ImmediateTrigger() {}
  ImmediateTrigger.prototype.dispatch = function (requestTrigger) {
    requestTrigger();
    return noop;
  };
  return ImmediateTrigger;
}();

var TimmerTrigger = /** @class */function () {
  function TimmerTrigger(interval) {
    if (interval === void 0) {
      interval = 1000;
    }
    this.interval = interval;
  }
  TimmerTrigger.of = function (interval) {
    return /** @class */function (_super) {
      __extends(class_1, _super);
      function class_1() {
        return _super.call(this, interval) || this;
      }
      return class_1;
    }(TimmerTrigger);
  };
  TimmerTrigger.prototype.dispatch = function (requestTrigger) {
    var timmerId = setInterval(function () {
      requestTrigger();
    }, this.interval);
    return function () {
      clearInterval(timmerId);
    };
  };
  return TimmerTrigger;
}();

var WindowEventTrigger = /** @class */function () {
  function WindowEventTrigger(eventType) {
    this.eventType = eventType;
  }
  WindowEventTrigger.prototype.dispatch = function (requestTrigger) {
    var _this = this;
    var eventListener = function () {
      requestTrigger(true);
    };
    window.addEventListener(this.eventType, eventListener);
    return function () {
      window.removeEventListener(_this.eventType, eventListener);
    };
  };
  return WindowEventTrigger;
}();

var WindowFocusTrigger = /** @class */function (_super) {
  __extends(WindowFocusTrigger, _super);
  function WindowFocusTrigger() {
    return _super.call(this, 'focus') || this;
  }
  return WindowFocusTrigger;
}(WindowEventTrigger);

var OnOnlineTrigger = /** @class */function (_super) {
  __extends(OnOnlineTrigger, _super);
  function OnOnlineTrigger() {
    return _super.call(this, 'online') || this;
  }
  return OnOnlineTrigger;
}(WindowEventTrigger);

var IdleTrigger = /** @class */function () {
  function IdleTrigger() {}
  IdleTrigger.prototype.dispatch = function (requestTrigger) {
    var stopped = false;
    requestIdleCallback(function () {
      if (stopped) return;
      requestTrigger();
    });
    return function () {
      stopped = true;
    };
  };
  return IdleTrigger;
}();

var SmartTrigger = /** @class */function () {
  function SmartTrigger(_a) {
    var interval = _a.interval,
      onFocus = _a.onFocus,
      onOnline = _a.onOnline,
      remain = __rest(_a, ["interval", "onFocus", "onOnline"]);
    this.triggers = [];
    if ('idle' in remain && remain.idle) {
      this.triggers.push(new IdleTrigger());
    } else if ('immediate' in remain && remain.immediate) {
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
  SmartTrigger.prototype.dispatch = function (requestTrigger) {
    var promise;
    function ensureSingleTrigger() {
      return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          if (!!promise) {
            return [2 /*return*/];
          }
          promise = requestTrigger().finally(function () {
            promise = undefined;
          });
          return [2 /*return*/];
        });
      });
    }
    var stops = this.triggers.map(function (trigger) {
      return trigger.dispatch(ensureSingleTrigger);
    });
    return function () {
      stops.forEach(function (stop) {
        return stop();
      });
    };
  };
  return SmartTrigger;
}();

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

var Defer = /** @class */function () {
  function Defer() {
    var _this = this;
    this.promise = new Promise(function (resolve, reject) {
      _this.resolve = resolve;
      _this.reject = reject;
    });
  }
  return Defer;
}();

var EmptyEntity = /** @class */function () {
  function EmptyEntity() {}
  EmptyEntity.prototype.contentType = function () {
    return ContentType.none();
  };
  EmptyEntity.prototype.data = function () {
    return Promise.resolve(new Blob([]));
  };
  EmptyEntity.prototype.size = function () {
    return 0;
  };
  EmptyEntity.prototype.clone = function () {
    return new EmptyEntity();
  };
  return EmptyEntity;
}();

var FormDataEntity = /** @class */function () {
  function FormDataEntity(formdata) {
    this.formdata = formdata;
  }
  FormDataEntity.prototype.contentType = function () {
    return ContentType.none();
  };
  FormDataEntity.prototype.data = function () {
    return Promise.resolve(this.formdata);
  };
  FormDataEntity.prototype.size = function () {
    return -1;
  };
  FormDataEntity.prototype.clone = function () {
    var _this = this;
    var newFormData = new FormData();
    this.formdata.forEach(function (value, key) {
      _this.formdata.append(key, value);
    });
    return new FormDataEntity(newFormData);
  };
  return FormDataEntity;
}();

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

var JSONEntity = /** @class */function () {
  function JSONEntity(_getJson) {
    this._getJson = _getJson;
  }
  JSONEntity.prototype.contentType = function () {
    return ContentType.from(MediaTypeEnum.APPLICATION_JSON, CharsetEnum.UTF_8);
  };
  JSONEntity.prototype.data = function () {
    return __awaiter(this, void 0, void 0, function () {
      var json;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.jsonPromise];
          case 1:
            json = _a.sent();
            return [2 /*return*/, new Blob([json], {
              type: MediaTypeEnum.APPLICATION_JSON
            })];
        }
      });
    });
  };
  JSONEntity.prototype.parsed = function () {
    return __awaiter(this, void 0, void 0, function () {
      var obj;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.jsonObjectPromise];
          case 1:
            obj = _a.sent();
            return [2 /*return*/, obj];
        }
      });
    });
  };
  JSONEntity.prototype.size = function () {
    throw new Error('Method not implemented.');
  };
  JSONEntity.prototype.clone = function () {
    return new JSONEntity(this._getJson);
  };
  __decorate([lazy.lazyMember(function () {
    return this._getJson();
  }), __metadata("design:type", Promise)], JSONEntity.prototype, "jsonPromise", void 0);
  __decorate([lazy.lazyMember(function () {
    return __awaiter(this, void 0, void 0, function () {
      var json;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.jsonPromise];
          case 1:
            json = _a.sent();
            return [2 /*return*/, JSON.parse(json)];
        }
      });
    });
  }), __metadata("design:type", Promise)], JSONEntity.prototype, "jsonObjectPromise", void 0);
  return JSONEntity;
}();

var OctetStreamEntity = /** @class */function () {
  function OctetStreamEntity(_getData, _size) {
    this._getData = _getData;
    this._size = _size;
  }
  OctetStreamEntity.prototype.contentType = function () {
    return ContentType.from('application/octet-stream');
  };
  OctetStreamEntity.prototype.data = function () {
    return this.dataPromise;
  };
  OctetStreamEntity.prototype.size = function () {
    return this._size;
  };
  OctetStreamEntity.prototype.clone = function () {
    return new OctetStreamEntity(this._getData, this._size);
  };
  __decorate([lazy.lazyMember(function (instance) {
    return instance._getData();
  }), __metadata("design:type", Promise)], OctetStreamEntity.prototype, "dataPromise", void 0);
  return OctetStreamEntity;
}();

var PlainTextEntity = /** @class */function () {
  function PlainTextEntity(_text) {
    this._text = _text;
  }
  PlainTextEntity.prototype.contentType = function () {
    return ContentType.from('text/plain');
  };
  PlainTextEntity.prototype.data = function () {
    return Promise.resolve(this._data);
  };
  PlainTextEntity.prototype.size = function () {
    return this._data.size;
  };
  PlainTextEntity.prototype.clone = function () {
    return new PlainTextEntity(this._text);
  };
  __decorate([lazy.lazyMember(function (instance) {
    var encoder = new TextEncoder();
    var u8a = encoder.encode(instance._text);
    return new Blob([u8a], {
      type: instance.contentType().toString()
    });
  }), __metadata("design:type", Blob)], PlainTextEntity.prototype, "_data", void 0);
  return PlainTextEntity;
}();

var URLSearchParamsEntity = /** @class */function () {
  function URLSearchParamsEntity(formdata) {
    this.formdata = formdata;
  }
  URLSearchParamsEntity.prototype.contentType = function () {
    return ContentType.none();
  };
  URLSearchParamsEntity.prototype.data = function () {
    return Promise.resolve(this.formdata);
  };
  URLSearchParamsEntity.prototype.size = function () {
    return -1;
  };
  URLSearchParamsEntity.prototype.clone = function () {
    var _this = this;
    var newFormData = new URLSearchParams();
    this.formdata.forEach(function (value, key) {
      _this.formdata.append(key, value);
    });
    return new URLSearchParamsEntity(newFormData);
  };
  return URLSearchParamsEntity;
}();

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
    var json_1 = JSON.stringify(data);
    return new JSONEntity(function () {
      return Promise.resolve(json_1);
    });
  }
  if (isHttpEntity(data)) {
    return data;
  }
  if (isArrayBufferView(data) || data instanceof ArrayBuffer) {
    return new OctetStreamEntity(function () {
      return Promise.resolve(new Blob([data]));
    }, data.byteLength);
  }
  if (data instanceof Blob) {
    return new OctetStreamEntity(function () {
      return Promise.resolve(data);
    }, data.size);
  }
  if (data instanceof FormData) {
    return new FormDataEntity(data);
  }
  if (data instanceof URLSearchParams) {
    return new URLSearchParamsEntity(data);
  }
  if (data instanceof ReadableStream) {
    return new OctetStreamEntity(function () {
      return Promise.resolve(data);
    }, -1);
  }
  return new PlainTextEntity(data + '');
}

function mergeURLSearchParams() {
  var params = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    params[_i] = arguments[_i];
  }
  var result = new URLSearchParams();
  params.forEach(function (params) {
    if (params instanceof URLSearchParams) {
      params.forEach(function (value, key) {
        result.append(key, value);
      });
    } else if (isObject(params)) {
      var _loop_1 = function (key) {
        var value = params[key];
        if (Array.isArray(value)) {
          value.forEach(function (it) {
            result.append(key, it + '');
          });
        } else {
          result.append(key, value + '');
        }
      };
      for (var key in params) {
        _loop_1(key);
      }
    }
  });
  return result;
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

var HttpRequestImpl = /** @class */function () {
  function HttpRequestImpl(configuration, requestOptions) {
    this.configuration = configuration;
    this.requestOptions = requestOptions;
    this.listeners = new Map();
    var path = resolvePath(requestOptions.path, requestOptions.params || {}, requestOptions.parameterEncoder || function (value) {
      return value + '';
    });
    var url = resolveURL(configuration.baseUrl, path);
    var searchParams = mergeURLSearchParams(configuration.search, url.searchParams, requestOptions.search);
    url.search = searchParams.toString();
    this.url = url;
    var body = createEntity(requestOptions.body);
    this.body = body;
    this.headers = requestOptions.headers ? configuration.headers.mergeAll(requestOptions.headers) : configuration.headers.clone();
    this.method = requestOptions.method || HttpMethod.GET;
    this.cacheOption = requestOptions.cache || false;
    this.fetcher = requestOptions.fetcher || configuration.fetcher;
  }
  HttpRequestImpl.prototype.on = function (type, listener) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    var listeners = this.listeners.get(type);
    var store = listener.bind(this);
    listeners.push(store);
    return function () {
      var index = listeners.indexOf(store);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };
  HttpRequestImpl.prototype.dispatch = function (event) {
    var listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach(function (listener) {
        return listener(event);
      });
    }
  };
  HttpRequestImpl.prototype.clone = function () {
    return new HttpRequestImpl(this.configuration, this.requestOptions);
  };
  Object.defineProperty(HttpRequestImpl.prototype, "key", {
    get: function () {
      if (this.requestOptions['key']) {
        return this.requestOptions.key;
      }
      return this.url.toString();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HttpRequestImpl.prototype, "interceptors", {
    get: function () {
      return this.configuration.interceptors.concat(this.requestOptions.interceptors || []);
    },
    enumerable: false,
    configurable: true
  });
  return HttpRequestImpl;
}();
var REGEXP_DYNAMIC_SEGMENT = /{([^}?]+)\??}/;
var REGEXP_OPTIONAL_DYNAMIC_SEGMENT = /\/?{([^}?]+)\?}/g;
function resolvePath(path, params, parameterEncoder) {
  var regexp = new RegExp(REGEXP_DYNAMIC_SEGMENT, 'g');
  var dynamicSegmentKeys = new Set();
  var match;
  while ((match = regexp.exec(path)) !== null) {
    dynamicSegmentKeys.add(match[1]);
  }
  dynamicSegmentKeys.forEach(function (key) {
    if (!(key in params)) {
      return;
    }
    var pattern = new RegExp("{".concat(key, "\\??}"), 'g');
    var value = params[key];
    path = path.replace(pattern, function () {
      return parameterEncoder(value);
    });
  });
  path = path.replace(REGEXP_OPTIONAL_DYNAMIC_SEGMENT, '');
  var missingDynamicSegmentMatch = path.match(REGEXP_DYNAMIC_SEGMENT);
  if (missingDynamicSegmentMatch) {
    throw new Error(
    // eslint-disable-next-line max-len
    "[solidium-http-client] required parameter missing (".concat(missingDynamicSegmentMatch[1], "), \"").concat(path, "\" cannot be resolved"));
  }
  // https://www.rfc-editor.org/rfc/rfc1738#section-3.3
  if (path[0] !== '/' && path.length > 0) {
    path = "/".concat(path);
  }
  return path;
}

var PassiveTrigger = /** @class */function () {
  function PassiveTrigger() {}
  PassiveTrigger.prototype.dispatch = function () {
    return noop;
  };
  return PassiveTrigger;
}();

var ResourceStatus;
(function (ResourceStatus) {
  ResourceStatus["IDLE"] = "idle";
  ResourceStatus["PENDING"] = "pending";
  ResourceStatus["SUCCESS"] = "success";
  ResourceStatus["FAILURE"] = "failure";
})(ResourceStatus || (ResourceStatus = {}));
var ActuatorResource = /** @class */function () {
  function ActuatorResource() {
    this.status = ResourceStatus.IDLE;
    this.uploadProgress = 0;
    this.downloadProgress = 0;
    this.stopTrigger = noop;
    this.responseDefer = new Defer();
  }
  Object.defineProperty(ActuatorResource.prototype, "idle", {
    get: function () {
      return this.status === ResourceStatus.IDLE;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ActuatorResource.prototype, "pending", {
    get: function () {
      return this.status === ResourceStatus.PENDING;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ActuatorResource.prototype, "success", {
    get: function () {
      return this.status === ResourceStatus.SUCCESS;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ActuatorResource.prototype, "failure", {
    get: function () {
      return this.status === ResourceStatus.FAILURE;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ActuatorResource.prototype, "completed", {
    get: function () {
      return this.success || this.failure;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ActuatorResource.prototype, "response", {
    get: function () {
      return this._response;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ActuatorResource.prototype, "error", {
    get: function () {
      return this._error;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ActuatorResource.prototype, "responsePromise", {
    get: function () {
      return this.responseDefer.promise;
    },
    enumerable: false,
    configurable: true
  });
  ActuatorResource.prototype.init = function (configuration, createResourceOptions) {
    var _this = this;
    this.stopTrigger();
    this.configuration = configuration;
    this.createResourceOptions = createResourceOptions;
    var trigger = createTrigger(this.appCtx, createResourceOptions.trigger) || configuration.trigger || new PassiveTrigger();
    this.stopTrigger = trigger.dispatch(function () {
      return _this.fetch({});
    });
  };
  ActuatorResource.prototype.onCleanup = function () {
    this.stopTrigger();
  };
  ActuatorResource.prototype.fetch = function (options) {
    return __awaiter(this, void 0, void 0, function () {
      var configuration, response, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.pending) return [3 /*break*/, 5];
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3,, 4]);
            return [4 /*yield*/, this.responseDefer.promise];
          case 2:
            _a.sent();
            return [3 /*break*/, 4];
          case 3:
            _a.sent();
            return [3 /*break*/, 4];
          case 4:
            this.responseDefer = new Defer();
            _a.label = 5;
          case 5:
            this.status = ResourceStatus.PENDING;
            this._response = undefined;
            this._error = undefined;
            _a.label = 6;
          case 6:
            _a.trys.push([6, 9,, 10]);
            configuration = this.configuration;
            return [4 /*yield*/, this.executeRequest(options)];
          case 7:
            response = _a.sent();
            return [4 /*yield*/, configuration.validateStatus(response)];
          case 8:
            _a.sent();
            this.status = ResourceStatus.SUCCESS;
            this._response = response;
            this.responseDefer.resolve(response);
            return [3 /*break*/, 10];
          case 9:
            error_1 = _a.sent();
            this.status = ResourceStatus.FAILURE;
            this.responseDefer.reject(error_1);
            return [3 /*break*/, 10];
          case 10:
            return [2 /*return*/];
        }
      });
    });
  };
  ActuatorResource.prototype.executeRequest = function (options) {
    return __awaiter(this, void 0, void 0, function () {
      var configuration, executeRequest, interceptedRequestExecutor;
      var _this = this;
      return __generator(this, function (_a) {
        configuration = this.configuration;
        executeRequest = function (request) {
          return __awaiter(_this, void 0, void 0, function () {
            var cacheStrategy;
            var _this = this;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  cacheStrategy = request.configuration.cacheStrategy;
                  if (!options.clearCache) return [3 /*break*/, 2];
                  return [4 /*yield*/, cacheStrategy.clearCache(request)];
                case 1:
                  _a.sent();
                  _a.label = 2;
                case 2:
                  return [2 /*return*/, request.configuration.cacheStrategy.execute(request, function (cachedResponse) {
                    return __awaiter(_this, void 0, void 0, function () {
                      var fetcher, cleanupUploadProgressEventListener_1, cleanupDownloadProgressEventListener_1;
                      var _this = this;
                      return __generator(this, function (_a) {
                        if (cachedResponse) {
                          return [2 /*return*/, Promise.resolve(cachedResponse)];
                        } else {
                          fetcher = request.fetcher;
                          cleanupUploadProgressEventListener_1 = request.on('uploadprogress', function (e) {
                            _this.uploadProgress = e.uploadedBytes / e.totalBytes;
                          });
                          cleanupDownloadProgressEventListener_1 = request.on('downloadprogress', function (e) {
                            _this.downloadProgress = e.uploadedBytes / e.totalBytes;
                          });
                          return [2 /*return*/, fetcher(request).finally(function () {
                            cleanupDownloadProgressEventListener_1();
                            cleanupUploadProgressEventListener_1();
                          })];
                        }
                      });
                    });
                  })];
              }
            });
          });
        };
        interceptedRequestExecutor = configuration.interceptors.reduceRight(function (next, interceptor) {
          return function (request) {
            return interceptor.intercept(request, next);
          };
        }, executeRequest);
        return [2 /*return*/, interceptedRequestExecutor(this.createRequest(options))];
      });
    });
  };
  ActuatorResource.prototype.createRequest = function (fetchOptions) {
    var requestOptions = __assign({}, this.createResourceOptions);
    if (fetchOptions.body) {
      requestOptions.body = fetchOptions.body;
    }
    if (fetchOptions.headers) {
      if (!requestOptions.headers) {
        requestOptions.headers = fetchOptions.headers;
      } else {
        requestOptions.headers = requestOptions.headers.mergeAll(requestOptions.headers);
      }
    }
    if (fetchOptions.search) {
      requestOptions.search = __assign(__assign({}, requestOptions.search), fetchOptions.search);
    }
    if (fetchOptions.params) {
      requestOptions.params = __assign(__assign({}, requestOptions.params), fetchOptions.params);
    }
    return new HttpRequestImpl(this.configuration, requestOptions);
  };
  __decorate([ioc.Inject(), __metadata("design:type", ioc.ApplicationContext)], ActuatorResource.prototype, "appCtx", void 0);
  __decorate([solidium.Signal(), __metadata("design:type", String)], ActuatorResource.prototype, "status", void 0);
  __decorate([solidium.Signal(), __metadata("design:type", Number)], ActuatorResource.prototype, "uploadProgress", void 0);
  __decorate([solidium.Signal(), __metadata("design:type", Number)], ActuatorResource.prototype, "downloadProgress", void 0);
  __decorate([solidium.Signal(), __metadata("design:type", Object)], ActuatorResource.prototype, "_response", void 0);
  __decorate([solidium.Signal(), __metadata("design:type", Object)], ActuatorResource.prototype, "_error", void 0);
  __decorate([ioc.PreDestroy(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], ActuatorResource.prototype, "onCleanup", null);
  ActuatorResource = __decorate([ioc.Scope(ioc.InstanceScope.TRANSIENT)], ActuatorResource);
  return ActuatorResource;
}();

var HttpInterceptorRegistryImpl = /** @class */function () {
  function HttpInterceptorRegistryImpl() {
    this.interceptors = [];
  }
  HttpInterceptorRegistryImpl.prototype.addInterceptor = function (interceptor, name) {
    if (typeof interceptor === 'function') {
      this.interceptors.push({
        name: name,
        intercept: function (request, next) {
          return interceptor(request, next);
        }
      });
    } else {
      this.interceptors.push(interceptor);
    }
  };
  HttpInterceptorRegistryImpl.prototype.getInterceptors = function () {
    return this.interceptors.slice(0);
  };
  return HttpInterceptorRegistryImpl;
}();

function internalValidateStatus(response) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      if (response.status >= 400) {
        throw new Error(response.statusText);
      }
      return [2 /*return*/];
    });
  });
}

var HttpEvent = /** @class */function () {
  function HttpEvent(request) {
    this.request = request;
  }
  return HttpEvent;
}();

var DownloadProgressEvent = /** @class */function (_super) {
  __extends(DownloadProgressEvent, _super);
  function DownloadProgressEvent(request, totalBytes, uploadedBytes) {
    var _this = _super.call(this, request) || this;
    _this.request = request;
    _this.totalBytes = totalBytes;
    _this.uploadedBytes = uploadedBytes;
    _this.type = 'downloadprogress';
    return _this;
  }
  return DownloadProgressEvent;
}(HttpEvent);

var RequestEndEvent = /** @class */function (_super) {
  __extends(RequestEndEvent, _super);
  function RequestEndEvent() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.type = 'end';
    return _this;
  }
  return RequestEndEvent;
}(HttpEvent);

var RequestStartEvent = /** @class */function (_super) {
  __extends(RequestStartEvent, _super);
  function RequestStartEvent() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.type = 'start';
    return _this;
  }
  return RequestStartEvent;
}(HttpEvent);

var TimeoutEvent = /** @class */function (_super) {
  __extends(TimeoutEvent, _super);
  function TimeoutEvent() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.type = 'timeout';
    return _this;
  }
  return TimeoutEvent;
}(HttpEvent);

var UploadProgressEvent = /** @class */function (_super) {
  __extends(UploadProgressEvent, _super);
  function UploadProgressEvent(request, totalBytes, uploadedBytes) {
    var _this = _super.call(this, request) || this;
    _this.request = request;
    _this.totalBytes = totalBytes;
    _this.uploadedBytes = uploadedBytes;
    _this.type = 'uploadprogress';
    return _this;
  }
  return UploadProgressEvent;
}(HttpEvent);

var builtinFetcher = function (request) {
  return __awaiter(void 0, void 0, void 0, function () {
    var body;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, resolveBody(request)];
        case 1:
          body = _a.sent();
          if (body instanceof ReadableStream) {
            return [2 /*return*/, fetchRequestImpl(request, body)];
          } else {
            return [2 /*return*/, xhrRequestImpl(request, body)];
          }
      }
    });
  });
};
function resolveBody(request) {
  return __awaiter(this, void 0, void 0, function () {
    var cannotHaveBody, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          cannotHaveBody = request.method === HttpMethod.GET || request.method === HttpMethod.HEAD;
          if (!cannotHaveBody) return [3 /*break*/, 1];
          _a = undefined;
          return [3 /*break*/, 3];
        case 1:
          return [4 /*yield*/, request.body.data()];
        case 2:
          _a = _b.sent();
          _b.label = 3;
        case 3:
          return [2 /*return*/, _a];
      }
    });
  });
}
function resolveHeaders(request) {
  var requestNativeHeaders = new Headers({});
  var requestHeadersMap = request.headers.getAll();
  requestHeadersMap.forEach(function (values, key) {
    values.forEach(function (value) {
      requestNativeHeaders.append(key, value);
    });
  });
  var contentType = request.body.contentType();
  if (!contentType.isNone() && !requestNativeHeaders.has('Content-Type')) {
    requestNativeHeaders.set('Content-Type', contentType.toString());
  }
  return requestNativeHeaders;
}
function xhrRequestImpl(request, body) {
  return __awaiter(this, void 0, void 0, function () {
    var xhr, defer, requestHeaders, headersMap, headers, responseBody, response;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (body instanceof ReadableStream) {
            return [2 /*return*/, fetchRequestImpl(request, body)];
          }
          xhr = new XMLHttpRequest();
          defer = new Defer();
          requestHeaders = resolveHeaders(request);
          requestHeaders.forEach(function (value, key) {
            xhr.setRequestHeader(key, value);
          });
          xhr.upload.addEventListener('progress', function (ev) {
            request.dispatch(new UploadProgressEvent(request, ev.total, ev.loaded));
          });
          xhr.addEventListener('progress', function (ev) {
            request.dispatch(new DownloadProgressEvent(request, ev.total, ev.loaded));
          });
          xhr.addEventListener('loadend', function () {
            defer.resolve(null);
            request.dispatch(new RequestEndEvent(request));
          });
          xhr.addEventListener('loadstart', function () {
            request.dispatch(new RequestStartEvent(request));
          });
          xhr.addEventListener('timeout', function () {
            request.dispatch(new TimeoutEvent(request));
          });
          xhr.open(request.method, request.url, true, request.url.username, request.url.password);
          xhr.send(body);
          return [4 /*yield*/, defer.promise];
        case 1:
          _a.sent();
          headersMap = resolveAllResponseHeaders(xhr);
          headers = new HttpHeadersImpl(headersMap);
          responseBody = resolveResponseData(xhr);
          response = {
            body: function () {
              return Promise.resolve(responseBody);
            },
            headers: headers,
            status: xhr.status,
            statusText: xhr.statusText,
            request: request,
            clone: function () {
              return __assign({}, response);
            }
          };
          return [2 /*return*/, response];
      }
    });
  });
}
function resolveAllResponseHeaders(xhr) {
  var xhrHeaders = xhr.getAllResponseHeaders();
  return xhrHeaders.split('\r\n').map(function (item) {
    return item.split(':');
  }).reduce(function (map, _a) {
    var _b;
    var key = _a[0],
      value = _a[1];
    if (map.has(key)) {
      (_b = map.get(key)) === null || _b === void 0 ? void 0 : _b.push(value);
    } else {
      map.set(key, [value]);
    }
    return map;
  }, new Map());
}
function resolveResponseData(xhr) {
  switch (xhr.responseType) {
    case 'blob':
      return xhr.response;
    case 'json':
      return new Blob([xhr.response], {
        type: 'application/json'
      });
    case 'arraybuffer':
      var contentType = xhr.getResponseHeader('content-type');
      return new Blob([xhr.response], {
        type: contentType || 'application/octet-stream'
      });
    case 'document':
    default:
      if (xhr.status < 200 || xhr.status >= 500) {
        return new Blob([xhr.response]);
      }
  }
  return new Blob([]);
}
function fetchRequestImpl(request, body) {
  return __awaiter(this, void 0, void 0, function () {
    var headers, response, responseHeaders, bodyPromise;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          headers = resolveHeaders(request);
          return [4 /*yield*/, fetch(request.url, {
            method: request.method,
            headers: headers,
            body: body
          })];
        case 1:
          response = _a.sent();
          responseHeaders = HttpHeadersImpl.fromNativeHeaders(response.headers);
          return [2 /*return*/, {
            body: function () {
              if (!bodyPromise) {
                bodyPromise = response.blob();
              }
              return bodyPromise;
            },
            headers: responseHeaders,
            status: response.status,
            statusText: response.statusText,
            request: request
          }];
      }
    });
  });
}

var HttpClient = /** @class */function () {
  function HttpClient() {
    this.configurationOptions = {};
    this.interceptorRegistry = new HttpInterceptorRegistryImpl();
  }
  HttpClient.configure = function (configuration) {
    /** @class */(function () {
      function HttpConfigurationFactory() {}
      HttpConfigurationFactory.prototype.getConfiguration = function () {
        return configuration;
      };
      __decorate([ioc.Factory(HTTP_CONFIGURATION), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], HttpConfigurationFactory.prototype, "getConfiguration", null);
      return HttpConfigurationFactory;
    })();
    return HttpClient;
  };
  HttpClient.prototype.afterInjected = function () {
    var _a;
    var _this = this;
    var _b;
    var _c = this.configurationOptions,
      baseUrl = _c.baseUrl,
      headers = _c.headers,
      interceptors = _c.interceptors,
      search = _c.search,
      fetcher = _c.fetcher,
      storageProviderClass = _c.storageProvider,
      cacheStrategyClass = _c.cacheStrategy,
      triggerOption = _c.trigger;
    var appCtx = this.appCtx;
    var storageProvider = appCtx.getInstance(storageProviderClass || MemoryStorageProvider);
    var cacheStrategy = appCtx.getInstance(cacheStrategyClass || DefaultCacheStrategy);
    var defaultTrigger = createTrigger(this.appCtx, triggerOption || {
      immediate: true
    });
    this.configuration = {
      baseUrl: undefined,
      interceptors: [],
      headers: HttpHeadersImpl.empty(),
      search: {},
      fetcher: fetcher || builtinFetcher,
      storageProvider: storageProvider,
      cacheStrategy: cacheStrategy,
      trigger: defaultTrigger,
      clone: function () {
        return __assign(__assign({}, this), {
          interceptors: this.interceptors.slice(0),
          search: __assign({}, this.search),
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
      for (var key in headers) {
        this.configuration.headers.set(key, headers[key]);
      }
    }
    if (interceptors) {
      interceptors.forEach(function (interceptor) {
        if (typeof interceptor === 'function') {
          _this.interceptorRegistry.addInterceptor({
            name: 'functional-interceptor',
            intercept: interceptor
          });
        } else {
          _this.interceptorRegistry.addInterceptor(interceptor);
        }
      });
    }
    this.configuration.search = mergeURLSearchParams(this.configuration.search, search);
    (_b = this.configurers) === null || _b === void 0 ? void 0 : _b.forEach(function (configurer) {
      configurer.configHeaders && configurer.configHeaders(_this.configuration.headers);
      configurer.addInterceptors && configurer.addInterceptors(_this.interceptorRegistry);
    });
    (_a = this.configuration.interceptors).push.apply(_a, this.interceptorRegistry.getInterceptors());
  };
  HttpClient.prototype.createResource = function (options) {
    var worker = this.appCtx.getInstance(ActuatorResource);
    worker.init(this.configuration.clone(), options);
    return worker;
  };
  __decorate([ioc.Inject(HTTP_CONFIGURATION), __metadata("design:type", Object)], HttpClient.prototype, "configurationOptions", void 0);
  __decorate([ioc.Inject(HTTP_CONFIGURER), __metadata("design:type", Array)], HttpClient.prototype, "configurers", void 0);
  __decorate([ioc.Inject(), __metadata("design:type", ioc.ApplicationContext)], HttpClient.prototype, "appCtx", void 0);
  __decorate([ioc.PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], HttpClient.prototype, "afterInjected", null);
  return HttpClient;
}();

var DelegateResponse = /** @class */function () {
  function DelegateResponse(origin) {
    this.origin = origin;
  }
  DelegateResponse.prototype.body = function () {
    return this.origin.body();
  };
  Object.defineProperty(DelegateResponse.prototype, "headers", {
    get: function () {
      return this.origin.headers;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DelegateResponse.prototype, "status", {
    get: function () {
      return this.origin.status;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DelegateResponse.prototype, "statusText", {
    get: function () {
      return this.origin.statusText;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DelegateResponse.prototype, "request", {
    get: function () {
      return this.origin.request;
    },
    enumerable: false,
    configurable: true
  });
  return DelegateResponse;
}();
var DelegateResource = /** @class */function () {
  function DelegateResource(target) {
    this.target = target;
  }
  Object.defineProperty(DelegateResource.prototype, "idle", {
    get: function () {
      return this.target.idle;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DelegateResource.prototype, "pending", {
    get: function () {
      return this.target.pending;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DelegateResource.prototype, "success", {
    get: function () {
      return this.target.success;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DelegateResource.prototype, "failure", {
    get: function () {
      return this.target.failure;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DelegateResource.prototype, "completed", {
    get: function () {
      return this.target.completed;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DelegateResource.prototype, "error", {
    get: function () {
      return this.target.error;
    },
    enumerable: false,
    configurable: true
  });
  DelegateResource.prototype.fetch = function (options) {
    return this.target.fetch(options);
  };
  return DelegateResource;
}();

var DataHttpResponse = /** @class */function (_super) {
  __extends(DataHttpResponse, _super);
  function DataHttpResponse(origin, owner, parser) {
    var _this = _super.call(this, origin) || this;
    _this.origin = origin;
    _this.owner = owner;
    _this.parser = parser;
    _this._dataSignal = solidJs.runWithOwner(owner, function () {
      return solidJs.createSignal();
    });
    _this._parserErrorSignal = solidJs.runWithOwner(owner, function () {
      return solidJs.createSignal();
    });
    _this.origin.body().then(function (blob) {
      return parser(blob).catch(function (reason) {
        _this._parserErrorSignal[1](reason);
        return undefined;
      });
    }).then(function (data) {
      _this._dataSignal[1](data);
    });
    return _this;
  }
  DataHttpResponse.prototype.clone = function () {
    return new DataHttpResponse(this.origin.clone(), this.owner, this.parser);
  };
  Object.defineProperty(DataHttpResponse.prototype, "data", {
    get: function () {
      return this._dataSignal[0]();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DataHttpResponse.prototype, "parser_error", {
    get: function () {
      return this._parserErrorSignal[0]();
    },
    enumerable: false,
    configurable: true
  });
  return DataHttpResponse;
}(DelegateResponse);
var DataResource = /** @class */function (_super) {
  __extends(DataResource, _super);
  function DataResource(target, parser) {
    var _this = _super.call(this, target) || this;
    _this.parser = parser;
    _this.owner = solidJs.getOwner();
    return _this;
  }
  Object.defineProperty(DataResource.prototype, "data", {
    get: function () {
      var _a;
      return (_a = this.response) === null || _a === void 0 ? void 0 : _a.data;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DataResource.prototype, "parser_error", {
    get: function () {
      var _a;
      return (_a = this.response) === null || _a === void 0 ? void 0 : _a.parser_error;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(DataResource.prototype, "responsePromise", {
    get: function () {
      var _this = this;
      return this.target.responsePromise.then(function () {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return _this.response;
      });
    },
    enumerable: false,
    configurable: true
  });
  __decorate([lazy.lazyMember({
    evaluate: function (instance) {
      var origin = instance.target.response;
      return origin ? new DataHttpResponse(origin, instance.owner, instance.parser) : undefined;
    },
    resetBy: [function (instance) {
      return instance.target.response;
    }],
    enumerable: true
  }), __metadata("design:type", Object)], DataResource.prototype, "response", void 0);
  return DataResource;
}(DelegateResource);

function useHttpClient() {
  return solidium.useService(HttpClient);
}

function useResource(options) {
  var client = useHttpClient();
  return client.createResource(options);
}

function useData(options, parser) {
  var res = useResource(options);
  return new DataResource(res, parser);
}

function useArrayBuffer(options) {
  return useData(options, function (blob) {
    return blob.arrayBuffer();
  });
}

function useJSON(options) {
  return useData(options, function (blob) {
    return blob.text().then(function (text) {
      return JSON.parse(text);
    });
  });
}

function usePlainText(options) {
  return useData(options, function (blob) {
    return blob.text();
  });
}

function useBlob(options) {
  return useData(options, function (blob) {
    return Promise.resolve(blob);
  });
}

function chunkIterator(readableStream) {
  return __asyncGenerator(this, arguments, function chunkIterator_1() {
    var reader, _a, value, done;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          reader = readableStream.getReader();
          _b.label = 1;
        case 1:
          return [4 /*yield*/, __await(reader.read())];
        case 2:
          _a = _b.sent(), value = _a.value, done = _a.done;
          if (!done) return [3 /*break*/, 4];
          return [4 /*yield*/, __await(void 0)];
        case 3:
          return [2 /*return*/, _b.sent()];
        case 4:
          return [4 /*yield*/, __await(value)];
        case 5:
          return [4 /*yield*/, _b.sent()];
        case 6:
          _b.sent();
          return [3 /*break*/, 1];
        case 7:
          return [2 /*return*/];
      }
    });
  });
}

var SSEResponse = /** @class */function () {
  function SSEResponse(origin, owner, chunkParser) {
    var _this = this;
    this.origin = origin;
    this.owner = owner;
    this.chunkParser = chunkParser;
    this._dataSignal = solidJs.runWithOwner(this.owner, function () {
      return solidJs.createSignal([]);
    });
    (function () {
      return __awaiter(_this, void 0, void 0, function () {
        var blob, decoder, _a, _b, _c, chunk, chunkText, text, data, _d, allData, setAllData, e_1_1;
        var _e, e_1, _f, _g;
        return __generator(this, function (_h) {
          switch (_h.label) {
            case 0:
              return [4 /*yield*/, this.origin.body()];
            case 1:
              blob = _h.sent();
              decoder = new TextDecoder();
              _h.label = 2;
            case 2:
              _h.trys.push([2, 7, 8, 13]);
              _a = true, _b = __asyncValues(chunkIterator(blob.stream()));
              _h.label = 3;
            case 3:
              return [4 /*yield*/, _b.next()];
            case 4:
              if (!(_c = _h.sent(), _e = _c.done, !_e)) return [3 /*break*/, 6];
              _g = _c.value;
              _a = false;
              chunk = _g;
              chunkText = decoder.decode(chunk);
              text = chunkText.replace(/^data:\s+/, '').replace(/\n+^/, '');
              data = chunkParser(text);
              _d = this._dataSignal, allData = _d[0], setAllData = _d[1];
              setAllData(allData().concat(data));
              _h.label = 5;
            case 5:
              _a = true;
              return [3 /*break*/, 3];
            case 6:
              return [3 /*break*/, 13];
            case 7:
              e_1_1 = _h.sent();
              e_1 = {
                error: e_1_1
              };
              return [3 /*break*/, 13];
            case 8:
              _h.trys.push([8,, 11, 12]);
              if (!(!_a && !_e && (_f = _b.return))) return [3 /*break*/, 10];
              return [4 /*yield*/, _f.call(_b)];
            case 9:
              _h.sent();
              _h.label = 10;
            case 10:
              return [3 /*break*/, 12];
            case 11:
              if (e_1) throw e_1.error;
              return [7 /*endfinally*/];
            case 12:
              return [7 /*endfinally*/];
            case 13:
              return [2 /*return*/];
          }
        });
      });
    })();
  }
  SSEResponse.prototype.body = function () {
    return this.origin.body();
  };
  Object.defineProperty(SSEResponse.prototype, "headers", {
    get: function () {
      return this.origin.headers;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SSEResponse.prototype, "status", {
    get: function () {
      return this.origin.status;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SSEResponse.prototype, "statusText", {
    get: function () {
      return this.origin.statusText;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SSEResponse.prototype, "request", {
    get: function () {
      return this.origin.request;
    },
    enumerable: false,
    configurable: true
  });
  SSEResponse.prototype.clone = function () {
    return new SSEResponse(this.origin, this.owner, this.chunkParser);
  };
  Object.defineProperty(SSEResponse.prototype, "data", {
    get: function () {
      return this._dataSignal[0]();
    },
    enumerable: false,
    configurable: true
  });
  return SSEResponse;
}();
var SSEResource = /** @class */function (_super) {
  __extends(SSEResource, _super);
  function SSEResource(target, parser) {
    var _this = _super.call(this, target) || this;
    _this.parser = parser;
    _this.owner = solidJs.getOwner();
    return _this;
  }
  Object.defineProperty(SSEResource.prototype, "chunk", {
    /**
     * @description Get the last chunk of data
     */
    get: function () {
      var data = this.data;
      return data[data.length - 1];
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SSEResource.prototype, "data", {
    get: function () {
      var _a;
      return ((_a = this.response) === null || _a === void 0 ? void 0 : _a.data) || [];
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(SSEResource.prototype, "responsePromise", {
    get: function () {
      var _this = this;
      return this.target.responsePromise.then(function () {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return _this.response;
      });
    },
    enumerable: false,
    configurable: true
  });
  __decorate([lazy.lazyMember({
    evaluate: function (instance) {
      var origin = instance.target.response;
      return origin ? new SSEResponse(origin, instance.owner, instance.parser) : undefined;
    },
    resetBy: [function (instance) {
      return instance.target.response;
    }],
    enumerable: true
  }), __metadata("design:type", Object)], SSEResource.prototype, "response", void 0);
  return SSEResource;
}(DelegateResource);

function useSSE(options, chunkParser) {
  var headers = options.headers || new HttpHeadersImpl();
  headers.set('Accept', 'text/event-stream');
  var worker = useResource(__assign(__assign({}, options), {
    headers: headers,
    cache: false
  }));
  return new SSEResource(worker, chunkParser);
}

var HTTP_PROPERTY_MARK_KEY = Symbol('solidium-http-mark-key');
function defineHttpDecorator(afterInstantiation) {
  return solidium.defineMemberDecoratorProcessor(HTTP_PROPERTY_MARK_KEY, {
    afterInstantiation: function (instance, member) {
      afterInstantiation(instance, member);
      return instance;
    }
  });
}
var Http = function (options, parser) {
  return defineHttpDecorator(function (instance, member) {
    instance[member] = useData(options, parser);
  });
};
Http.JSON = function (options) {
  return defineHttpDecorator(function (instance, member) {
    instance[member] = useJSON(options);
  });
};
Http.JSONData = function (options) {
  return defineHttpDecorator(function (instance, member) {
    var resource = useJSON(options);
    Object.defineProperty(instance, member, {
      get: function () {
        return resource.data;
      }
    });
  });
};
Http.SSE = function (options, chunkParser) {
  if (chunkParser === void 0) {
    chunkParser = function (chunk) {
      return JSON.parse(chunk);
    };
  }
  return defineHttpDecorator(function (instance, member) {
    instance[member] = useSSE(options, chunkParser);
  });
};

exports.HTTP_PROPERTY_MARK_KEY = HTTP_PROPERTY_MARK_KEY;
exports.Http = Http;
exports.HttpClient = HttpClient;
exports.useArrayBuffer = useArrayBuffer;
exports.useBlob = useBlob;
exports.useData = useData;
exports.useJSON = useJSON;
exports.usePlainText = usePlainText;
//# sourceMappingURL=index.cjs.js.map
