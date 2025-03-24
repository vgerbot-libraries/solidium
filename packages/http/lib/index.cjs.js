'use strict';

var ioc = require('@vgerbot/ioc');
var lazy = require('@vgerbot/lazy');
var solidium = require('@vgerbot/solidium');
var rxjs = require('rxjs');
var solidJs = require('solid-js');
var scheduled = require('@solid-primitives/scheduled');

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

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : undefined, done: true };
    }
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

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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

var HttpResponse = /** @class */function () {
  function HttpResponse(source, init) {
    this.source = source;
    this.init = init;
  }
  HttpResponse.prototype.status = function () {
    return this.source.status();
  };
  HttpResponse.prototype.headers = function () {
    return this.source.headers();
  };
  HttpResponse.prototype.body = function () {
    return this.source.body();
  };
  HttpResponse.prototype.text = function (encoding) {
    return __awaiter(this, undefined, undefined, function () {
      var stream, buffer, decoder;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.body()];
          case 1:
            stream = _a.sent();
            return [4 /*yield*/, stream.readAsBuffer()];
          case 2:
            buffer = _a.sent();
            decoder = new TextDecoder(encoding);
            return [2 /*return*/, decoder.decode(buffer)];
        }
      });
    });
  };
  HttpResponse.prototype.json = function () {
    return __awaiter(this, undefined, undefined, function () {
      var text;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.text()];
          case 1:
            text = _a.sent();
            return [2 /*return*/, JSON.parse(text)];
        }
      });
    });
  };
  HttpResponse.prototype.textStream = function () {
    return __asyncGenerator(this, arguments, function textStream_1(encoding) {
      var byteStream, stream, reader, decoder, _a, done, value;
      if (encoding === undefined) {
        encoding = 'UTF-8';
      }
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4 /*yield*/, __await(this.source.body())];
          case 1:
            byteStream = _b.sent();
            stream = byteStream.readAsStream();
            reader = stream.getReader();
            decoder = new TextDecoder(encoding);
            _b.label = 2;
          case 2:
            return [4 /*yield*/, __await(reader.read())];
          case 3:
            _a = _b.sent(), done = _a.done, value = _a.value;
            if (done) {
              return [3 /*break*/, 6];
            }
            return [4 /*yield*/, __await(decoder.decode(value, {}))];
          case 4:
            return [4 /*yield*/, _b.sent()];
          case 5:
            _b.sent();
            return [3 /*break*/, 2];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  };
  HttpResponse.prototype.jsonStream = function () {
    return __asyncGenerator(this, arguments, function jsonStream_1(encoding) {
      var regex, _a, _b, _c, chunk, _d, event_1, data, e_1_1;
      var _e, e_1, _f, _g;
      var _h;
      if (encoding === undefined) {
        encoding = 'UTF-8';
      }
      return __generator(this, function (_j) {
        switch (_j.label) {
          case 0:
            regex = /event:\s*?([^\s\n\r]+?)[\n\r\s]*data:\s*?(.*?)\s*$/i;
            _j.label = 1;
          case 1:
            _j.trys.push([1, 8, 9, 14]);
            _a = true, _b = __asyncValues(this.textStream(encoding));
            _j.label = 2;
          case 2:
            return [4 /*yield*/, __await(_b.next())];
          case 3:
            if (!(_c = _j.sent(), _e = _c.done, !_e)) return [3 /*break*/, 7];
            _g = _c.value;
            _a = false;
            chunk = _g;
            _d = (_h = regex.exec(chunk)) !== null && _h !== undefined ? _h : [], event_1 = _d[1], data = _d[2];
            if (event_1 !== 'message' || !data) {
              return [3 /*break*/, 6];
            }
            return [4 /*yield*/, __await(JSON.parse(data))];
          case 4:
            return [4 /*yield*/, _j.sent()];
          case 5:
            _j.sent();
            _j.label = 6;
          case 6:
            _a = true;
            return [3 /*break*/, 2];
          case 7:
            return [3 /*break*/, 14];
          case 8:
            e_1_1 = _j.sent();
            e_1 = {
              error: e_1_1
            };
            return [3 /*break*/, 14];
          case 9:
            _j.trys.push([9,, 12, 13]);
            if (!(!_a && !_e && (_f = _b.return))) return [3 /*break*/, 11];
            return [4 /*yield*/, __await(_f.call(_b))];
          case 10:
            _j.sent();
            _j.label = 11;
          case 11:
            return [3 /*break*/, 13];
          case 12:
            if (e_1) throw e_1.error;
            return [7 /*endfinally*/];
          case 13:
            return [7 /*endfinally*/];
          case 14:
            return [2 /*return*/];
        }
      });
    });
  };
  HttpResponse.prototype.onUpload = function (listener) {
    return this.source.onUpload(listener);
  };
  HttpResponse.prototype.onDownload = function (listener) {
    return this.source.onDownload(listener);
  };
  return HttpResponse;
}();

