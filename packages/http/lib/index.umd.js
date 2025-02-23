(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@vgerbot/ioc')) :
    typeof define === 'function' && define.amd ? define(['exports', '@vgerbot/ioc'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SolidiumHttp = {}, global.IOC));
})(this, (function (exports, ioc) { 'use strict';

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
        this.status = init.status;
      }
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
          var _a, _b, _c, chunk, json, e_1_1;
          var _d, e_1, _e, _f;
          if (encoding === undefined) {
            encoding = 'UTF-8';
          }
          return __generator(this, function (_g) {
            switch (_g.label) {
              case 0:
                _g.trys.push([0, 7, 8, 13]);
                _a = true, _b = __asyncValues(this.textStream(encoding));
                _g.label = 1;
              case 1:
                return [4 /*yield*/, __await(_b.next())];
              case 2:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 6];
                _f = _c.value;
                _a = false;
                chunk = _f;
                json = chunk.replace(/^data:\s+/, '');
                return [4 /*yield*/, __await(JSON.parse(json))];
              case 3:
                return [4 /*yield*/, _g.sent()];
              case 4:
                _g.sent();
                _g.label = 5;
              case 5:
                _a = true;
                return [3 /*break*/, 1];
              case 6:
                return [3 /*break*/, 13];
              case 7:
                e_1_1 = _g.sent();
                e_1 = {
                  error: e_1_1
                };
                return [3 /*break*/, 13];
              case 8:
                _g.trys.push([8,, 11, 12]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 10];
                return [4 /*yield*/, __await(_e.call(_b))];
              case 9:
                _g.sent();
                _g.label = 10;
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
    var ABORT_CONTROLLER = Symbol('abort-controller');
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
          return this[ABORT_CONTROLLER].signal;
        },
        enumerable: false,
        configurable: true
      });
      Defer.prototype.abort = function (message) {
        this[ABORT_CONTROLLER].abort();
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
    _a = STATUS, _b = ABORT_CONTROLLER;
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
      return HttpHeaders;
    }();

    var Progress = /** @class */function () {
      function Progress(total, loaded, chunk) {
        this.total = total;
        this.loaded = loaded;
        this.chunk = chunk;
      }
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
          _this.executeRequestIfNeed = function () {
            return undefined;
          };
          if (_this.isAborted) {
            return;
          }
          if (options.payload) {
            xhr.send(options.payload);
          }
        };
        xhr.addEventListener('readystatechange', function () {
          if (xhr.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
            var rawHeaders = xhr.getAllResponseHeaders();
            var headers = new HttpHeaders(parseHeaders(rawHeaders));
            _this.headersDefer.resolve(headers);
          } else if (xhr.readyState === XMLHttpRequest.DONE) {
            _this.bodyDefer.resolve(new BlobByteStream(xhr.response));
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
      XMLHttpRequestAdapter.prototype.onDownload = function (listener) {
        return this.events.on('download', listener);
      };
      XMLHttpRequestAdapter.prototype.onUpload = function (listener) {
        return this.events.on('upload', listener);
      };
      XMLHttpRequestAdapter.prototype.execute = function () {
        return __awaiter(this, undefined, undefined, function () {
          var _a, headersDefer, bodyDefer;
          return __generator(this, function (_b) {
            this.executeRequestIfNeed();
            _a = this, headersDefer = _a.headersDefer, bodyDefer = _a.bodyDefer;
            return [2 /*return*/, {
              status: this.xhr.status,
              headers: function () {
                return headersDefer.promise;
              },
              body: function () {
                return bodyDefer.promise;
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

    function mergeAbortSignal() {
      var signals = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        signals[_i] = arguments[_i];
      }
      var controller = new AbortController();
      var mergedSignal = controller.signal;
      signals.filter(function (it) {
        return !!it;
      }).forEach(function (signal) {
        signal.addEventListener('abort', function () {
          controller.abort();
        });
      });
      return mergedSignal;
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
      var _loop_1 = function (paramKey, paramValue) {
        if (Array.isArray(paramValue)) {
          paramValue.forEach(function (arrayItem) {
            urlObject.searchParams.append(paramKey, arrayItem.toString());
          });
        } else {
          urlObject.searchParams.append(paramKey, paramValue.toString());
        }
      };
      for (var _i = 0, _a = Object.entries(queryParameters); _i < _a.length; _i++) {
        var _b = _a[_i],
          paramKey = _b[0],
          paramValue = _b[1];
        _loop_1(paramKey, paramValue);
      }
      return urlObject.toString();
    }

    var HttpError = /** @class */function (_super) {
      __extends(HttpError, _super);
      function HttpError(message, status, code, context) {
        var _this = _super.call(this, message) || this;
        _this.status = status;
        _this.code = code;
        _this.context = context;
        _this.name = 'HttpError';
        return _this;
      }
      return HttpError;
    }(Error);
    var NetworkError = /** @class */function (_super) {
      __extends(NetworkError, _super);
      function NetworkError(message, context) {
        if (context === undefined) {
          context = {};
        }
        var _this = _super.call(this, message, 0, 'NETWORK_ERROR', context) || this;
        _this.name = 'NetworkError';
        return _this;
      }
      return NetworkError;
    }(HttpError);
    var TimeoutError = /** @class */function (_super) {
      __extends(TimeoutError, _super);
      function TimeoutError(message, context) {
        if (context === undefined) {
          context = {};
        }
        var _this = _super.call(this, message, 408, 'REQUEST_TIMEOUT', context) || this;
        _this.name = 'TimeoutError';
        return _this;
      }
      return TimeoutError;
    }(HttpError);
    var ValidationError = /** @class */function (_super) {
      __extends(ValidationError, _super);
      function ValidationError(message, context) {
        if (context === undefined) {
          context = {};
        }
        var _this = _super.call(this, message, 400, 'VALIDATION_ERROR', context) || this;
        _this.name = 'ValidationError';
        return _this;
      }
      return ValidationError;
    }(HttpError);
    var AuthenticationError = /** @class */function (_super) {
      __extends(AuthenticationError, _super);
      function AuthenticationError(message, context) {
        if (context === undefined) {
          context = {};
        }
        var _this = _super.call(this, message, 401, 'AUTHENTICATION_ERROR', context) || this;
        _this.name = 'AuthenticationError';
        return _this;
      }
      return AuthenticationError;
    }(HttpError);
    var ApiError = /** @class */function (_super) {
      __extends(ApiError, _super);
      function ApiError(message, status, code, context) {
        if (context === undefined) {
          context = {};
        }
        var _this = _super.call(this, message, status, code, context) || this;
        _this.name = 'ApiError';
        return _this;
      }
      return ApiError;
    }(HttpError);

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
                  error_1.context = __assign(__assign({}, error_1.context), {
                    methodName: method.name.toString(),
                    timestamp: new Date().toISOString(),
                    headers: params.headers.toJSON(),
                    pathVariables: params.pathVariables,
                    queryParams: params.queryParams
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
            if (error instanceof HttpError) {
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
            throw new HttpError('Max retry attempts reached', error instanceof HttpError ? error.status : 0, 'MAX_RETRY_EXCEEDED', {
              attempts: attempt,
              originalError: error instanceof Error ? error.message : String(error)
            });
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
    var INTERCEPTORS = Symbol('endpoint-interceptors');
    /** Stores the HTTP adapter configuration for an endpoint */
    var ADAPTER = Symbol('endpoint-adapter');
    /** Stores the interceptor construction logic for an endpoint */
    var CONSTRUCT_INTERCEPTORS = Symbol('endpoint-construct-interceptors');

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
        this.baseInterceptors.push(new ErrorContextInterceptor());
        var retryConfig = this.metadata.getRetryConfig();
        if (retryConfig) {
          this.baseInterceptors.push(new RetryInterceptor(retryConfig));
        }
      }
      RequestMethod.prototype.invoke = function (instance, params) {
        var _this = this;
        var timeout = this.metadata.getTimeout() || this.endpointMetadata.getTimeout();
        var extInterceptors = [];
        if (timeout > 0) {
          extInterceptors.push(new TimeoutInterceptor({
            timeout: timeout
          }));
        } else if (timeout !== 0) {
          extInterceptors.push(new TimeoutInterceptor());
        }
        var endpointInterceptors = instance[INTERCEPTORS];
        var methodInterceptors = instance[CONSTRUCT_INTERCEPTORS](this.metadata.getInterceptors());
        var allInterceptors = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], this.baseInterceptors, true), extInterceptors, true), endpointInterceptors, true), methodInterceptors, true);
        var sendRequest = allInterceptors.reduceRight(function (next, interceptor) {
          return function (method, params) {
            return interceptor.invoke(method, params, next);
          };
        }, function (method, params) {
          return __awaiter(_this, undefined, undefined, function () {
            var adapter, source;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  adapter = method.createAdapter(instance, params);
                  return [4 /*yield*/, adapter.execute()];
                case 1:
                  source = _a.sent();
                  return [2 /*return*/, new HttpResponse(source, {
                    status: source.status,
                    method: this
                  })];
              }
            });
          });
        });
        return sendRequest(this, params);
      };
      RequestMethod.prototype.createAdapter = function (instance, params) {
        var _a, _b, _c, _d, _e;
        var url = resolveURL(this.url, (_a = params.pathVariables) !== null && _a !== undefined ? _a : {}, (_b = params.queryParams) !== null && _b !== undefined ? _b : {});
        var method = this.metadata.getHttpMethod();
        var headers = this.metadata.getHeaders();
        var signal = mergeAbortSignal(this.metadata.getSignal(), params.signal);
        var options = {
          url: url,
          method: method,
          headers: headers.concat(params.headers),
          payload: params.payload,
          signal: signal,
          invokeMethod: this
        };
        var adapter = new ((_e = (_d = (_c = params.adapter) !== null && _c !== undefined ? _c : this.metadata.getAdapter()) !== null && _d !== undefined ? _d : instance[ADAPTER]) !== null && _e !== undefined ? _e : XMLHttpRequestAdapter)(options);
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
                    throw new HttpError('Circuit breaker is open', 503, 'CIRCUIT_OPEN', {
                      resetIn: this.config.resetTimeout - (Date.now() - this.lastFailureTime),
                      failures: this.failures
                    });
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

    var FetchRequestAdapter = /** @class */function () {
      function FetchRequestAdapter(options) {
        var _this = this;
        this.events = new Events();
        this.headersDefer = new Defer();
        this.bodyDefer = new Defer();
        this.status = 0;
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
            _this.status = response.status;
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
      FetchRequestAdapter.prototype.onDownload = function (listener) {
        return this.events.on('download', listener);
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      FetchRequestAdapter.prototype.onUpload = function (_listener) {
        return function () {
          return undefined;
        };
      };
      FetchRequestAdapter.prototype.execute = function () {
        return __awaiter(this, undefined, undefined, function () {
          var _a, headersDefer, bodyDefer, getStatus;
          var _this = this;
          return __generator(this, function (_b) {
            this.executeRequestIfNeed();
            _a = this, headersDefer = _a.headersDefer, bodyDefer = _a.bodyDefer;
            getStatus = function () {
              return _this.status;
            };
            return [2 /*return*/, {
              get status() {
                return getStatus();
              },
              headers: function () {
                return headersDefer.promise;
              },
              body: function () {
                return bodyDefer.promise;
              }
            }];
          });
        });
      };
      return FetchRequestAdapter;
    }();

    function buildEndpointClass(endpointClass, metadata) {
      ioc.Generate(function (appCtx) {
        return metadata.getInterceptors().map(function (identifier) {
          if (isInterceptor(identifier)) {
            return identifier;
          }
          return appCtx.getInstance(identifier);
        }).flat();
      })(endpointClass.prototype, INTERCEPTORS);
      Reflect.set(endpointClass.prototype, ADAPTER, metadata.getAdaptor());
      var methods = new Map();
      metadata.getMethods().forEach(function (methodMetadata, methodName) {
        methods.set(methodName, new RequestMethod(methodName, metadata, methodMetadata));
      });
      Reflect.set(endpointClass.prototype, METHODS, methods);
      ioc.Generate(function (appCtx) {
        return function (interceptors) {
          return interceptors.map(function (identifier) {
            return appCtx.getInstance(identifier);
          }).flat();
        };
      })(endpointClass.prototype, CONSTRUCT_INTERCEPTORS);
    }

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
        if ('extends' in endpointOptions) {
          var parent_1 = EndpointMetadata.from(endpointOptions.extends);
          this.baseURL = parent_1.baseURL;
          this.timeout = parent_1.timeout;
          this.headers = this.headers.concat(parent_1.headers);
          this.interceptors = parent_1.interceptors;
          this.adapter = parent_1.adapter;
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
        if (this.methods.has(methodName)) {
          return this.methods.get(methodName);
        }
      };
      EndpointMetadata.prototype.setMethodMetadata = function (methodName, methodMetadata) {
        this.methods.set(methodName, methodMetadata);
      };
      EndpointMetadata.prototype.getMethods = function () {
        return this.methods;
      };
      EndpointMetadata.prototype.getInterceptors = function () {
        var _a, _b;
        return (_b = (_a = this.interceptors) === null || _a === undefined ? undefined : _a.map(function (interceptor) {
          if (isInterceptorFunction(interceptor)) {
            return /** @class */function () {
              function class_1() {}
              class_1.prototype.invoke = function (method, params, next) {
                return interceptor(method, params, next);
              };
              return class_1;
            }();
          }
          return interceptor;
        })) !== null && _b !== undefined ? _b : [];
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

    function executeRequest(instance, methodMetadata, args, originFunction) {
      ({
        signal: methodMetadata.getSignal(),
        headers: methodMetadata.getHeaders().clone(),
        adapter: methodMetadata.getAdapter()
      });
      return originFunction.apply(instance, args);
    }

    var RequestMethodMetadata = /** @class */function () {
      function RequestMethodMetadata(name, options) {
        this.name = name;
        this.options = options;
        this.executionHandlers = [];
        this.signal = new AbortSignal();
      }
      RequestMethodMetadata.prototype.appendSWRConfig = function (config) {
        this.swrConfig = __assign(__assign({}, this.swrConfig), config);
      };
      RequestMethodMetadata.prototype.getSWRConfig = function () {
        return this.swrConfig;
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
      RequestMethodMetadata.prototype.appendSignal = function (signal) {
        this.signal = signal;
      };
      RequestMethodMetadata.prototype.getSignal = function () {
        return this.signal;
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
        return ((_a = this.options.interceptors) !== null && _a !== undefined ? _a : []).map(function (interceptor) {
          if (isInterceptorFunction(interceptor)) {
            return /** @class */function () {
              function class_1() {}
              class_1.prototype.invoke = function (method, params, next) {
                return interceptor(method, params, next);
              };
              return class_1;
            }();
          }
          return interceptor;
        });
      };
      RequestMethodMetadata.prototype.getAdapter = function () {
        return this.options.adapter;
      };
      return RequestMethodMetadata;
    }();

    function Request(options) {
      return function (target, context) {
        if (!target || !('constructor' in target)) {
          return;
        }
        var propertyKey = typeof context === 'object' ? context.name : context;
        var method = new RequestMethodMetadata(propertyKey, options);
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
          var endpointMetadata = EndpointMetadata.from(target.constructor);
          endpointMetadata.setMethodMetadata(propertyKey, method);
        }
        function deletator(originFunction) {
          return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
              args[_i] = arguments[_i];
            }
            return executeRequest(this, method, args, originFunction);
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
        appendExecHandler(target, methodName, function (instance, metadata, params, args) {
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
        appendExecHandler(target, methodName, function (instance, metadata, params, args) {
          var value = args[parameterIndex];
          params.pathVariables[name] = (value !== null && value !== undefined ? value : defaultValue) + '';
        });
      };
    }

    function Query(name, defaultValue) {
      return function (target, methodName, parameterIndex) {
        appendExecHandler(target, methodName, function (instance, metadata, params, args) {
          var value = args[parameterIndex];
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

    var DefaultRevalidateStrategy = /** @class */function () {
      function DefaultRevalidateStrategy(options) {
        this.options = options;
      }
      DefaultRevalidateStrategy.prototype.invoke = function (revalidate) {
        if (typeof window !== 'undefined') {
          if (this.options.focus !== false) {
            window.addEventListener('focus', function () {
              return revalidate('focus');
            });
          }
          if (this.options.reconnect) {
            window.addEventListener('online', function () {
              return revalidate('reconnect');
            });
          }
          if (this.options.events) {
            this.options.events.forEach(function (event) {
              window.addEventListener(event, function () {
                revalidate(event);
              });
            });
          }
        }
      };
      return DefaultRevalidateStrategy;
    }();
    var defaultConfig = {
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
    var SWRInstance = /** @class */function () {
      function SWRInstance(key, fetcher, options) {
        if (options === undefined) {
          options = {};
        }
        var _this = this;
        this.key = key;
        this.fetcher = fetcher;
        this.options = options;
        this.lastFetchTime = 0;
        this.currentRetryAttempt = 0;
        this.cleanupFns = [];
        this.config = __assign(__assign({}, defaultConfig), options);
        this.state = {
          data: options.initialData,
          isLoading: true,
          isValidating: false
        };
        this.setupRevalidationStrategy();
        this.setupRefreshInterval();
        (function () {
          _this.revalidate(); // Initial fetch
        })();
      }
      SWRInstance.prototype.setState = function (newState) {
        var _a, _b;
        this.state = __assign(__assign({}, this.state), newState);
        (_b = (_a = this.options).onStateChange) === null || _b === undefined ? undefined : _b.call(_a, this.state);
      };
      SWRInstance.prototype.revalidate = function (reason) {
        return __awaiter(this, undefined, undefined, function () {
          var now, dedupingInterval, newData, err_1, error, retryContext, delay;
          var _this = this;
          var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
          return __generator(this, function (_l) {
            switch (_l.label) {
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
                _l.label = 1;
              case 1:
                _l.trys.push([1, 3,, 4]);
                return [4 /*yield*/, this.fetcher()];
              case 2:
                newData = _l.sent();
                this.setState({
                  data: newData,
                  error: undefined,
                  isLoading: false,
                  isValidating: false
                });
                this.currentRetryAttempt = 0;
                (_c = (_b = this.options).onSuccess) === null || _c === undefined ? undefined : _c.call(_b, newData);
                return [3 /*break*/, 4];
              case 3:
                err_1 = _l.sent();
                error = err_1;
                this.setState({
                  error: error,
                  isLoading: false,
                  isValidating: false
                });
                (_e = (_d = this.options).onError) === null || _e === undefined ? undefined : _e.call(_d, error);
                // Retry logic
                if (this.config.retry && this.currentRetryAttempt < this.config.retry.maxAttempts) {
                  retryContext = {
                    error: error,
                    attempt: this.currentRetryAttempt + 1,
                    timestamp: Date.now()
                  };
                  if (((_g = (_f = this.config.retry).shouldRetryOnError) === null || _g === undefined ? undefined : _g.call(_f, retryContext)) !== false) {
                    this.currentRetryAttempt++;
                    delay = (_k = (_j = (_h = this.config.retry).calculateDelay) === null || _j === undefined ? undefined : _j.call(_h, this.currentRetryAttempt, error)) !== null && _k !== undefined ? _k : this.config.retry.interval * Math.pow(2, this.currentRetryAttempt - 1);
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
      SWRInstance.prototype.setupRevalidationStrategy = function () {
        var _this = this;
        var _a, _b;
        var rawStrategy = (_a = this.config.revalidate) === null || _a === undefined ? undefined : _a.strategy;
        if ((_b = this.config.revalidate) === null || _b === undefined ? undefined : _b.strategy) {
          var strategy = isRevalidateStrategyFunction(rawStrategy) ? {
            invoke: rawStrategy
          } : new DefaultRevalidateStrategy(this.config.revalidate.on);
          strategy.invoke(function (reason) {
            _this.revalidate(reason);
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

    exports.ApiError = ApiError;
    exports.AuthenticationError = AuthenticationError;
    exports.CancellationError = CancellationError;
    exports.CircuitBreakerInterceptor = CircuitBreakerInterceptor;
    exports.DefaultRevalidateStrategy = DefaultRevalidateStrategy;
    exports.Defer = Defer;
    exports.Endpoint = Endpoint;
    exports.ErrorContextInterceptor = ErrorContextInterceptor;
    exports.Events = Events;
    exports.FetchRequestAdapter = FetchRequestAdapter;
    exports.Get = Get;
    exports.Header = Header;
    exports.HttpError = HttpError;
    exports.HttpHeaders = HttpHeaders;
    exports.HttpResponse = HttpResponse;
    exports.NetworkError = NetworkError;
    exports.PathVariable = PathVariable;
    exports.Post = Post;
    exports.Progress = Progress;
    exports.Query = Query;
    exports.Request = Request;
    exports.RequestMethod = RequestMethod;
    exports.RetryInterceptor = RetryInterceptor;
    exports.SWRInstance = SWRInstance;
    exports.TimeoutError = TimeoutError;
    exports.TimeoutInterceptor = TimeoutInterceptor;
    exports.ValidationError = ValidationError;
    exports.XMLHttpRequestAdapter = XMLHttpRequestAdapter;
    exports.createRequestDecorator = createRequestDecorator;
    exports.isInterceptor = isInterceptor;
    exports.isInterceptorConstructor = isInterceptorConstructor;
    exports.isInterceptorFunction = isInterceptorFunction;
    exports.isRevalidateStrategyClass = isRevalidateStrategyClass;
    exports.isRevalidateStrategyFunction = isRevalidateStrategyFunction;
    exports.isURL = isURL;
    exports.joinPath = joinPath;
    exports.mergeAbortSignal = mergeAbortSignal;
    exports.parseHeaders = parseHeaders;
    exports.resolveURL = resolveURL;

}));
//# sourceMappingURL=index.umd.js.map