var _a, _b;
exports.PromiseStatus = void 0;
(function (PromiseStatus) {
  PromiseStatus["PENDING"] = "pending";
  PromiseStatus["FULFILLED"] = "fulfilled";
  PromiseStatus["REJECTED"] = "rejected";
})(exports.PromiseStatus || (exports.PromiseStatus = {}));
var STATUS = Symbol('status');
var FULFILLED_VALUE = Symbol('fullfilled-value');
var REJECTED_REASON = Symbol('rejected-reason');
var ABORT_CONTROLLER$1 = Symbol('abort-controller');
var Defer = /** @class */function () {
  function Defer() {
    var _this = this;
    this[_a] = exports.PromiseStatus.PENDING;
    this[_b] = new AbortController();
    var _resolve;
    var _reject;
    var doResolve = function (value) {
      _this[FULFILLED_VALUE] = value;
      _this[STATUS] = exports.PromiseStatus.FULFILLED;
      _resolve(value);
    };
    this.resolve = function (value) {
      if (_this.isSettled) {
        return;
      }
      if (isPromiseLike(value)) {
        value.then(doResolve);
      } else {
        doResolve(value);
      }
    };
    this.reject = function (reason) {
      if (_this.isSettled) {
        return;
      }
      _this[REJECTED_REASON] = reason;
      _this[STATUS] = exports.PromiseStatus.REJECTED;
      _reject(reason);
    };
    this.promise = new Promise(function (resolve, reject) {
      _resolve = resolve;
      _reject = reject;
    });
  }
  Defer.resolve = function (value) {
    var defer = new Defer();
    defer.resolve(value);
    return defer;
  };
  Defer.reject = function (reason) {
    var defer = new Defer();
    defer.reject(reason);
    return defer;
  };
  Defer.fromArray = function (array, mapfn) {
    var defer = new Defer();
    if (typeof mapfn !== 'function') {
      Promise.all(Array.from(array)).then(defer.resolve, defer.reject);
    } else {
      Promise.all(Array.from(array, function (value) {
        if (defer.isCancelled) {
          return Promise.reject(defer.rejectedReason);
        }
        return mapfn(value);
      })).then(defer.resolve, defer.reject);
    }
    return defer;
  };
  // static all<T extends readonly unknown[]>(values: T, mapfn?: (value: T[keyof T]) => Promise<unknown>) {
  //     const defer = new Defer<{
  //         -readonly [P in keyof T]: Awaited<T[P]>;
  //     }>();
  //     return defer;
  // }
  Defer.serial = function (array) {
    var _this = this;
    var defer = new Defer();
    Array.from(array).reduce(function (acc, item) {
      return __awaiter(_this, undefined, undefined, function () {
        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              return [4 /*yield*/, acc];
            case 1:
              _c.sent();
              if (defer.isCancelled) {
                return [2 /*return*/];
              }
              return [4 /*yield*/, item()];
            case 2:
              _c.sent();
              return [2 /*return*/];
          }
        });
      });
    }, Promise.resolve()).then(defer.resolve, defer.reject);
    return defer.promise;
  };
  Object.defineProperty(Defer.prototype, "status", {
    get: function () {
      return this[STATUS];
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Defer.prototype, "isSettled", {
    get: function () {
      return this.status !== exports.PromiseStatus.PENDING;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Defer.prototype, "fullfilledValue", {
    get: function () {
      return this[FULFILLED_VALUE];
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Defer.prototype, "rejectedReason", {
    get: function () {
      return this[REJECTED_REASON];
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Defer.prototype, "isCancelled", {
    get: function () {
      return this[REJECTED_REASON] instanceof CancellationError;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Defer.prototype, "signal", {
    get: function () {
      return this[ABORT_CONTROLLER$1].signal;
    },
    enumerable: false,
    configurable: true
  });
  Defer.prototype.abort = function (message) {
    this[ABORT_CONTROLLER$1].abort();
    this.reject(new CancellationError(message));
  };
  Defer.prototype.invokeOnCompletion = function (completionHandler) {
    var _this = this;
    if (this.isSettled) {
      completionHandler.call(this, this[REJECTED_REASON]);
      return noop;
    }
    var disposed = false;
    this.promise.finally(function () {
      if (disposed) {
        return;
      }
      completionHandler.call(_this, _this[REJECTED_REASON]);
    });
    return function () {
      disposed = true;
    };
  };
  return Defer;
}();
_a = STATUS, _b = ABORT_CONTROLLER$1;
var CancellationError = /** @class */function (_super) {
  __extends(CancellationError, _super);
  function CancellationError(message) {
    var _this = _super.call(this, message) || this;
    _this.name = 'CancellationError';
    return _this;
  }
  return CancellationError;
}(Error);
function isPromiseLike(value) {
  return value != null && typeof value === 'object' && typeof value.then === 'function';
}
function noop() {}

var Events = /** @class */function () {
  function Events() {
    this.listeners = new Map();
  }
  Events.prototype.on = function (event, listener) {
    var _this = this;
    var _a;
    var wrappedListener = function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      listener.apply(undefined, args);
    };
    var listeners = (_a = this.listeners.get(event)) !== null && _a !== undefined ? _a : new Set();
    listeners.add(wrappedListener);
    if (!this.listeners.has(event)) {
      this.listeners.set(event, listeners);
    }
    return function () {
      var listeners = _this.listeners.get(event);
      if (listeners) {
        listeners.delete(wrappedListener);
      }
    };
  };
  Events.prototype.emit = function (event) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    (_a = this.listeners.get(event)) === null || _a === undefined ? undefined : _a.forEach(function (listener) {
      listener.apply(undefined, args);
    });
  };
  return Events;
}();

var HttpHeaders = /** @class */function () {
  function HttpHeaders(init) {
    this.headers = new Map();
    if (init) {
      this.setAll(init);
    }
  }
  HttpHeaders.prototype.set = function (name) {
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      values[_i - 1] = arguments[_i];
    }
    this.headers.set(name, values);
  };
  HttpHeaders.prototype.setAll = function (headers) {
    var _this = this;
    if (headers instanceof Headers) {
      headers.forEach(function (value, name) {
        _this.set(name, value);
      });
    } else if (headers instanceof Map) {
      headers.forEach(function (value, key) {
        if (Array.isArray(value)) {
          _this.set.apply(_this, __spreadArray([key], value, false));
        } else {
          _this.set(key, value);
        }
      });
    } else {
      for (var key in headers) {
        var value = headers[key];
        if (Array.isArray(value)) {
          this.set.apply(this, __spreadArray([key], value, false));
        } else {
          this.set(key, value);
        }
      }
    }
  };
  HttpHeaders.prototype.append = function (name) {
    var _a;
    var values = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      values[_i - 1] = arguments[_i];
    }
    var originValues = (_a = this.headers.get(name)) !== null && _a !== undefined ? _a : [];
    var newValues = originValues.concat(values);
    this.headers.set(name, newValues);
  };
  HttpHeaders.prototype.get = function (name) {
    return this.headers.get(name);
  };
  HttpHeaders.prototype.delete = function (name) {
    this.headers.delete(name);
  };
  HttpHeaders.prototype.has = function (name) {
    return this.headers.has(name);
  };
  HttpHeaders.prototype.concat = function (other) {
    var result = new HttpHeaders(this.headers);
    other.forEach(function (key, value) {
      result.set.apply(result, __spreadArray([key], value, false));
    });
    return result;
  };
  HttpHeaders.prototype.forEach = function (callback) {
    this.headers.forEach(function (value, key) {
      callback(key, value);
    });
  };
  HttpHeaders.prototype.toNative = function () {
    var result = new Headers();
    this.forEach(function (key, value) {
      result.append(key, value.join(', '));
    });
    return result;
  };
  HttpHeaders.prototype[Symbol.iterator] = function () {
    return this.headers[Symbol.iterator]();
  };
  HttpHeaders.prototype[Symbol.toStringTag] = function () {
    return 'HttpHeaders';
  };
  HttpHeaders.prototype.clone = function () {
    return new HttpHeaders(this.headers);
  };
  HttpHeaders.prototype.toJSON = function () {
    var result = {};
    this.headers.forEach(function (value, key) {
      result[key] = value;
    });
    return result;
  };
  HttpHeaders.prototype.clear = function () {
    this.headers.clear();
  };
  return HttpHeaders;
}();

var Progress = /** @class */function () {
  function Progress(total, loaded, chunk) {
    this.total = total;
    this.loaded = loaded;
    this.chunk = chunk;
  }
  Progress.prototype.percent = function (suffix, fractionDigits) {
    if (suffix === undefined) {
      suffix = '%';
    }
    if (fractionDigits === undefined) {
      fractionDigits = 2;
    }
    var p = Math.pow(10, fractionDigits);
    return (this.total ? Math.trunc(this.loaded / this.total * 100 * p + 0.5) / p : 0).toFixed(fractionDigits) + suffix;
  };
  return Progress;
}();

var ProgressiveByteStream = /** @class */function () {
  function ProgressiveByteStream() {
    this.events = new Events();
  }
  ProgressiveByteStream.prototype.onProgress = function (handler) {
    return this.events.on('progress', handler);
  };
  ProgressiveByteStream.prototype.updateProgress = function (progress) {
    this.events.emit('progress', progress);
  };
  return ProgressiveByteStream;
}();

var NativeReadableStream = /** @class */function (_super) {
  __extends(NativeReadableStream, _super);
  function NativeReadableStream(contentLength, stream) {
    var _this = _super.call(this) || this;
    _this.contentLength = contentLength;
    _this.stream = stream;
    return _this;
  }
  NativeReadableStream.prototype.total = function () {
    return Promise.resolve(this.contentLength);
  };
  NativeReadableStream.prototype.readAsBuffer = function () {
    return __awaiter(this, undefined, undefined, function () {
      var reader, chunks, _a, done, value, realTotal, result, offset, _i, chunks_1, chunk;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            reader = this.readAsStream().getReader();
            chunks = [];
            _b.label = 1;
          case 1:
            return [4 /*yield*/, reader.read()];
          case 2:
            _a = _b.sent(), done = _a.done, value = _a.value;
            if (done) {
              return [3 /*break*/, 3];
            }
            chunks.push(new Uint8Array(value));
            return [3 /*break*/, 1];
          case 3:
            realTotal = chunks.reduce(function (sum, it) {
              return sum + it.byteLength;
            }, 0);
            result = new Uint8Array(realTotal);
            {
              offset = 0;
              for (_i = 0, chunks_1 = chunks; _i < chunks_1.length; _i++) {
                chunk = chunks_1[_i];
                result.set(chunk, offset);
                offset += chunk.byteLength;
              }
            }
            return [2 /*return*/, result.buffer];
        }
      });
    });
  };
  NativeReadableStream.prototype.readAsStream = function () {
    var stream = this.stream;
    var total = this.contentLength;
    var loaded = 0;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var that = this;
    return new ReadableStream({
      start: function (controller) {
        that.updateProgress(new Progress(total, 0));
        var reader = stream.getReader();
        reader.read().then(function process(_a) {
          var done = _a.done,
            value = _a.value;
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
  };
  NativeReadableStream.prototype.readAsBlob = function () {
    return __awaiter(this, arguments, undefined, function (contentType) {
      var reader, chunks, _a, chunk, done;
      if (contentType === undefined) {
        contentType = 'application/octet-stream';
      }
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            reader = this.readAsStream().getReader();
            chunks = [];
            _b.label = 1;
          case 1:
            return [4 /*yield*/, reader.read()];
          case 2:
            _a = _b.sent(), chunk = _a.value, done = _a.done;
            if (done) {
              return [3 /*break*/, 3];
            }
            chunks.push(new Blob([chunk]));
            return [3 /*break*/, 1];
          case 3:
            return [2 /*return*/, new Blob(chunks, {
              type: contentType
            })];
        }
      });
    });
  };
  return NativeReadableStream;
}(ProgressiveByteStream);

var BlobByteStream = /** @class */function (_super) {
  __extends(BlobByteStream, _super);
  function BlobByteStream(blob) {
    return _super.call(this, blob.size, blob.stream()) || this;
  }
  return BlobByteStream;
}(NativeReadableStream);

var IGNORE_DUPLICATE_OF = new Set(['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent']);
function parseHeaders(rawHeaders) {
  var result = new Map();
  if (!(rawHeaders === null || rawHeaders === undefined ? undefined : rawHeaders.trim())) {
    return result;
  }
  rawHeaders.split(/[\r\n]+/).forEach(function (line) {
    var _a;
    var colonIndex = line.indexOf(':');
    var key = line.substring(0, colonIndex).trim().toLowerCase();
    var value = line.substring(colonIndex + 1).trim();
    if (!key || result.has(key) && IGNORE_DUPLICATE_OF.has(key)) {
      return;
    }
    var values = (_a = result.get(key)) !== null && _a !== undefined ? _a : [];
    values.push(value);
    result.set(key, values);
  });
  return result;
}

var XMLHttpRequestAdapter = /** @class */function () {
  function XMLHttpRequestAdapter(options) {
    var _this = this;
    this.events = new Events();
    this.headersDefer = new Defer();
    this.bodyDefer = new Defer();
    this.statusDefer = new Defer();
    this.isAborted = false;
    var xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url);
    xhr.responseType = 'blob';
    options.headers.forEach(function (name, values) {
      xhr.setRequestHeader(name, values.join(','));
    });
    xhr.addEventListener('progress', function (event) {
      if (!event.lengthComputable) {
        return;
      }
      _this.events.emit('download', new Progress(event.total, event.loaded));
    });
    xhr.upload.addEventListener('progress', function (event) {
      if (!event.lengthComputable) {
        return;
      }
      _this.events.emit('upload', new Progress(event.total, event.loaded));
    });
    this.executeRequestIfNeed = function () {
      return __awaiter(_this, undefined, undefined, function () {
        var reader, chunks, _a, value, done;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              this.executeRequestIfNeed = function () {
                return undefined;
              };
              if (this.isAborted) {
                return [2 /*return*/];
              }
              if (!options.payload) return [3 /*break*/, 6];
              if (!(options.payload instanceof ReadableStream)) return [3 /*break*/, 4];
              reader = options.payload.getReader();
              chunks = [];
              _b.label = 1;
            case 1:
              return [4 /*yield*/, reader.read()];
            case 2:
              _a = _b.sent(), value = _a.value, done = _a.done;
              if (value) {
                chunks.push(value);
              }
              if (done) {
                return [3 /*break*/, 3];
              }
              return [3 /*break*/, 1];
            case 3:
              xhr.send(new Blob(chunks));
              return [3 /*break*/, 5];
            case 4:
              xhr.send(options.payload);
              _b.label = 5;
            case 5:
              return [3 /*break*/, 7];
            case 6:
              xhr.send();
              _b.label = 7;
            case 7:
              return [2 /*return*/];
          }
        });
      });
    };
    xhr.addEventListener('readystatechange', function () {
      var _a;
      if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
        var rawHeaders = xhr.getAllResponseHeaders();
        var headers = new HttpHeaders(parseHeaders(rawHeaders));
        _this.headersDefer.resolve(headers);
        _this.statusDefer.resolve(xhr.status);
      } else if (xhr.readyState === XMLHttpRequest.DONE) {
        _this.bodyDefer.resolve(new BlobByteStream((_a = xhr.response) !== null && _a !== undefined ? _a : new Blob([])));
      }
    });
    this.xhr = xhr;
    if (options.signal.aborted) {
      this.isAborted = true;
      xhr.abort();
    } else {
      options.signal.addEventListener('abort', function () {
        _this.isAborted = true;
        xhr.abort();
      });
    }
  }
  XMLHttpRequestAdapter.prototype.abort = function () {
    this.isAborted = true;
    this.xhr.abort();
  };
  XMLHttpRequestAdapter.prototype.execute = function () {
    return __awaiter(this, undefined, undefined, function () {
      var _a, headersDefer, bodyDefer, statusDefer, events;
      return __generator(this, function (_b) {
        this.executeRequestIfNeed();
        _a = this, headersDefer = _a.headersDefer, bodyDefer = _a.bodyDefer, statusDefer = _a.statusDefer, events = _a.events;
        return [2 /*return*/, {
          status: function () {
            return statusDefer.promise;
          },
          headers: function () {
            return headersDefer.promise;
          },
          body: function () {
            return bodyDefer.promise;
          },
          onDownload: function (listener) {
            return events.on('download', listener);
          },
          onUpload: function (listener) {
            return events.on('upload', listener);
          }
        }];
      });
    });
  };
  return XMLHttpRequestAdapter;
}();

function isURL(text) {
  return /^\w+:\/\/\S+/.test(text);
}

function joinPath() {
  var paths = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    paths[_i] = arguments[_i];
  }
  return paths.reduce(function (baseUrl, path) {
    var cleanedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    var cleanedPath = path.startsWith('/') ? path.slice(1) : path;
    return "".concat(cleanedBaseUrl, "/").concat(cleanedPath);
  });
}

function resolveURL(routeTemplate, pathVariables, queryParameters) {
  var pathParamReplacedURL = routeTemplate.replace(/(:([a-z]+))/gi, function (fullMatch, placeholder, variableName) {
    var _a, _b;
    if (variableName in pathVariables) {
      return (_b = (_a = pathVariables[variableName]) === null || _a === undefined ? undefined : _a.toString()) !== null && _b !== undefined ? _b : fullMatch;
    }
    return fullMatch;
  });
  var urlObject = new URL(pathParamReplacedURL);
  queryParameters.forEach(function (value, key) {
    if (Array.isArray(value)) {
      value.forEach(function (arrayItem) {
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
var HttpError = /** @class */function (_super) {
  __extends(HttpError, _super);
  function HttpError(message, cause) {
    var _this = _super.call(this, message) || this;
    _this.cause = cause;
    _this.name = _this.constructor.name;
    return _this;
  }
  return HttpError;
}(Error);

/**
 * Error thrown when a request times out
 */
var TimeoutError = /** @class */function (_super) {
  __extends(TimeoutError, _super);
  function TimeoutError(message, context, cause) {
    if (message === undefined) {
      message = 'Request timed out';
    }
    var _this = _super.call(this, message, cause) || this;
    _this.context = context;
    return _this;
  }
  return TimeoutError;
}(HttpError);
/**
 * Error thrown when there's a network issue
 */
var NetworkError = /** @class */function (_super) {
  __extends(NetworkError, _super);
  function NetworkError(message, cause) {
    if (message === undefined) {
      message = 'Network error occurred';
    }
    return _super.call(this, message, cause) || this;
  }
  return NetworkError;
}(HttpError);
/**
 * Error thrown when a request is aborted
 */
var AbortError = /** @class */function (_super) {
  __extends(AbortError, _super);
  function AbortError(message, cause) {
    if (message === undefined) {
      message = 'Request was aborted';
    }
    return _super.call(this, message, cause) || this;
  }
  return AbortError;
}(HttpError);
/**
 * Error thrown when there's an issue parsing the response
 */
var ParseError = /** @class */function (_super) {
  __extends(ParseError, _super);
  function ParseError(message, cause) {
    if (message === undefined) {
      message = 'Failed to parse response';
    }
    return _super.call(this, message, cause) || this;
  }
  return ParseError;
}(HttpError);

/**
 * Base class for HTTP status code errors
 */
var HttpStatusError = /** @class */function (_super) {
  __extends(HttpStatusError, _super);
  function HttpStatusError(status, statusText, headers, responseBody, message) {
    var _this = _super.call(this, message || "HTTP Error ".concat(status, ": ").concat(statusText)) || this;
    _this.status = status;
    _this.statusText = statusText;
    _this.headers = headers;
    _this.responseBody = responseBody;
    return _this;
  }
  Object.defineProperty(HttpStatusError.prototype, "isClientError", {
    /**
     * Check if this is a client error (4xx)
     */
    get: function () {
      return this.status >= 400 && this.status < 500;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HttpStatusError.prototype, "isServerError", {
    /**
     * Check if this is a server error (5xx)
     */
    get: function () {
      return this.status >= 500;
    },
    enumerable: false,
    configurable: true
  });
  return HttpStatusError;
}(HttpError);

/**
 * 400 Bad Request
 */
var BadRequestError = /** @class */function (_super) {
  __extends(BadRequestError, _super);
  function BadRequestError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Bad Request';
    }
    return _super.call(this, 400, 'Bad Request', headers, responseBody, message) || this;
  }
  return BadRequestError;
}(HttpStatusError);
/**
 * 401 Unauthorized
 */
var UnauthorizedError = /** @class */function (_super) {
  __extends(UnauthorizedError, _super);
  function UnauthorizedError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Unauthorized';
    }
    return _super.call(this, 401, 'Unauthorized', headers, responseBody, message) || this;
  }
  return UnauthorizedError;
}(HttpStatusError);
/**
 * 402 Payment Required
 */
var PaymentRequiredError = /** @class */function (_super) {
  __extends(PaymentRequiredError, _super);
  function PaymentRequiredError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Payment Required';
    }
    return _super.call(this, 402, 'Payment Required', headers, responseBody, message) || this;
  }
  return PaymentRequiredError;
}(HttpStatusError);
/**
 * 403 Forbidden
 */
var ForbiddenError = /** @class */function (_super) {
  __extends(ForbiddenError, _super);
  function ForbiddenError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Forbidden';
    }
    return _super.call(this, 403, 'Forbidden', headers, responseBody, message) || this;
  }
  return ForbiddenError;
}(HttpStatusError);
/**
 * 404 Not Found
 */
var NotFoundError = /** @class */function (_super) {
  __extends(NotFoundError, _super);
  function NotFoundError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Not Found';
    }
    return _super.call(this, 404, 'Not Found', headers, responseBody, message) || this;
  }
  return NotFoundError;
}(HttpStatusError);
/**
 * 405 Method Not Allowed
 */
var MethodNotAllowedError = /** @class */function (_super) {
  __extends(MethodNotAllowedError, _super);
  function MethodNotAllowedError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Method Not Allowed';
    }
    return _super.call(this, 405, 'Method Not Allowed', headers, responseBody, message) || this;
  }
  return MethodNotAllowedError;
}(HttpStatusError);
/**
 * 406 Not Acceptable
 */
var NotAcceptableError = /** @class */function (_super) {
  __extends(NotAcceptableError, _super);
  function NotAcceptableError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Not Acceptable';
    }
    return _super.call(this, 406, 'Not Acceptable', headers, responseBody, message) || this;
  }
  return NotAcceptableError;
}(HttpStatusError);
/**
 * 407 Proxy Authentication Required
 */
var ProxyAuthenticationRequiredError = /** @class */function (_super) {
  __extends(ProxyAuthenticationRequiredError, _super);
  function ProxyAuthenticationRequiredError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Proxy Authentication Required';
    }
    return _super.call(this, 407, 'Proxy Authentication Required', headers, responseBody, message) || this;
  }
  return ProxyAuthenticationRequiredError;
}(HttpStatusError);
/**
 * 408 Request Timeout
 */
var RequestTimeoutError = /** @class */function (_super) {
  __extends(RequestTimeoutError, _super);
  function RequestTimeoutError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Request Timeout';
    }
    return _super.call(this, 408, 'Request Timeout', headers, responseBody, message) || this;
  }
  return RequestTimeoutError;
}(HttpStatusError);
/**
 * 409 Conflict
 */
var ConflictError = /** @class */function (_super) {
  __extends(ConflictError, _super);
  function ConflictError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Conflict';
    }
    return _super.call(this, 409, 'Conflict', headers, responseBody, message) || this;
  }
  return ConflictError;
}(HttpStatusError);
/**
 * 410 Gone
 */
var GoneError = /** @class */function (_super) {
  __extends(GoneError, _super);
  function GoneError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Gone';
    }
    return _super.call(this, 410, 'Gone', headers, responseBody, message) || this;
  }
  return GoneError;
}(HttpStatusError);
/**
 * 411 Length Required
 */
var LengthRequiredError = /** @class */function (_super) {
  __extends(LengthRequiredError, _super);
  function LengthRequiredError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Length Required';
    }
    return _super.call(this, 411, 'Length Required', headers, responseBody, message) || this;
  }
  return LengthRequiredError;
}(HttpStatusError);
/**
 * 412 Precondition Failed
 */
var PreconditionFailedError = /** @class */function (_super) {
  __extends(PreconditionFailedError, _super);
  function PreconditionFailedError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Precondition Failed';
    }
    return _super.call(this, 412, 'Precondition Failed', headers, responseBody, message) || this;
  }
  return PreconditionFailedError;
}(HttpStatusError);
/**
 * 413 Payload Too Large
 */
var PayloadTooLargeError = /** @class */function (_super) {
  __extends(PayloadTooLargeError, _super);
  function PayloadTooLargeError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Payload Too Large';
    }
    return _super.call(this, 413, 'Payload Too Large', headers, responseBody, message) || this;
  }
  return PayloadTooLargeError;
}(HttpStatusError);
/**
 * 414 URI Too Long
 */
var URITooLongError = /** @class */function (_super) {
  __extends(URITooLongError, _super);
  function URITooLongError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'URI Too Long';
    }
    return _super.call(this, 414, 'URI Too Long', headers, responseBody, message) || this;
  }
  return URITooLongError;
}(HttpStatusError);
/**
 * 415 Unsupported Media Type
 */
var UnsupportedMediaTypeError = /** @class */function (_super) {
  __extends(UnsupportedMediaTypeError, _super);
  function UnsupportedMediaTypeError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Unsupported Media Type';
    }
    return _super.call(this, 415, 'Unsupported Media Type', headers, responseBody, message) || this;
  }
  return UnsupportedMediaTypeError;
}(HttpStatusError);
/**
 * 416 Range Not Satisfiable
 */
var RangeNotSatisfiableError = /** @class */function (_super) {
  __extends(RangeNotSatisfiableError, _super);
  function RangeNotSatisfiableError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Range Not Satisfiable';
    }
    return _super.call(this, 416, 'Range Not Satisfiable', headers, responseBody, message) || this;
  }
  return RangeNotSatisfiableError;
}(HttpStatusError);
/**
 * 417 Expectation Failed
 */
var ExpectationFailedError = /** @class */function (_super) {
  __extends(ExpectationFailedError, _super);
  function ExpectationFailedError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Expectation Failed';
    }
    return _super.call(this, 417, 'Expectation Failed', headers, responseBody, message) || this;
  }
  return ExpectationFailedError;
}(HttpStatusError);
/**
 * 418 I'm a teapot
 */
var ImATeapotError = /** @class */function (_super) {
  __extends(ImATeapotError, _super);
  function ImATeapotError(headers, responseBody,
  // eslint-disable-next-line quotes
  message) {
    if (message === undefined) {
      message = "I'm a teapot";
    }
    // eslint-disable-next-line quotes
    return _super.call(this, 418, "I'm a teapot", headers, responseBody, message) || this;
  }
  return ImATeapotError;
}(HttpStatusError);
/**
 * 421 Misdirected Request
 */
var MisdirectedRequestError = /** @class */function (_super) {
  __extends(MisdirectedRequestError, _super);
  function MisdirectedRequestError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Misdirected Request';
    }
    return _super.call(this, 421, 'Misdirected Request', headers, responseBody, message) || this;
  }
  return MisdirectedRequestError;
}(HttpStatusError);
/**
 * 422 Unprocessable Entity
 */
var UnprocessableEntityError = /** @class */function (_super) {
  __extends(UnprocessableEntityError, _super);
  function UnprocessableEntityError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Unprocessable Entity';
    }
    return _super.call(this, 422, 'Unprocessable Entity', headers, responseBody, message) || this;
  }
  return UnprocessableEntityError;
}(HttpStatusError);
/**
 * 423 Locked
 */
var LockedError = /** @class */function (_super) {
  __extends(LockedError, _super);
  function LockedError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Locked';
    }
    return _super.call(this, 423, 'Locked', headers, responseBody, message) || this;
  }
  return LockedError;
}(HttpStatusError);
/**
 * 424 Failed Dependency
 */
var FailedDependencyError = /** @class */function (_super) {
  __extends(FailedDependencyError, _super);
  function FailedDependencyError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Failed Dependency';
    }
    return _super.call(this, 424, 'Failed Dependency', headers, responseBody, message) || this;
  }
  return FailedDependencyError;
}(HttpStatusError);
/**
 * 425 Too Early
 */
var TooEarlyError = /** @class */function (_super) {
  __extends(TooEarlyError, _super);
  function TooEarlyError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Too Early';
    }
    return _super.call(this, 425, 'Too Early', headers, responseBody, message) || this;
  }
  return TooEarlyError;
}(HttpStatusError);
/**
 * 426 Upgrade Required
 */
var UpgradeRequiredError = /** @class */function (_super) {
  __extends(UpgradeRequiredError, _super);
  function UpgradeRequiredError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Upgrade Required';
    }
    return _super.call(this, 426, 'Upgrade Required', headers, responseBody, message) || this;
  }
  return UpgradeRequiredError;
}(HttpStatusError);
/**
 * 428 Precondition Required
 */
var PreconditionRequiredError = /** @class */function (_super) {
  __extends(PreconditionRequiredError, _super);
  function PreconditionRequiredError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Precondition Required';
    }
    return _super.call(this, 428, 'Precondition Required', headers, responseBody, message) || this;
  }
  return PreconditionRequiredError;
}(HttpStatusError);
/**
 * 429 Too Many Requests
 */
var TooManyRequestsError = /** @class */function (_super) {
  __extends(TooManyRequestsError, _super);
  function TooManyRequestsError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Too Many Requests';
    }
    return _super.call(this, 429, 'Too Many Requests', headers, responseBody, message) || this;
  }
  return TooManyRequestsError;
}(HttpStatusError);
/**
 * 431 Request Header Fields Too Large
 */
var RequestHeaderFieldsTooLargeError = /** @class */function (_super) {
  __extends(RequestHeaderFieldsTooLargeError, _super);
  function RequestHeaderFieldsTooLargeError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Request Header Fields Too Large';
    }
    return _super.call(this, 431, 'Request Header Fields Too Large', headers, responseBody, message) || this;
  }
  return RequestHeaderFieldsTooLargeError;
}(HttpStatusError);
/**
 * 451 Unavailable For Legal Reasons
 */
var UnavailableForLegalReasonsError = /** @class */function (_super) {
  __extends(UnavailableForLegalReasonsError, _super);
  function UnavailableForLegalReasonsError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Unavailable For Legal Reasons';
    }
    return _super.call(this, 451, 'Unavailable For Legal Reasons', headers, responseBody, message) || this;
  }
  return UnavailableForLegalReasonsError;
}(HttpStatusError);

/**
 * Base class for server errors (5xx)
 */
var ServerError = /** @class */function (_super) {
  __extends(ServerError, _super);
  function ServerError(status, statusText, headers, responseBody, message) {
    return _super.call(this, status, statusText, headers, responseBody, message || "Server Error: ".concat(status, " ").concat(statusText)) || this;
  }
  return ServerError;
}(HttpStatusError);
/**
 * 500 Internal Server Error
 */
var InternalServerError = /** @class */function (_super) {
  __extends(InternalServerError, _super);
  function InternalServerError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Internal Server Error';
    }
    return _super.call(this, 500, 'Internal Server Error', headers, responseBody, message) || this;
  }
  return InternalServerError;
}(ServerError);
/**
 * 501 Not Implemented
 */
var NotImplementedError = /** @class */function (_super) {
  __extends(NotImplementedError, _super);
  function NotImplementedError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Not Implemented';
    }
    return _super.call(this, 501, 'Not Implemented', headers, responseBody, message) || this;
  }
  return NotImplementedError;
}(ServerError);
/**
 * 502 Bad Gateway
 */
var BadGatewayError = /** @class */function (_super) {
  __extends(BadGatewayError, _super);
  function BadGatewayError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Bad Gateway';
    }
    return _super.call(this, 502, 'Bad Gateway', headers, responseBody, message) || this;
  }
  return BadGatewayError;
}(ServerError);
/**
 * 503 Service Unavailable
 */
var ServiceUnavailableError = /** @class */function (_super) {
  __extends(ServiceUnavailableError, _super);
  function ServiceUnavailableError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Service Unavailable';
    }
    return _super.call(this, 503, 'Service Unavailable', headers, responseBody, message) || this;
  }
  return ServiceUnavailableError;
}(ServerError);
/**
 * 504 Gateway Timeout
 */
var GatewayTimeoutError = /** @class */function (_super) {
  __extends(GatewayTimeoutError, _super);
  function GatewayTimeoutError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Gateway Timeout';
    }
    return _super.call(this, 504, 'Gateway Timeout', headers, responseBody, message) || this;
  }
  return GatewayTimeoutError;
}(ServerError);
/**
 * 505 HTTP Version Not Supported
 */
var HTTPVersionNotSupportedError = /** @class */function (_super) {
  __extends(HTTPVersionNotSupportedError, _super);
  function HTTPVersionNotSupportedError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'HTTP Version Not Supported';
    }
    return _super.call(this, 505, 'HTTP Version Not Supported', headers, responseBody, message) || this;
  }
  return HTTPVersionNotSupportedError;
}(ServerError);
/**
 * 506 Variant Also Negotiates
 */
var VariantAlsoNegotiatesError = /** @class */function (_super) {
  __extends(VariantAlsoNegotiatesError, _super);
  function VariantAlsoNegotiatesError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Variant Also Negotiates';
    }
    return _super.call(this, 506, 'Variant Also Negotiates', headers, responseBody, message) || this;
  }
  return VariantAlsoNegotiatesError;
}(ServerError);
/**
 * 507 Insufficient Storage
 */
var InsufficientStorageError = /** @class */function (_super) {
  __extends(InsufficientStorageError, _super);
  function InsufficientStorageError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Insufficient Storage';
    }
    return _super.call(this, 507, 'Insufficient Storage', headers, responseBody, message) || this;
  }
  return InsufficientStorageError;
}(ServerError);
/**
 * 508 Loop Detected
 */
var LoopDetectedError = /** @class */function (_super) {
  __extends(LoopDetectedError, _super);
  function LoopDetectedError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Loop Detected';
    }
    return _super.call(this, 508, 'Loop Detected', headers, responseBody, message) || this;
  }
  return LoopDetectedError;
}(ServerError);
/**
 * 510 Not Extended
 */
var NotExtendedError = /** @class */function (_super) {
  __extends(NotExtendedError, _super);
  function NotExtendedError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Not Extended';
    }
    return _super.call(this, 510, 'Not Extended', headers, responseBody, message) || this;
  }
  return NotExtendedError;
}(ServerError);
/**
 * 511 Network Authentication Required
 */
var NetworkAuthenticationRequiredError = /** @class */function (_super) {
  __extends(NetworkAuthenticationRequiredError, _super);
  function NetworkAuthenticationRequiredError(headers, responseBody, message) {
    if (message === undefined) {
      message = 'Network Authentication Required';
    }
    return _super.call(this, 511, 'Network Authentication Required', headers, responseBody, message) || this;
  }
  return NetworkAuthenticationRequiredError;
}(ServerError);

var ErrorContextInterceptor = /** @class */function () {
  function ErrorContextInterceptor() {}
  ErrorContextInterceptor.prototype.invoke = function (method, params, next) {
    return __awaiter(this, undefined, undefined, function () {
      var error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2,, 3]);
            return [4 /*yield*/, next(method, params)];
          case 1:
            return [2 /*return*/, _a.sent()];
          case 2:
            error_1 = _a.sent();
            if (error_1 instanceof HttpError) {
              // Enhance error context with request details
              Object.defineProperty(error_1, 'context', {
                value: {
                  methodName: method.name.toString(),
                  timestamp: new Date().toISOString(),
                  headers: params.headers.toJSON(),
                  pathVariables: params.pathVariables,
                  queryParams: params.queryParams
                }
              });
            }
            throw error_1;
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  return ErrorContextInterceptor;
}();

var DEFAULT_CONFIG$2 = {
  maxAttempts: 3,
  backoffFactor: 2,
  initialDelay: 1000,
  maxDelay: 10000,
  retryableStatuses: [408, 500, 502, 503, 504],
  retryable: function (error) {
    return __awaiter(this, undefined, undefined, function () {
      return __generator(this, function (_a) {
        if (error instanceof HttpStatusError) {
          return [2 /*return*/, this.retryableStatuses.includes(error.status)];
        }
        return [2 /*return*/, true];
      });
    });
  }
};
var RetryInterceptor = /** @class */function () {
  function RetryInterceptor(config) {
    if (config === undefined) {
      config = {};
    }
    this.config = __assign(__assign({}, DEFAULT_CONFIG$2), config);
  }
  RetryInterceptor.prototype.delay = function (ms) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, ms);
    });
  };
  RetryInterceptor.prototype.invoke = function (method, params, next) {
    return __awaiter(this, undefined, undefined, function () {
      function throwMaxRetryAttempsReachedError(error) {
        throw new MaxRetryAttemptsReachedError(attempt, error);
      }
      var attempt, delay, error_1, retryable;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            attempt = 0;
            delay = this.config.initialDelay;
            _a.label = 1;
          case 1:
            if (!(attempt < this.config.maxAttempts)) return [3 /*break*/, 8];
            _a.label = 2;
          case 2:
            _a.trys.push([2, 4,, 7]);
            return [4 /*yield*/, next(method, params)];
          case 3:
            return [2 /*return*/, _a.sent()];
          case 4:
            error_1 = _a.sent();
            return [4 /*yield*/, this.config.retryable(error_1)];
          case 5:
            retryable = _a.sent();
            if (!retryable) {
              throw error_1;
            }
            attempt++;
            if (attempt === this.config.maxAttempts) {
              throwMaxRetryAttempsReachedError(error_1);
            }
            return [4 /*yield*/, this.delay(delay)];
          case 6:
            _a.sent();
            delay = Math.min(delay * this.config.backoffFactor, this.config.maxDelay);
            return [3 /*break*/, 7];
          case 7:
            return [3 /*break*/, 1];
          case 8:
            // This should never be reached due to the throw above
            throw new Error('Unexpected retry loop exit');
        }
      });
    });
  };
  return RetryInterceptor;
}();
var MaxRetryAttemptsReachedError = /** @class */function (_super) {
  __extends(MaxRetryAttemptsReachedError, _super);
  function MaxRetryAttemptsReachedError(attempts, originalError) {
    var _this = _super.call(this, 'Max retry attempts reached') || this;
    _this.attempts = attempts;
    _this.originalError = originalError;
    return _this;
  }
  return MaxRetryAttemptsReachedError;
}(HttpError);

function mergeAbortSignal() {
  var signals = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    signals[_i] = arguments[_i];
  }
  var filtedSignals = signals.filter(function (it) {
    return !!it;
  });
  if (filtedSignals.length === 1) {
    return filtedSignals[0];
  }
  var controller = new AbortController();
  var mergedSignal = controller.signal;
  filtedSignals.forEach(function (signal) {
    signal.addEventListener('abort', function () {
      controller.abort();
    });
  });
  return mergedSignal;
}

var DEFAULT_CONFIG$1 = {
  timeout: 30000 // 30 seconds
};
var TimeoutInterceptor = /** @class */function () {
  function TimeoutInterceptor(config) {
    if (config === undefined) {
      config = {};
    }
    this.config = __assign(__assign({}, DEFAULT_CONFIG$1), config);
  }
  TimeoutInterceptor.prototype.invoke = function (method, params, next) {
    return __awaiter(this, undefined, undefined, function () {
      var controller, timeoutId, signal;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            controller = new AbortController();
            timeoutId = setTimeout(function () {
              return controller.abort();
            }, this.config.timeout);
            _a.label = 1;
          case 1:
            _a.trys.push([1,, 3, 4]);
            signal = mergeAbortSignal(params.signal, controller.signal);
            return [4 /*yield*/, Promise.race([next(method, __assign(__assign({}, params), {
              signal: signal
            })), new Promise(function (_, reject) {
              return setTimeout(function () {
                return reject(new TimeoutError("Request timeout after ".concat(_this.config.timeout, "ms"), {
                  timeout: _this.config.timeout,
                  method: method.name.toString()
                }));
              }, _this.config.timeout);
            })])];
          case 2:
            return [2 /*return*/, _a.sent()];
          case 3:
            clearTimeout(timeoutId);
            return [7 /*endfinally*/];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  return TimeoutInterceptor;
}();

/**
 * Symbol constants used for endpoint instance storage and retrieval
 */
/** Stores HTTP methods (GET, POST, etc.) associated with an endpoint */
var METHODS = Symbol('endpoint-request-methods');
/** Stores interceptors that process requests/responses for an endpoint */
var GET_INTERCEPTORS = Symbol('endpoint-get-interceptors');
/** Stores the HTTP adapter configuration for an endpoint */
var ADAPTER = Symbol('endpoint-adapter');
/** Stores the interceptor construction logic for an endpoint */
var CONSTRUCT_INTERCEPTORS = Symbol('endpoint-construct-interceptors');
/** Stores the SWR instances for an endpoint */
var SWR_INSTANCES = Symbol('swr-instances');
var ABORT_CONTROLLER = Symbol('abort-controller');
var APPLICATION_CONTEXT = Symbol('application-context');

/**
 * Represents an error that occurred during resource processing
 */
var ResourceError = /** @class */function () {
  /**
   * Create a new ResourceError
   */
  function ResourceError(error) {
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
  ResourceError.wrap = function (error) {
    if (error instanceof ResourceError) {
      return error;
    }
    return new ResourceError(error);
  };
  Object.defineProperty(ResourceError.prototype, "isClientError", {
    /**
     * Check if this is a client error (4xx)
     */
    get: function () {
      return !!this.httpStatus && this.httpStatus >= 400 && this.httpStatus < 500;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ResourceError.prototype, "isServerError", {
    /**
     * Check if this is a server error (5xx)
     */
    get: function () {
      return !!this.httpStatus && this.httpStatus >= 500;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ResourceError.prototype, "isNetworkError", {
    /**
     * Check if this is a network error
     */
    get: function () {
      return this.name === 'NetworkError';
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ResourceError.prototype, "isTimeoutError", {
    /**
     * Check if this is a timeout error
     */
    get: function () {
      return this.name === 'TimeoutError';
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ResourceError.prototype, "isAbortError", {
    /**
     * Check if this is an abort error
     */
    get: function () {
      return this.name === 'AbortError';
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ResourceError.prototype, "isParseError", {
    /**
     * Check if this is a parse error
     */
    get: function () {
      return this.name === 'ParseError';
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Convert to string
   */
  ResourceError.prototype.toString = function () {
    return "".concat(this.name, ": ").concat(this.message);
  };
  return ResourceError;
}();

var ErrorWrappingInterceptor = /** @class */function () {
  function ErrorWrappingInterceptor() {}
  ErrorWrappingInterceptor.prototype.invoke = function (method, params, next) {
    return __awaiter(this, undefined, undefined, function () {
      var response, error_1, abortError, networkError, timeoutError, parseError;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            _a.trys.push([0, 2,, 3]);
            return [4 /*yield*/, next(method, params)];
          case 1:
            response = _a.sent();
            return [2 /*return*/, response];
          case 2:
            error_1 = _a.sent();
            // Handle different error types
            if (error_1 instanceof DOMException && error_1.name === 'AbortError') {
              abortError = new AbortError('Request was aborted', error_1);
              throw new ResourceError(abortError);
            } else if (error_1 instanceof TypeError && error_1.message.includes('NetworkError')) {
              networkError = new NetworkError('Network error occurred', error_1);
              throw new ResourceError(networkError);
            } else if (error_1 instanceof TypeError && error_1.message.includes('timeout')) {
              timeoutError = new TimeoutError('Request timed out', {}, error_1);
              throw new ResourceError(timeoutError);
            } else if (error_1 instanceof SyntaxError && error_1.message.includes('JSON')) {
              parseError = new ParseError('Failed to parse JSON response', error_1);
              throw new ResourceError(parseError);
            } else {
              throw new ResourceError(error_1);
            }
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  return ErrorWrappingInterceptor;
}();

var RequestMethod = /** @class */function () {
  function RequestMethod(name, endpointMetadata, metadata) {
    this.name = name;
    this.endpointMetadata = endpointMetadata;
    this.metadata = metadata;
    this.baseInterceptors = [];
    var pathOrURL = metadata.getPath();
    if (isURL(pathOrURL)) {
      this.url = pathOrURL;
    } else {
      this.url = joinPath(this.endpointMetadata.getBaseURL(), pathOrURL);
    }
    this.baseInterceptors.push(new ErrorWrappingInterceptor());
    this.baseInterceptors.push(new ErrorContextInterceptor());
    var retryConfig = this.metadata.getRetryConfig();
    if (retryConfig) {
      this.baseInterceptors.push(new RetryInterceptor(retryConfig));
    }
  }
  RequestMethod.prototype.getAlInterceptors = function (instance) {
    var timeout = this.metadata.getTimeout() || this.endpointMetadata.getTimeout();
    var extInterceptors = [];
    if (timeout > 0) {
      extInterceptors.push(new TimeoutInterceptor({
        timeout: timeout
      }));
    } else if (timeout !== 0) {
      extInterceptors.push(new TimeoutInterceptor());
    }
    var excludeInterceptors = this.metadata.getExcludeInterceptors();
    var endpointInterceptors = instance[GET_INTERCEPTORS](excludeInterceptors);
    var methodInterceptors = instance[CONSTRUCT_INTERCEPTORS](this.metadata.getInterceptors());
    var allInterceptors = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], this.baseInterceptors, true), extInterceptors, true), endpointInterceptors, true), methodInterceptors, true);
    return allInterceptors;
  };
  RequestMethod.prototype.invoke = function (instance, params) {
    return __awaiter(this, undefined, undefined, function () {
      var adapter, source;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            adapter = this.createAdapter(instance, params);
            return [4 /*yield*/, adapter.execute()];
          case 1:
            source = _a.sent();
            return [2 /*return*/, new HttpResponse(source, {
              method: this
            })];
        }
      });
    });
  };
  RequestMethod.prototype.resolveURL = function (params) {
    var _a;
    return resolveURL(this.url, (_a = params.pathVariables) !== null && _a !== undefined ? _a : {}, params.queryParams);
  };
  RequestMethod.prototype.createAdapter = function (instance, params) {
    var _a, _b, _c;
    var url = this.resolveURL(params);
    var method = this.metadata.getHttpMethod();
    var headers = this.metadata.getHeaders();
    var signal = mergeAbortSignal(instance[ABORT_CONTROLLER].signal, params.signal);
    var options = {
      url: url,
      method: method,
      headers: headers.concat(params.headers),
      payload: params.payload,
      signal: signal,
      invokeMethod: this
    };
    var adapter = new ((_c = (_b = (_a = params.adapter) !== null && _a !== undefined ? _a : this.metadata.getAdapter()) !== null && _b !== undefined ? _b : instance[ADAPTER]) !== null && _c !== undefined ? _c : XMLHttpRequestAdapter)(options);
    return adapter;
  };
  return RequestMethod;
}();

var DEFAULT_CONFIG = {
  threshold: 5,
  resetTimeout: 60000 // 1 minute
};
var CircuitBreakerInterceptor = /** @class */function () {
  function CircuitBreakerInterceptor(config) {
    if (config === undefined) {
      config = {};
    }
    this.failures = 0;
    this.lastFailureTime = 0;
    this.state = 'CLOSED';
    this.config = __assign(__assign({}, DEFAULT_CONFIG), config);
  }
  CircuitBreakerInterceptor.of = function (config) {
    if (config === undefined) {
      config = DEFAULT_CONFIG;
    }
    var SubCircuitBreakerInterceptor = /** @class */function (_super) {
      __extends(SubCircuitBreakerInterceptor, _super);
      function SubCircuitBreakerInterceptor() {
        return _super.call(this, config) || this;
      }
      return SubCircuitBreakerInterceptor;
    }(CircuitBreakerInterceptor);
    return SubCircuitBreakerInterceptor;
  };
  CircuitBreakerInterceptor.prototype.shouldReset = function () {
    return this.state === 'OPEN' && Date.now() - this.lastFailureTime >= this.config.resetTimeout;
  };
  CircuitBreakerInterceptor.prototype.invoke = function (method, params, next) {
    return __awaiter(this, undefined, undefined, function () {
      var response, error_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.state === 'OPEN') {
              if (this.shouldReset()) {
                this.state = 'HALF_OPEN';
              } else {
                throw new CircuitBreakerError();
              }
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3,, 4]);
            return [4 /*yield*/, next(method, params)];
          case 2:
            response = _a.sent();
            if (this.state === 'HALF_OPEN') {
              this.state = 'CLOSED';
              this.failures = 0;
            }
            return [2 /*return*/, response];
          case 3:
            error_1 = _a.sent();
            this.failures++;
            this.lastFailureTime = Date.now();
            if (this.failures >= this.config.threshold) {
              this.state = 'OPEN';
            }
            throw error_1;
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  return CircuitBreakerInterceptor;
}();
var CircuitBreakerError = /** @class */function (_super) {
  __extends(CircuitBreakerError, _super);
  function CircuitBreakerError(message) {
    if (message === undefined) {
      message = 'Circuit breaker is open';
    }
    return _super.call(this, message) || this;
  }
  return CircuitBreakerError;
}(HttpError);

var FetchRequestAdapter = /** @class */function () {
  function FetchRequestAdapter(options) {
    var _this = this;
    this.events = new Events();
    this.headersDefer = new Defer();
    this.bodyDefer = new Defer();
    this.statusDefer = new Defer();
    this.abortController = new AbortController();
    this.executeRequestIfNeed = function () {
      _this.executeRequestIfNeed = function () {
        return undefined;
      };
      options.signal.addEventListener('abort', function () {
        _this.abortController.abort();
      });
      if (options.signal.aborted) {
        _this.abortController.abort();
      }
      fetch(options.url, {
        method: options.method,
        headers: options.headers.toNative(),
        body: options.payload,
        signal: _this.abortController.signal
      }).then(function (response) {
        _this.statusDefer.resolve(response.status);
        _this.headersDefer.resolve(new HttpHeaders(response.headers));
        if (!response.body) {
          _this.bodyDefer.resolve(new BlobByteStream(new Blob([])));
        } else {
          var rawContentLength = response.headers.get('Content-Length');
          var contentLength = rawContentLength ? parseInt(rawContentLength) || 0 : 0;
          _this.events.emit('download', new Progress(contentLength, 0));
          var stream = new NativeReadableStream(contentLength, response.body.pipeThrough(new TransformStream({
            transform: function (chunk, controller) {
              controller.enqueue(chunk.buffer);
            }
          })));
          stream.onProgress(function (progress) {
            _this.events.emit('download', progress);
          });
          _this.bodyDefer.resolve(stream);
        }
      });
    };
  }
  FetchRequestAdapter.prototype.abort = function () {
    this.abortController.abort();
  };
  FetchRequestAdapter.prototype.execute = function () {
    return __awaiter(this, undefined, undefined, function () {
      var _a, headersDefer, bodyDefer, statusDefer, events;
      return __generator(this, function (_b) {
        this.executeRequestIfNeed();
        _a = this, headersDefer = _a.headersDefer, bodyDefer = _a.bodyDefer, statusDefer = _a.statusDefer, events = _a.events;
        return [2 /*return*/, {
          status: function () {
            return statusDefer.promise;
          },
          headers: function () {
            return headersDefer.promise;
          },
          body: function () {
            return bodyDefer.promise;
          },
          onDownload: function (listener) {
            return events.on('download', listener);
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          onUpload: function (_listener) {
            return function () {
              return undefined;
            };
          }
        }];
      });
    });
  };
  return FetchRequestAdapter;
}();

function buildEndpointClass(endpointClass, metadata) {
  Reflect.set(endpointClass.prototype, GET_INTERCEPTORS, function (exclude) {
    var _this = this;
    return metadata.getInterceptors().filter(function (it) {
      return !(exclude === null || exclude === undefined ? undefined : exclude.includes(it));
    }).map(function (identifier) {
      if (isInterceptor(identifier)) {
        return identifier;
      }
      return _this[APPLICATION_CONTEXT].getInstance(identifier);
    }).flat();
  });
  Reflect.set(endpointClass.prototype, ADAPTER, metadata.getAdaptor());
  ioc.Generate(function (appCtx) {
    return function (interceptors) {
      return interceptors.map(function (identifier) {
        return appCtx.getInstance(identifier);
      }).flat();
    };
  })(endpointClass.prototype, CONSTRUCT_INTERCEPTORS);
  lazy.lazyMember(function () {
    return new Map();
  })(endpointClass.prototype, SWR_INSTANCES);
  lazy.lazyMember(function () {
    return new AbortController();
  })(endpointClass.prototype, ABORT_CONTROLLER);
  lazy.lazyMember(function () {
    var methods = new Map();
    metadata.getMethods().forEach(function (methodMetadata, methodName) {
      methods.set(methodName, new RequestMethod(methodName, metadata, methodMetadata));
    });
    return methods;
  })(endpointClass.prototype, METHODS);
  ioc.Inject(ioc.ApplicationContext)(endpointClass.prototype, APPLICATION_CONTEXT);
}

var RequestMethodMetadata = /** @class */function () {
  function RequestMethodMetadata(name) {
    this.name = name;
    this.executionHandlers = [];
    this.extra = new Map();
    this.options = {
      path: '/',
      method: 'GET'
    };
  }
  RequestMethodMetadata.prototype.setOptions = function (options) {
    Object.assign(this.options, options);
  };
  RequestMethodMetadata.prototype.getExtra = function (key) {
    return this.extra.get(key);
  };
  RequestMethodMetadata.prototype.setExtra = function (key, value) {
    this.extra.set(key, value);
  };
  RequestMethodMetadata.prototype.getRetryConfig = function () {
    return this.options.retry;
  };
  RequestMethodMetadata.prototype.appendExecutionHandler = function (handler) {
    this.executionHandlers.push(handler);
  };
  RequestMethodMetadata.prototype.getExecutionHandlers = function () {
    return this.executionHandlers.slice(0);
  };
  RequestMethodMetadata.prototype.getPath = function () {
    return this.options.path;
  };
  RequestMethodMetadata.prototype.getHttpMethod = function () {
    return this.options.method;
  };
  RequestMethodMetadata.prototype.getHeaders = function () {
    var _a;
    var headers = new HttpHeaders();
    headers.setAll((_a = this.options.headers) !== null && _a !== undefined ? _a : {});
    return headers;
  };
  RequestMethodMetadata.prototype.getTimeout = function () {
    var _a;
    return (_a = this.options.timeout) !== null && _a !== undefined ? _a : 0;
  };
  RequestMethodMetadata.prototype.getInterceptors = function () {
    var _a;
    return (_a = this.options.interceptors) !== null && _a !== undefined ? _a : [];
  };
  RequestMethodMetadata.prototype.getExcludeInterceptors = function () {
    var _a;
    return (_a = this.options.excludeInterceptors) !== null && _a !== undefined ? _a : [];
  };
  RequestMethodMetadata.prototype.getAdapter = function () {
    return this.options.adapter;
  };
  RequestMethodMetadata.prototype.isReactive = function () {
    var _a;
    return (_a = this.options.reactive) !== null && _a !== undefined ? _a : true;
  };
  return RequestMethodMetadata;
}();

var ENDPOINT_METADATA_KEY = '@http:endpoint';
var EndpointMetadata = /** @class */function () {
  function EndpointMetadata() {
    this.timeout = 0;
    this.headers = new HttpHeaders();
    this.methods = new Map();
  }
  EndpointMetadata.from = function (target) {
    if (Reflect.hasMetadata(ENDPOINT_METADATA_KEY, target)) {
      return Reflect.getMetadata(ENDPOINT_METADATA_KEY, target);
    }
    var metadata = new EndpointMetadata();
    Reflect.defineMetadata(ENDPOINT_METADATA_KEY, metadata, target);
    buildEndpointClass(target, metadata);
    return metadata;
  };
  EndpointMetadata.prototype.setOptions = function (endpointOptions) {
    var _a, _b;
    if ('extends' in endpointOptions) {
      var parent_1 = EndpointMetadata.from(endpointOptions.extends);
      this.baseURL = (_a = endpointOptions.baseURL) !== null && _a !== undefined ? _a : parent_1.baseURL;
      this.timeout = parent_1.timeout;
      this.headers = this.headers.concat(parent_1.headers);
      this.interceptors = parent_1.interceptors;
      this.adapter = parent_1.adapter;
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
      var headers = endpointOptions.headers;
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
  };
  EndpointMetadata.prototype.getMethodMetadata = function (methodName) {
    var metadata = this.methods.get(methodName);
    if (!metadata) {
      this.methods.set(methodName, metadata = new RequestMethodMetadata(methodName));
    }
    return metadata;
  };
  EndpointMetadata.prototype.setMethodMetadata = function (methodName, methodMetadata) {
    this.methods.set(methodName, methodMetadata);
  };
  EndpointMetadata.prototype.getMethods = function () {
    return this.methods;
  };
  EndpointMetadata.prototype.getInterceptors = function () {
    var _a;
    return (_a = this.interceptors) !== null && _a !== undefined ? _a : [];
  };
  EndpointMetadata.prototype.getAdaptor = function () {
    return this.adapter;
  };
  EndpointMetadata.prototype.getBaseURL = function () {
    return this.baseURL;
  };
  EndpointMetadata.prototype.getHeaders = function () {
    return this.headers;
  };
  EndpointMetadata.prototype.getTimeout = function () {
    return this.timeout;
  };
  return EndpointMetadata;
}();

function Endpoint(options) {
  return function (target) {
    EndpointMetadata.from(target).setOptions(options);
  };
}

var executionContext;
function getExecutionContext() {
  return executionContext;
}
function setExecutionContext(context) {
  executionContext = context;
}

function Request(options) {
  return function decorateMethod(target, context, descriptor) {
    if (typeof target === 'function' && typeof context === 'object') {
      var propertyKey_1 = context.name;
      context.addInitializer(function () {
        var clazz = this.constructor;
        var method = EndpointMetadata.from(clazz).getMethodMetadata(propertyKey_1);
        method.setOptions(options);
        Reflect.set(this, propertyKey_1, delegator(Reflect.get(this, propertyKey_1), method));
      });
    } else if (typeof target === 'object' && typeof context !== 'object' && typeof descriptor === 'object') {
      var propertyKey = context;
      var clazz = target.constructor;
      var methodMetadata = EndpointMetadata.from(clazz).getMethodMetadata(propertyKey);
      methodMetadata.setOptions(options);
      return __assign(__assign({}, descriptor), {
        value: delegator(Reflect.get(target, propertyKey), methodMetadata)
      });
    }
    function delegator(originFunction, methodMetadata) {
      return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        var params = {
          headers: methodMetadata.getHeaders().clone(),
          pathVariables: {},
          queryParams: new URLSearchParams(),
          adapter: methodMetadata.getAdapter()
        };
        var instance = this;
        var method = instance[METHODS].get(methodMetadata.name);
        if (!method) {
          var error = new Error("Not found method ".concat(methodMetadata.name.toString()));
          throw error;
        }
        setExecutionContext({
          instance: instance,
          method: method,
          params: params
        });
        var executionHandlers = methodMetadata.getExecutionHandlers();
        executionHandlers.forEach(function (handler) {
          handler(instance, method, params, args);
        });
        return originFunction.apply(this, args);
      };
    }
  };
}
function createRequestDecorator(options, method) {
  if (typeof options === 'string') {
    return Request({
      path: options,
      method: method
    });
  } else {
    return Request(__assign(__assign({}, options), {
      method: method
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
  var metadata = EndpointMetadata.from(target).getMethodMetadata(methodName);
  metadata === null || metadata === undefined ? undefined : metadata.appendExecutionHandler(handler);
}

function Header(name, defaultValue) {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target.constructor, methodName, function (instance, metadata, params, args) {
      var _a;
      var _b;
      var value = (_b = args[parameterIndex]) !== null && _b !== undefined ? _b : defaultValue;
      if (value) {
        (_a = params.headers).append.apply(_a, __spreadArray([name], Array.isArray(value) ? value : [value], false));
      }
    });
  };
}

function PathVariable(name, defaultValue) {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target.constructor, methodName, function (instance, metadata, params, args) {
      var value = args[parameterIndex];
      params.pathVariables[name] = (value !== null && value !== undefined ? value : defaultValue) + '';
    });
  };
}

function Query(name, defaultValue) {
  return function (target, methodName, parameterIndex) {
    appendExecHandler(target.constructor, methodName, function (instance, metadata, params, args) {
      var _a;
      var value = (_a = args[parameterIndex]) !== null && _a !== undefined ? _a : defaultValue;
      if (Array.isArray(value)) {
        value.forEach(function (value) {
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
    appendExecHandler(target.constructor, methodName, function (instance, metadata, params, args) {
      var value = args[parameterIndex];
      if (isBodyInit(value)) {
        params.payload = value;
      } else {
        params.headers.set('Content-Type', 'application/json');
        params.payload = JSON.stringify(value);
      }
    });
  };
}

var defaultConfig = {
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
    calculateDelay: function (attempt) {
      var baseInterval = 1000;
      var maxInterval = 30000;
      var jitter = Math.random() * 100;
      return Math.min(baseInterval * Math.pow(2, attempt - 1), maxInterval) + jitter;
    },
    shouldRetryOnError: function (ctx) {
      return ctx.attempt <= 3;
    }
  },
  refresh: {
    interval: 0,
    whenHidden: false,
    whenOffline: false
  }
};
var STATE_CHANGE_EVENT = 'stateChange';
var ERROR_EVENT = 'error';
var SUCCESS_EVENT = 'success';
var SWRInstance = /** @class */function () {
  function SWRInstance(key, fetcher, options) {
    if (options === undefined) {
      options = {};
    }
    this.key = key;
    this.fetcher = fetcher;
    this.options = options;
    this.lastFetchTime = 0;
    this.currentRetryAttempt = 0;
    this.cleanupFns = [];
    this.abortController = new AbortController();
    this.events = new Events();
    this.config = __assign(__assign({}, defaultConfig), options);
    this.state = {
      data: options.initialData,
      isLoading: true,
      isValidating: false
    };
    this.initRevalidationStrategy();
    this.setupRefreshInterval();
  }
  Object.defineProperty(SWRInstance.prototype, "signal", {
    get: function () {
      return this.abortController.signal;
    },
    enumerable: false,
    configurable: true
  });
  SWRInstance.prototype.onStateChange = function (listener) {
    return this.events.on(STATE_CHANGE_EVENT, listener);
  };
  SWRInstance.prototype.setState = function (newState) {
    this.state = __assign(__assign({}, this.state), newState);
    this.events.emit(STATE_CHANGE_EVENT, this.state);
  };
  SWRInstance.prototype.revalidate = function (reason) {
    return __awaiter(this, undefined, undefined, function () {
      var now, dedupingInterval, newData, err_1, error, retryContext, delay;
      var _this = this;
      var _a, _b, _c, _d, _e, _f;
      return __generator(this, function (_g) {
        switch (_g.label) {
          case 0:
            now = Date.now();
            dedupingInterval = (_a = this.config.dedupingInterval) !== null && _a !== undefined ? _a : 2000;
            if (now - this.lastFetchTime < dedupingInterval) {
              return [2 /*return*/];
            }
            this.setState({
              isValidating: true,
              validatingReason: reason
            });
            this.lastFetchTime = now;
            _g.label = 1;
          case 1:
            _g.trys.push([1, 3,, 4]);
            return [4 /*yield*/, this.fetcher(this.key)];
          case 2:
            newData = _g.sent();
            this.setState({
              data: newData,
              error: undefined,
              isLoading: false,
              isValidating: false
            });
            this.currentRetryAttempt = 0;
            this.events.emit(SUCCESS_EVENT, newData);
            return [3 /*break*/, 4];
          case 3:
            err_1 = _g.sent();
            error = err_1;
            this.setState({
              error: error,
              isLoading: false,
              isValidating: false
            });
            this.events.emit(ERROR_EVENT, error);
            // Retry logic
            if (this.config.retry && this.currentRetryAttempt < this.config.retry.maxAttempts) {
              retryContext = {
                error: error,
                attempt: this.currentRetryAttempt + 1,
                timestamp: Date.now()
              };
              if (((_c = (_b = this.config.retry).shouldRetryOnError) === null || _c === undefined ? undefined : _c.call(_b, retryContext)) !== false) {
                this.currentRetryAttempt++;
                delay = (_f = (_e = (_d = this.config.retry).calculateDelay) === null || _e === undefined ? undefined : _e.call(_d, this.currentRetryAttempt, error)) !== null && _f !== undefined ? _f : this.config.retry.interval * Math.pow(2, this.currentRetryAttempt - 1);
                setTimeout(function () {
                  return _this.revalidate();
                }, delay);
              }
            }
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  SWRInstance.prototype.initRevalidationStrategy = function () {
    var _this = this;
    var _a;
    var _b = (_a = this.config.revalidate) !== null && _a !== undefined ? _a : {},
      focus = _b.focus,
      reconnect = _b.reconnect,
      events = _b.events;
    if (typeof window === 'undefined') {
      return;
    }
    if (focus !== false) {
      window.addEventListener('focus', function () {
        _this.revalidate('focus');
      }, {
        signal: this.signal
      });
    }
    if (reconnect) {
      window.addEventListener('online', function () {
        _this.revalidate('reconnect');
      }, {
        signal: this.signal
      });
    }
    if (events) {
      events.forEach(function (event) {
        window.addEventListener(event, function () {
          _this.revalidate(event);
        }, {
          signal: _this.signal
        });
      });
    }
  };
  SWRInstance.prototype.setupRefreshInterval = function () {
    var _this = this;
    var _a;
    if (((_a = this.config.refresh) === null || _a === undefined ? undefined : _a.interval) && this.config.refresh.interval > 0) {
      this.refreshInterval = setInterval(function () {
        var _a, _b;
        if (document.hidden && !((_a = _this.config.refresh) === null || _a === undefined ? undefined : _a.whenHidden) || !navigator.onLine && !((_b = _this.config.refresh) === null || _b === undefined ? undefined : _b.whenOffline)) {
          return;
        }
        _this.revalidate();
      }, this.config.refresh.interval);
      this.cleanupFns.push(function () {
        if (_this.refreshInterval) {
          clearInterval(_this.refreshInterval);
        }
      });
    }
  };
  SWRInstance.prototype.mutate = function (data) {
    if (data !== undefined) {
      this.setState({
        data: data
      });
    }
    this.revalidate();
  };
  SWRInstance.prototype.getState = function () {
    var _this = this;
    return __assign(__assign({}, this.state), {
      mutate: function (data) {
        return _this.mutate(data);
      },
      revalidate: function () {
        return _this.revalidate();
      }
    });
  };
  SWRInstance.prototype.destroy = function () {
    this.cleanupFns.forEach(function (cleanup) {
      return cleanup();
    });
  };
  return SWRInstance;
}();
Object.assign(window, {
  SWRInstance: SWRInstance
});

var JSON_CONTENT_TYPES = ['application/json', 'application/json-patch+json', 'application/vnd.api+json', 'application/geo+json', 'application/schema+json'];
function isJSON(contentType) {
  return !!contentType && JSON_CONTENT_TYPES.some(function (type) {
    return contentType.includes(type);
  });
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
var HttpStatusErrorFactory = {
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
  createError: function (status, method, headers, responseBody) {
    // Look up the error class in the map
    var ErrorClass = this.errorMap.get(status);
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

exports.RequestStatus = void 0;
(function (RequestStatus) {
  RequestStatus[RequestStatus["IDLE"] = 0] = "IDLE";
  RequestStatus[RequestStatus["OPENED"] = 1] = "OPENED";
  RequestStatus[RequestStatus["LOADING"] = 2] = "LOADING";
  RequestStatus[RequestStatus["SUCCESS"] = 3] = "SUCCESS";
  RequestStatus[RequestStatus["ERROR"] = 4] = "ERROR";
  RequestStatus[RequestStatus["ABORTED"] = 5] = "ABORTED";
})(exports.RequestStatus || (exports.RequestStatus = {}));

var ResourceExecutionState = /** @class */function (_super) {
  __extends(ResourceExecutionState, _super);
  function ResourceExecutionState() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.messages = [];
    _this.status = exports.RequestStatus.IDLE;
    _this.headers = new HttpHeaders();
    _this.httpStatus = 0;
    _this.abortController = new AbortController();
    return _this;
  }
  ResourceExecutionState.prototype.init = function () {
    var _this = this;
    this.subscribe({
      next: function (value) {
        _this.data = value;
        _this.messages = _this.messages.concat(value);
      },
      error: function (err) {
        _this.reason = err;
        _this.status = err instanceof ResourceError && err.isAbortError ? exports.RequestStatus.ABORTED : exports.RequestStatus.ERROR;
      }
    });
  };
  ResourceExecutionState.prototype.headerReceived = function (headers, httpStatus) {
    this.headers = headers;
    this.httpStatus = httpStatus;
  };
  Object.defineProperty(ResourceExecutionState.prototype, "idle", {
    get: function () {
      return this.status === exports.RequestStatus.IDLE;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ResourceExecutionState.prototype, "opened", {
    get: function () {
      return this.status === exports.RequestStatus.OPENED;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ResourceExecutionState.prototype, "loading", {
    get: function () {
      return this.status === exports.RequestStatus.LOADING;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ResourceExecutionState.prototype, "success", {
    get: function () {
      return this.status === exports.RequestStatus.SUCCESS;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ResourceExecutionState.prototype, "aborted", {
    get: function () {
      return this.status === exports.RequestStatus.ABORTED;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(ResourceExecutionState.prototype, "failure", {
    get: function () {
      return this.status === exports.RequestStatus.ERROR;
    },
    enumerable: false,
    configurable: true
  });
  ResourceExecutionState.prototype.reset = function () {
    this.status = exports.RequestStatus.IDLE;
    this.headers.clear();
    this.httpStatus = 0;
    this.data = undefined;
    this.reason = null;
    this.messages = [];
  };
  __decorate([solidium.Signal()], ResourceExecutionState.prototype, "messages", undefined);
  __decorate([solidium.Signal()], ResourceExecutionState.prototype, "data", undefined);
  __decorate([solidium.Signal()], ResourceExecutionState.prototype, "reason", undefined);
  __decorate([solidium.Signal()], ResourceExecutionState.prototype, "status", undefined);
  __decorate([ioc.PostInject()], ResourceExecutionState.prototype, "init", null);
  ResourceExecutionState = __decorate([ioc.Scope(ioc.InstanceScope.TRANSIENT)], ResourceExecutionState);
  return ResourceExecutionState;
}(rxjs.Subject);

var EXECUTE = Symbol('execute');
var SET_DATA = Symbol('setData');
var SET_ERROR = Symbol('setError');
var Resource = /** @class */function () {
  function Resource() {
    this.$state = new rxjs.Subject();
    this.abortController = new AbortController();
  }
  Object.defineProperty(Resource.prototype, "data", {
    get: function () {
      var _a;
      return (_a = this.state) === null || _a === undefined ? undefined : _a.data;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Resource.prototype, "error", {
    get: function () {
      var _a;
      return (_a = this.state) === null || _a === undefined ? undefined : _a.reason;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Resource.prototype, "messages", {
    get: function () {
      var _a, _b;
      return (_b = (_a = this.state) === null || _a === undefined ? undefined : _a.messages) !== null && _b !== undefined ? _b : [];
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Resource.prototype, "idle", {
    get: function () {
      return this.state ? this.state.idle : true;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Resource.prototype, "opened", {
    get: function () {
      return this.state ? this.state.opened : false;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Resource.prototype, "loading", {
    get: function () {
      return this.state ? this.state.loading : false;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Resource.prototype, "success", {
    get: function () {
      return this.state ? this.state.success : false;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Resource.prototype, "aborted", {
    get: function () {
      return this.state ? this.state.aborted : false;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Resource.prototype, "failure", {
    get: function () {
      return this.state ? this.state.failure : false;
    },
    enumerable: false,
    configurable: true
  });
  Resource.prototype.init = function () {
    var _this = this;
    this.$state.subscribe({
      next: function (value) {
        _this.state = value;
      }
    });
  };
  Resource.prototype.abort = function () {
    this.abortController.abort();
  };
  Resource.prototype.wait = function () {
    return rxjs.lastValueFrom(this.$state.pipe(rxjs.mergeMap(function (state) {
      return state;
    })).pipe(rxjs.last()));
  };
  Resource.prototype.subscribe = function (observerOrNext) {
    return this.$state.subscribe(observerOrNext);
  };
  Resource.prototype[EXECUTE] = function (context, args, state) {
    var _this = this;
    var _a;
    if (state === undefined) {
      state = this.ioc.getInstance(ResourceExecutionState);
    }
    var lastExecutionAbortController = (_a = this.state) === null || _a === undefined ? undefined : _a.abortController;
    lastExecutionAbortController === null || lastExecutionAbortController === undefined ? undefined : lastExecutionAbortController.abort();
    this.$state.next(state);
    var instance = context.instance,
      method = context.method,
      params = context.params;
    state.status = exports.RequestStatus.LOADING;
    var signal = params.signal;
    if (signal) {
      signal = mergeAbortSignal(params.signal, this.abortController.signal);
    } else {
      signal = lastExecutionAbortController ? mergeAbortSignal(lastExecutionAbortController.signal, this.abortController.signal) : this.abortController.signal;
    }
    var allInterceptors = method.getAlInterceptors(instance);
    var sendRequest = allInterceptors.reduceRight(function (next, interceptor) {
      return function (method, params) {
        return interceptor.invoke(method, params, next);
      };
    }, function (method, params) {
      return __awaiter(_this, undefined, undefined, function () {
        var response;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              state.status = exports.RequestStatus.OPENED;
              return [4 /*yield*/, method.invoke(instance, __assign(__assign({}, params), {
                signal: signal
              }))];
            case 1:
              response = _a.sent();
              state.status = exports.RequestStatus.LOADING;
              return [4 /*yield*/, this.handleResponse(response, state)];
            case 2:
              _a.sent();
              return [2 /*return*/, response];
          }
        });
      });
    });
    sendRequest(method, params).catch(function (error) {
      state.error(ResourceError.wrap(error));
    });
  };
  Resource.prototype.resolveResponseBody = function (response) {
    return __asyncGenerator(this, arguments, function resolveResponseBody_1() {
      var headers, contentType, error_1, parseError, byteStream;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4 /*yield*/, __await(response.headers())];
          case 1:
            headers = _b.sent();
            contentType = (_a = headers.get('content-type')) === null || _a === undefined ? undefined : _a.join(', ');
            if (!isJSON(contentType)) return [3 /*break*/, 8];
            _b.label = 2;
          case 2:
            _b.trys.push([2, 6,, 7]);
            return [4 /*yield*/, __await(response.json())];
          case 3:
            return [4 /*yield*/, __await.apply(undefined, [_b.sent()])];
          case 4:
            return [4 /*yield*/, _b.sent()];
          case 5:
            _b.sent();
            return [3 /*break*/, 7];
          case 6:
            error_1 = _b.sent();
            // Handle JSON parsing error
            if (error_1 instanceof SyntaxError) {
              parseError = new ParseError('Failed to parse JSON response', error_1);
              throw parseError;
            }
            throw error_1;
          case 7:
            return [3 /*break*/, 18];
          case 8:
            if (!isText(contentType)) return [3 /*break*/, 11];
            return [4 /*yield*/, __await(response.text())];
          case 9:
            return [4 /*yield*/, _b.sent()];
          case 10:
            _b.sent();
            return [3 /*break*/, 18];
          case 11:
            if (!isTextEventStream(contentType)) return [3 /*break*/, 14];
            return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(response.textStream())))];
          case 12:
            return [4 /*yield*/, __await.apply(undefined, [_b.sent()])];
          case 13:
            _b.sent();
            return [3 /*break*/, 18];
          case 14:
            return [4 /*yield*/, __await(response.body())];
          case 15:
            byteStream = _b.sent();
            return [4 /*yield*/, __await(byteStream.readAsBlob())];
          case 16:
            return [4 /*yield*/, _b.sent()];
          case 17:
            _b.sent();
            _b.label = 18;
          case 18:
            return [2 /*return*/];
        }
      });
    });
  };
  Resource.prototype.handleResponse = function (response, state) {
    return __awaiter(this, undefined, undefined, function () {
      var httpStatus, _a, _b, _c, _d, _e, data, e_1_1;
      var _f, e_1, _g, _h;
      return __generator(this, function (_j) {
        switch (_j.label) {
          case 0:
            return [4 /*yield*/, response.status()];
          case 1:
            httpStatus = _j.sent();
            _b = (_a = state).headerReceived;
            return [4 /*yield*/, response.headers()];
          case 2:
            _b.apply(_a, [_j.sent(), httpStatus]);
            if (!(httpStatus < 200 || httpStatus >= 400)) return [3 /*break*/, 4];
            return [4 /*yield*/, this.handleHttpErrorResponse(response)];
          case 3:
            _j.sent();
            return [3 /*break*/, 16];
          case 4:
            _j.trys.push([4, 9, 10, 15]);
            _c = true, _d = __asyncValues(this.resolveResponseBody(response));
            _j.label = 5;
          case 5:
            return [4 /*yield*/, _d.next()];
          case 6:
            if (!(_e = _j.sent(), _f = _e.done, !_f)) return [3 /*break*/, 8];
            _h = _e.value;
            _c = false;
            data = _h;
            state.next(data);
            _j.label = 7;
          case 7:
            _c = true;
            return [3 /*break*/, 5];
          case 8:
            return [3 /*break*/, 15];
          case 9:
            e_1_1 = _j.sent();
            e_1 = {
              error: e_1_1
            };
            return [3 /*break*/, 15];
          case 10:
            _j.trys.push([10,, 13, 14]);
            if (!(!_c && !_f && (_g = _d.return))) return [3 /*break*/, 12];
            return [4 /*yield*/, _g.call(_d)];
          case 11:
            _j.sent();
            _j.label = 12;
          case 12:
            return [3 /*break*/, 14];
          case 13:
            if (e_1) throw e_1.error;
            return [7 /*endfinally*/];
          case 14:
            return [7 /*endfinally*/];
          case 15:
            state.status = exports.RequestStatus.SUCCESS;
            state.complete();
            _j.label = 16;
          case 16:
            return [2 /*return*/];
        }
      });
    });
  };
  Resource.prototype.handleHttpErrorResponse = function (response) {
    return __awaiter(this, undefined, undefined, function () {
      var httpStatus, headers, contentType, datas, _a, _b, _c, data, e_2_1, responseBody, httpError;
      var _d, e_2, _e, _f;
      var _g;
      return __generator(this, function (_h) {
        switch (_h.label) {
          case 0:
            return [4 /*yield*/, response.status()];
          case 1:
            httpStatus = _h.sent();
            return [4 /*yield*/, response.headers()];
          case 2:
            headers = _h.sent();
            contentType = (_g = headers.get('content-type')) === null || _g === undefined ? undefined : _g.join(', ');
            datas = [];
            _h.label = 3;
          case 3:
            _h.trys.push([3, 8, 9, 14]);
            _a = true, _b = __asyncValues(this.resolveResponseBody(response));
            _h.label = 4;
          case 4:
            return [4 /*yield*/, _b.next()];
          case 5:
            if (!(_c = _h.sent(), _d = _c.done, !_d)) return [3 /*break*/, 7];
            _f = _c.value;
            _a = false;
            data = _f;
            datas.push(data);
            _h.label = 6;
          case 6:
            _a = true;
            return [3 /*break*/, 4];
          case 7:
            return [3 /*break*/, 14];
          case 8:
            e_2_1 = _h.sent();
            e_2 = {
              error: e_2_1
            };
            return [3 /*break*/, 14];
          case 9:
            _h.trys.push([9,, 12, 13]);
            if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 11];
            return [4 /*yield*/, _e.call(_b)];
          case 10:
            _h.sent();
            _h.label = 11;
          case 11:
            return [3 /*break*/, 13];
          case 12:
            if (e_2) throw e_2.error;
            return [7 /*endfinally*/];
          case 13:
            return [7 /*endfinally*/];
          case 14:
            responseBody = isTextEventStream(contentType) ? datas : datas[0];
            httpError = HttpStatusErrorFactory.createError(httpStatus, response.init.method.toString(), headers, responseBody);
            throw httpError;
        }
      });
    });
  };
  __decorate([solidium.Signal()], Resource.prototype, "state", undefined);
  __decorate([ioc.Inject()], Resource.prototype, "ioc", undefined);
  __decorate([ioc.PostInject()], Resource.prototype, "init", null);
  return Resource;
}();

var ArgumentsTracker = /** @class */function () {
  function ArgumentsTracker() {}
  ArgumentsTracker.prototype.track = function (args, callback) {
    var hasAccessor = !!args.find(function (it) {
      return typeof it === 'function';
    });
    if (!hasAccessor) {
      callback(args);
      return function () {};
    }
    return solidium.runWithSolidiumOwner(this, function () {
      var owner = solidJs.getOwner();
      var _dispose = function () {};
      solidJs.createRoot(function (dispose) {
        _dispose = dispose;
        var trigger = scheduled.leading(scheduled.debounce, function (resolvedArgs) {
          for (var i = 0; i < args.length; i++) {
            if (typeof args[i] === 'function') {
              if (resolvedArgs[i] === null || resolvedArgs[i] === undefined) {
                return;
              }
            }
          }
          callback(resolvedArgs);
        });
        solidJs.createEffect(solidJs.on(args.map(function (it) {
          if (typeof it === 'function') {
            return it;
          }
          return function () {
            return it;
          };
        }), trigger));
      }, owner);
      return function () {
        _dispose();
      };
    });
  };
  return ArgumentsTracker;
}();

function execute(args, ResourceType) {
  var context = getExecutionContext();
  if (!context) {
    throw new Error('Unknown error!');
  }
  var appCtx = context.instance[APPLICATION_CONTEXT];
  var methodMetadata = context.method.metadata;
  var isReactive = methodMetadata.isReactive();
  var tracker = appCtx.getInstance(ArgumentsTracker);
  var resource = appCtx.getInstance(ResourceType);
  var dispose = tracker.track(args, function (args) {
    resource[EXECUTE](context, Array.from(args));
    if (!isReactive) {
      Promise.resolve().then(function () {
        dispose();
      });
    }
  });
  return resource;
}

var SWR_CONFIG_EXTRA_KEY = Symbol('swr-config');

var RestfulResource = /** @class */function (_super) {
  __extends(RestfulResource, _super);
  function RestfulResource() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  RestfulResource.prototype[EXECUTE] = function (context, args) {
    var _this = this;
    var methodMetadata = context.method.metadata;
    var swrConfig = methodMetadata.getExtra(SWR_CONFIG_EXTRA_KEY);
    if (!swrConfig) {
      return _super.prototype[EXECUTE].call(this, context, args);
    }
    var keygen = function () {
      return context.method.resolveURL(context.params);
    };
    this.swrService.useSWR(keygen, function () {
      var state = _this.ioc.getInstance(ResourceExecutionState);
      _super.prototype[EXECUTE].call(_this, context, args, state);
      return rxjs.lastValueFrom(state).then(function () {
        return state;
      });
    }, swrConfig);
    var instance = this.swrService.obtainInstance(keygen());
    instance === null || instance === undefined ? undefined : instance.onStateChange(function (state) {
      _this.state = state.data;
    });
  };
  __decorate([ioc.Inject()], RestfulResource.prototype, "swrService", undefined);
  RestfulResource = __decorate([ioc.Scope(ioc.InstanceScope.TRANSIENT)], RestfulResource);
  return RestfulResource;
}(Resource);

function restfull() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return execute(args, RestfulResource);
}

var JSONSSEResource = /** @class */function (_super) {
  __extends(JSONSSEResource, _super);
  function JSONSSEResource() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  JSONSSEResource.prototype.resolveResponseBody = function (response) {
    return __asyncGenerator(this, arguments, function resolveResponseBody_1() {
      var headers, contentType;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            return [4 /*yield*/, __await(response.headers())];
          case 1:
            headers = _b.sent();
            contentType = (_a = headers.get('content-type')) === null || _a === undefined ? undefined : _a.join(', ');
            if (!isTextEventStream(contentType)) return [3 /*break*/, 4];
            return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(response.jsonStream())))];
          case 2:
            return [4 /*yield*/, __await.apply(undefined, [_b.sent()])];
          case 3:
            _b.sent();
            return [3 /*break*/, 7];
          case 4:
            return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(_super.prototype.resolveResponseBody.call(this, response))))];
          case 5:
            return [4 /*yield*/, __await.apply(undefined, [_b.sent()])];
          case 6:
            _b.sent();
            _b.label = 7;
          case 7:
            return [2 /*return*/];
        }
      });
    });
  };
  JSONSSEResource = __decorate([ioc.Scope(ioc.InstanceScope.TRANSIENT)], JSONSSEResource);
  return JSONSSEResource;
}(Resource);

function jsonsse() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var context = getExecutionContext();
  if (!context) {
    throw new Error('No request context. Make sure to call `request` only within endpoint methods.');
  }
  context.params.adapter = FetchRequestAdapter;
  return execute(args, JSONSSEResource);
}

var ProgressiveResource = /** @class */function (_super) {
  __extends(ProgressiveResource, _super);
  function ProgressiveResource() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.progress = new Progress(0, 0);
    return _this;
  }
  ProgressiveResource.prototype.updateProgress = function (progress) {
    this.progress = progress;
  };
  __decorate([solidium.Signal()], ProgressiveResource.prototype, "progress", undefined);
  return ProgressiveResource;
}(Resource);

var DownloadResource = /** @class */function (_super) {
  __extends(DownloadResource, _super);
  function DownloadResource() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  DownloadResource.prototype.handleResponse = function (response, state) {
    return __awaiter(this, undefined, undefined, function () {
      var _this = this;
      return __generator(this, function (_a) {
        // Set up progress tracking
        response.onDownload(function (progress) {
          _this.updateProgress(progress);
        });
        return [2 /*return*/, _super.prototype.handleResponse.call(this, response, state)];
      });
    });
  };
  DownloadResource.prototype.updateProgress = function (progress) {
    this.progress = progress;
  };
  DownloadResource.prototype.resolveResponseBody = function (response) {
    return __asyncGenerator(this, arguments, function resolveResponseBody_1() {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, __await(response.body())];
          case 1:
            return [4 /*yield*/, _a.sent()];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  __decorate([solidium.Signal()], DownloadResource.prototype, "progress", undefined);
  DownloadResource = __decorate([ioc.Scope(ioc.InstanceScope.TRANSIENT)], DownloadResource);
  return DownloadResource;
}(ProgressiveResource);

function download() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return execute(args, DownloadResource);
}

var UploadResource = /** @class */function (_super) {
  __extends(UploadResource, _super);
  function UploadResource() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.progress = new Progress(0, 0);
    return _this;
  }
  UploadResource.prototype.updateProgress = function (progress) {
    this.progress = progress;
  };
  UploadResource.prototype.handleResponse = function (response, state) {
    return __awaiter(this, undefined, undefined, function () {
      var _this = this;
      return __generator(this, function (_a) {
        response.onUpload(function (progress) {
          _this.updateProgress(progress);
        });
        return [2 /*return*/, _super.prototype.handleResponse.call(this, response, state)];
      });
    });
  };
  __decorate([solidium.Signal()], UploadResource.prototype, "progress", undefined);
  return UploadResource;
}(ProgressiveResource);

function upload() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  return execute(args, UploadResource);
}

exports.AbortError = AbortError;
exports.BadGatewayError = BadGatewayError;
exports.BadRequestError = BadRequestError;
exports.CancellationError = CancellationError;
exports.CircuitBreakerError = CircuitBreakerError;
exports.CircuitBreakerInterceptor = CircuitBreakerInterceptor;
exports.ConflictError = ConflictError;
exports.Defer = Defer;
exports.EXECUTE = EXECUTE;
exports.Endpoint = Endpoint;
exports.ErrorContextInterceptor = ErrorContextInterceptor;
exports.Events = Events;
exports.ExpectationFailedError = ExpectationFailedError;
exports.FailedDependencyError = FailedDependencyError;
exports.FetchRequestAdapter = FetchRequestAdapter;
exports.ForbiddenError = ForbiddenError;
exports.GatewayTimeoutError = GatewayTimeoutError;
exports.Get = Get;
exports.GoneError = GoneError;
exports.HTTPVersionNotSupportedError = HTTPVersionNotSupportedError;
exports.Header = Header;
exports.HttpError = HttpError;
exports.HttpHeaders = HttpHeaders;
exports.HttpResponse = HttpResponse;
exports.HttpStatusError = HttpStatusError;
exports.ImATeapotError = ImATeapotError;
exports.InsufficientStorageError = InsufficientStorageError;
exports.InternalServerError = InternalServerError;
exports.LengthRequiredError = LengthRequiredError;
exports.LockedError = LockedError;
exports.LoopDetectedError = LoopDetectedError;
exports.MaxRetryAttemptsReachedError = MaxRetryAttemptsReachedError;
exports.MethodNotAllowedError = MethodNotAllowedError;
exports.MisdirectedRequestError = MisdirectedRequestError;
exports.NetworkAuthenticationRequiredError = NetworkAuthenticationRequiredError;
exports.NetworkError = NetworkError;
exports.NotAcceptableError = NotAcceptableError;
exports.NotExtendedError = NotExtendedError;
exports.NotFoundError = NotFoundError;
exports.NotImplementedError = NotImplementedError;
exports.ParseError = ParseError;
exports.PathVariable = PathVariable;
exports.Payload = Payload;
exports.PayloadTooLargeError = PayloadTooLargeError;
exports.PaymentRequiredError = PaymentRequiredError;
exports.Post = Post;
exports.PreconditionFailedError = PreconditionFailedError;
exports.PreconditionRequiredError = PreconditionRequiredError;
exports.Progress = Progress;
exports.ProxyAuthenticationRequiredError = ProxyAuthenticationRequiredError;
exports.Query = Query;
exports.RangeNotSatisfiableError = RangeNotSatisfiableError;
exports.Request = Request;
exports.RequestHeaderFieldsTooLargeError = RequestHeaderFieldsTooLargeError;
exports.RequestMethod = RequestMethod;
exports.RequestTimeoutError = RequestTimeoutError;
exports.Resource = Resource;
exports.ResourceError = ResourceError;
exports.RestfulResource = RestfulResource;
exports.RetryInterceptor = RetryInterceptor;
exports.SET_DATA = SET_DATA;
exports.SET_ERROR = SET_ERROR;
exports.SWRInstance = SWRInstance;
exports.ServerError = ServerError;
exports.ServiceUnavailableError = ServiceUnavailableError;
exports.TimeoutError = TimeoutError;
exports.TimeoutInterceptor = TimeoutInterceptor;
exports.TooEarlyError = TooEarlyError;
exports.TooManyRequestsError = TooManyRequestsError;
exports.URITooLongError = URITooLongError;
exports.UnauthorizedError = UnauthorizedError;
exports.UnavailableForLegalReasonsError = UnavailableForLegalReasonsError;
exports.UnprocessableEntityError = UnprocessableEntityError;
exports.UnsupportedMediaTypeError = UnsupportedMediaTypeError;
exports.UpgradeRequiredError = UpgradeRequiredError;
exports.VariantAlsoNegotiatesError = VariantAlsoNegotiatesError;
exports.XMLHttpRequestAdapter = XMLHttpRequestAdapter;
exports.createRequestDecorator = createRequestDecorator;
exports.download = download;
exports.isInterceptor = isInterceptor;
exports.isInterceptorConstructor = isInterceptorConstructor;
exports.isURL = isURL;
exports.joinPath = joinPath;
exports.jsonsse = jsonsse;
exports.mergeAbortSignal = mergeAbortSignal;
exports.parseHeaders = parseHeaders;
exports.resolveURL = resolveURL;
exports.restfull = restfull;
exports.upload = upload;
//# sourceMappingURL=index.cjs.js.map
