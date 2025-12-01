(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@vgerbot/ioc'), require('@vgerbot/lazy'), require('@vgerbot/persistence'), require('@vgerbot/solidium'), require('rxjs'), require('solid-js'), require('@solid-primitives/scheduled')) :
    typeof define === 'function' && define.amd ? define(['exports', '@vgerbot/ioc', '@vgerbot/lazy', '@vgerbot/persistence', '@vgerbot/solidium', 'rxjs', 'solid-js', '@solid-primitives/scheduled'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SolidiumHttp = {}, global.IOC, global.lazy, global.Persistence, global.Solidium, global.rxjs, global.solidJs, global.scheduled));
})(this, (function (exports, ioc, lazy, persistence, solidium, rxjs, solidJs, scheduled) { 'use strict';

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

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
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
    var HttpResponse = /** @class */function () {
      function HttpResponse(source, init) {
        this.source = source;
        this.init = init;
      }
      HttpResponse.of = function (body, headers, status, method) {
        return new HttpResponse({
          status: function () {
            return Promise.resolve(status);
          },
          headers: function () {
            return Promise.resolve(headers);
          },
          body: function () {
            return body;
          },
          onDownload: function () {
            return function () {
              return undefined;
            };
          },
          onUpload: function () {
            return function () {
              return undefined;
            };
          },
          onBodyComplete: function () {
            return function () {
              return undefined;
            };
          }
        }, {
          method: method
        });
      };
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
        return __awaiter(this, void 0, void 0, function () {
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
        return __awaiter(this, void 0, void 0, function () {
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
          if (encoding === void 0) {
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
          if (encoding === void 0) {
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
                _d = __read((_h = regex.exec(chunk)) !== null && _h !== void 0 ? _h : [], 3), event_1 = _d[1], data = _d[2];
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
      HttpResponse.prototype.onBodyComplete = function (listener) {
        return this.source.onBodyComplete(listener);
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
          return __awaiter(_this, void 0, void 0, function () {
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
          listener.apply(void 0, __spreadArray([], __read(args), false));
        };
        var listeners = (_a = this.listeners.get(event)) !== null && _a !== void 0 ? _a : new Set();
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
        (_a = this.listeners.get(event)) === null || _a === void 0 ? void 0 : _a.forEach(function (listener) {
          listener.apply(void 0, __spreadArray([], __read(args), false));
        });
      };
      return Events;
    }();

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
              _this.set.apply(_this, __spreadArray([key], __read(value), false));
            } else {
              _this.set(key, value);
            }
          });
        } else {
          for (var key in headers) {
            var value = headers[key];
            if (Array.isArray(value)) {
              this.set.apply(this, __spreadArray([key], __read(value), false));
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
        var originValues = (_a = this.headers.get(name)) !== null && _a !== void 0 ? _a : [];
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
          result.set.apply(result, __spreadArray([key], __read(value), false));
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
      HttpHeaders.prototype.getContentLength = function () {
        var _a;
        var _b = __read((_a = this.get('content-length')) !== null && _a !== void 0 ? _a : [], 1),
          contentLengthStr = _b[0];
        return parseInt(contentLengthStr) || 0;
      };
      return HttpHeaders;
    }();

    function readStream(stream) {
      return __asyncGenerator(this, arguments, function readStream_1() {
        var reader, _a, value, done;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              reader = stream.getReader();
              _b.label = 1;
            case 1:
              _b.trys.push([1,, 7, 8]);
              _b.label = 2;
            case 2:
              return [4 /*yield*/, __await(reader.read())];
            case 3:
              _a = _b.sent(), value = _a.value, done = _a.done;
              if (done) {
                return [3 /*break*/, 6];
              }
              return [4 /*yield*/, __await(value)];
            case 4:
              return [4 /*yield*/, _b.sent()];
            case 5:
              _b.sent();
              return [3 /*break*/, 2];
            case 6:
              return [3 /*break*/, 8];
            case 7:
              reader.releaseLock();
              return [7 /*endfinally*/];
            case 8:
              return [2 /*return*/];
          }
        });
      });
    }

    function createProgressiveReadableStream(stream, progress) {
      var _this = this;
      if (progress === void 0) {
        progress = function () {
          return void 0;
        };
      }
      var loaded = 0;
      var abortController = new AbortController();
      return new ReadableStream({
        start: function (controller) {
          return __awaiter(_this, void 0, void 0, function () {
            var _a, _b, _c, chunk, e_1_1, e_2;
            var _d, e_1, _e, _f;
            return __generator(this, function (_g) {
              switch (_g.label) {
                case 0:
                  _g.trys.push([0, 13, 14, 15]);
                  progress(loaded);
                  _g.label = 1;
                case 1:
                  _g.trys.push([1, 6, 7, 12]);
                  _a = true, _b = __asyncValues(readStream(stream));
                  _g.label = 2;
                case 2:
                  return [4 /*yield*/, _b.next()];
                case 3:
                  if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                  _f = _c.value;
                  _a = false;
                  chunk = _f;
                  loaded += chunk.byteLength;
                  progress(loaded);
                  controller.enqueue(chunk.buffer);
                  if (abortController.signal.aborted) {
                    return [3 /*break*/, 5];
                  }
                  _g.label = 4;
                case 4:
                  _a = true;
                  return [3 /*break*/, 2];
                case 5:
                  return [3 /*break*/, 12];
                case 6:
                  e_1_1 = _g.sent();
                  e_1 = {
                    error: e_1_1
                  };
                  return [3 /*break*/, 12];
                case 7:
                  _g.trys.push([7,, 10, 11]);
                  if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                  return [4 /*yield*/, _e.call(_b)];
                case 8:
                  _g.sent();
                  _g.label = 9;
                case 9:
                  return [3 /*break*/, 11];
                case 10:
                  if (e_1) throw e_1.error;
                  return [7 /*endfinally*/];
                case 11:
                  return [7 /*endfinally*/];
                case 12:
                  return [3 /*break*/, 15];
                case 13:
                  e_2 = _g.sent();
                  controller.error(e_2);
                  return [3 /*break*/, 15];
                case 14:
                  controller.close();
                  return [7 /*endfinally*/];
                case 15:
                  return [2 /*return*/];
              }
            });
          });
        },
        cancel: function () {
          abortController.abort();
        }
      });
    }

    var Progress = /** @class */function () {
      function Progress(total, loaded, chunk) {
        this.total = total;
        this.loaded = loaded;
        this.chunk = chunk;
      }
      Progress.prototype.percent = function (suffix, fractionDigits) {
        if (suffix === void 0) {
          suffix = '%';
        }
        if (fractionDigits === void 0) {
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

    var BlobByteStream = /** @class */function (_super) {
      __extends(BlobByteStream, _super);
      function BlobByteStream(blob) {
        var _this = _super.call(this) || this;
        _this.blob = blob;
        return _this;
      }
      BlobByteStream.prototype.readAsStream = function () {
        var _this = this;
        var total = this.blob.size;
        return createProgressiveReadableStream(this.blob.stream(), function (loaded) {
          _this.updateProgress(new Progress(total, loaded));
        });
      };
      BlobByteStream.prototype.readAsBlob = function (contentType) {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            if (contentType === this.blob.type) {
              return [2 /*return*/, this.blob];
            }
            return [2 /*return*/, new Blob([this.blob], {
              type: contentType
            })];
          });
        });
      };
      BlobByteStream.prototype.readAsBuffer = function () {
        return this.blob.arrayBuffer();
      };
      BlobByteStream.prototype.total = function () {
        return Promise.resolve(this.blob.size);
      };
      return BlobByteStream;
    }(ProgressiveByteStream);

    var IGNORE_DUPLICATE_OF = new Set(['age', 'authorization', 'content-length', 'content-type', 'etag', 'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since', 'last-modified', 'location', 'max-forwards', 'proxy-authorization', 'referer', 'retry-after', 'user-agent']);
    function parseHeaders(rawHeaders) {
      var result = new Map();
      if (!(rawHeaders === null || rawHeaders === void 0 ? void 0 : rawHeaders.trim())) {
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
        var values = (_a = result.get(key)) !== null && _a !== void 0 ? _a : [];
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
          return __awaiter(_this, void 0, void 0, function () {
            var reader, chunks, _a, value, done;
            return __generator(this, function (_b) {
              switch (_b.label) {
                case 0:
                  this.executeRequestIfNeed = function () {
                    return void 0;
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
            _this.bodyDefer.resolve(new BlobByteStream((_a = xhr.response) !== null && _a !== void 0 ? _a : new Blob([])));
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
        return __awaiter(this, void 0, void 0, function () {
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
              },
              onBodyComplete: function (listener) {
                var isListenerCancelled = false;
                bodyDefer.promise.then(function (body) {
                  if (isListenerCancelled) {
                    return;
                  }
                  listener(body);
                });
                return function () {
                  isListenerCancelled = true;
                };
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
          return (_b = (_a = pathVariables[variableName]) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : fullMatch;
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
    var HttpError = /** @class */function (_super) {
      __extends(HttpError, _super);
      /**
       * Creates a new HTTP error.
       *
       * @param message - Human-readable error message
       * @param cause - Optional underlying error that caused this error
       */
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
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
        if (message === void 0) {
          message = 'Network Authentication Required';
        }
        return _super.call(this, 511, 'Network Authentication Required', headers, responseBody, message) || this;
      }
      return NetworkAuthenticationRequiredError;
    }(ServerError);

    var ErrorContextInterceptor = /** @class */function () {
      function ErrorContextInterceptor() {}
      ErrorContextInterceptor.prototype.invoke = function (instance, method, params, next) {
        return __awaiter(this, void 0, void 0, function () {
          var error_1;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2,, 3]);
                return [4 /*yield*/, next(instance, method, params)];
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
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            if (error instanceof HttpStatusError) {
              return [2 /*return*/, this.retryableStatuses.includes(error.status)];
            }
            return [2 /*return*/, true];
          });
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
    var RetryInterceptor = /** @class */function () {
      function RetryInterceptor(config) {
        if (config === void 0) {
          config = {};
        }
        this.config = __assign(__assign({}, DEFAULT_CONFIG$2), config);
      }
      RetryInterceptor.prototype.delay = function (ms) {
        return new Promise(function (resolve) {
          return setTimeout(resolve, ms);
        });
      };
      RetryInterceptor.prototype.invoke = function (instance, method, params, next) {
        return __awaiter(this, void 0, void 0, function () {
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
                return [4 /*yield*/, next(instance, method, params)];
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
    var TimeoutInterceptor = /** @class */function () {
      function TimeoutInterceptor(config) {
        if (config === void 0) {
          config = {};
        }
        this.config = __assign(__assign({}, DEFAULT_CONFIG$1), config);
      }
      TimeoutInterceptor.prototype.invoke = function (instance, method, params, next) {
        return __awaiter(this, void 0, void 0, function () {
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
                return [4 /*yield*/, Promise.race([next(instance, method, __assign(__assign({}, params), {
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
    var ABORT_CONTROLLER = Symbol('abort-controller');
    var APPLICATION_CONTEXT = Symbol('application-context');
    var HTTP_CONFIGURATION = Symbol('http-configuration');

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
      ErrorWrappingInterceptor.prototype.invoke = function (instance, method, params, next) {
        return __awaiter(this, void 0, void 0, function () {
          var response, error_1, abortError, networkError, timeoutError, parseError;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                _a.trys.push([0, 2,, 3]);
                return [4 /*yield*/, next(instance, method, params)];
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
      RequestMethod.get = function (instance, name) {
        var _a;
        return (_a = instance[METHODS]) === null || _a === void 0 ? void 0 : _a.get(name);
      };
      RequestMethod.prototype.getAllInterceptors = function (instance) {
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
        var allInterceptors = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read(this.baseInterceptors), false), __read(extInterceptors), false), __read(endpointInterceptors), false), __read(methodInterceptors), false);
        return allInterceptors;
      };
      RequestMethod.prototype.invoke = function (instance, params) {
        return __awaiter(this, void 0, void 0, function () {
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
        return resolveURL(this.url, (_a = params.pathVariables) !== null && _a !== void 0 ? _a : {}, params.queryParams);
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
        var adapter = new ((_c = (_b = (_a = params.adapter) !== null && _a !== void 0 ? _a : this.metadata.getAdapter()) !== null && _b !== void 0 ? _b : instance[ADAPTER]) !== null && _c !== void 0 ? _c : XMLHttpRequestAdapter)(options);
        return adapter;
      };
      return RequestMethod;
    }();

    var DEFAULT_CONFIG = {
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
    var CircuitBreakerInterceptor = /** @class */function () {
      function CircuitBreakerInterceptor(config) {
        if (config === void 0) {
          config = {};
        }
        this.failures = 0;
        this.lastFailureTime = 0;
        this.state = 'CLOSED';
        this.config = __assign(__assign({}, DEFAULT_CONFIG), config);
      }
      CircuitBreakerInterceptor.of = function (config) {
        if (config === void 0) {
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
      CircuitBreakerInterceptor.prototype.invoke = function (instance, method, params, next) {
        return __awaiter(this, void 0, void 0, function () {
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
                return [4 /*yield*/, next(instance, method, params)];
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
        if (message === void 0) {
          message = 'Circuit breaker is open';
        }
        return _super.call(this, message) || this;
      }
      return CircuitBreakerError;
    }(HttpError);

    var NativeReadableStream = /** @class */function (_super) {
      __extends(NativeReadableStream, _super);
      function NativeReadableStream(contentLength, stream) {
        var _this = _super.call(this) || this;
        _this.contentLength = contentLength;
        _this.stream = stream;
        _this.blobPromise = null;
        return _this;
      }
      NativeReadableStream.prototype.total = function () {
        return Promise.resolve(this.contentLength);
      };
      NativeReadableStream.prototype.readAsStoredBlob = function () {
        return __awaiter(this, void 0, void 0, function () {
          var total, loaded;
          var _this = this;
          return __generator(this, function (_a) {
            if (this.blobPromise !== null) {
              return [2 /*return*/, this.blobPromise];
            }
            total = this.contentLength;
            loaded = 0;
            this.blobPromise = new Promise(function (resolve, reject) {
              var chunks = [];
              _this.updateProgress(new Progress(total, 0));
              (function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var _a, _b, _c, chunk, e_1_1, blob;
                  var _d, e_1, _e, _f;
                  return __generator(this, function (_g) {
                    switch (_g.label) {
                      case 0:
                        _g.trys.push([0, 5, 6, 11]);
                        _a = true, _b = __asyncValues(readStream(this.stream));
                        _g.label = 1;
                      case 1:
                        return [4 /*yield*/, _b.next()];
                      case 2:
                        if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 4];
                        _f = _c.value;
                        _a = false;
                        chunk = _f;
                        loaded += chunk.byteLength;
                        chunks.push(chunk);
                        this.updateProgress(new Progress(total, loaded));
                        _g.label = 3;
                      case 3:
                        _a = true;
                        return [3 /*break*/, 1];
                      case 4:
                        return [3 /*break*/, 11];
                      case 5:
                        e_1_1 = _g.sent();
                        e_1 = {
                          error: e_1_1
                        };
                        return [3 /*break*/, 11];
                      case 6:
                        _g.trys.push([6,, 9, 10]);
                        if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 8];
                        return [4 /*yield*/, _e.call(_b)];
                      case 7:
                        _g.sent();
                        _g.label = 8;
                      case 8:
                        return [3 /*break*/, 10];
                      case 9:
                        if (e_1) throw e_1.error;
                        return [7 /*endfinally*/];
                      case 10:
                        return [7 /*endfinally*/];
                      case 11:
                        blob = new Blob(chunks);
                        resolve(blob);
                        return [2 /*return*/];
                    }
                  });
                });
              })().catch(reject);
            });
            return [2 /*return*/, this.blobPromise];
          });
        });
      };
      NativeReadableStream.prototype.readAsBuffer = function () {
        return __awaiter(this, void 0, void 0, function () {
          var blob;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.readAsStoredBlob()];
              case 1:
                blob = _a.sent();
                return [4 /*yield*/, blob.arrayBuffer()];
              case 2:
                return [2 /*return*/, _a.sent()];
            }
          });
        });
      };
      NativeReadableStream.prototype.readAsStream = function () {
        var _this = this;
        return new ReadableStream({
          start: function (controller) {
            return __awaiter(_this, void 0, void 0, function () {
              var blob, blobStream, _a, _b, _c, chunk, e_2_1, error_1;
              var _d, e_2, _e, _f;
              return __generator(this, function (_g) {
                switch (_g.label) {
                  case 0:
                    _g.trys.push([0, 14,, 15]);
                    return [4 /*yield*/, this.readAsStoredBlob()];
                  case 1:
                    blob = _g.sent();
                    blobStream = blob.stream();
                    _g.label = 2;
                  case 2:
                    _g.trys.push([2, 7, 8, 13]);
                    _a = true, _b = __asyncValues(readStream(blobStream));
                    _g.label = 3;
                  case 3:
                    return [4 /*yield*/, _b.next()];
                  case 4:
                    if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 6];
                    _f = _c.value;
                    _a = false;
                    chunk = _f;
                    controller.enqueue(chunk.buffer);
                    _g.label = 5;
                  case 5:
                    _a = true;
                    return [3 /*break*/, 3];
                  case 6:
                    return [3 /*break*/, 13];
                  case 7:
                    e_2_1 = _g.sent();
                    e_2 = {
                      error: e_2_1
                    };
                    return [3 /*break*/, 13];
                  case 8:
                    _g.trys.push([8,, 11, 12]);
                    if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 10];
                    return [4 /*yield*/, _e.call(_b)];
                  case 9:
                    _g.sent();
                    _g.label = 10;
                  case 10:
                    return [3 /*break*/, 12];
                  case 11:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                  case 12:
                    return [7 /*endfinally*/];
                  case 13:
                    controller.close();
                    return [3 /*break*/, 15];
                  case 14:
                    error_1 = _g.sent();
                    console.error('Error in readAsStream:', error_1);
                    controller.error(error_1);
                    return [3 /*break*/, 15];
                  case 15:
                    return [2 /*return*/];
                }
              });
            });
          }
        });
      };
      NativeReadableStream.prototype.readAsBlob = function () {
        return __awaiter(this, arguments, void 0, function (contentType) {
          var blob;
          if (contentType === void 0) {
            contentType = 'application/octet-stream';
          }
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.readAsStoredBlob()];
              case 1:
                blob = _a.sent();
                // If the requested content type is different from the stored blob's type,
                // create a new blob with the requested type
                if (blob.type !== contentType) {
                  return [2 /*return*/, new Blob([blob], {
                    type: contentType
                  })];
                }
                return [2 /*return*/, blob];
            }
          });
        });
      };
      return NativeReadableStream;
    }(ProgressiveByteStream);

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
            return void 0;
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
        return __awaiter(this, void 0, void 0, function () {
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
                  return void 0;
                };
              },
              onBodyComplete: function (listener) {
                var isListenerCancelled = false;
                bodyDefer.promise.then(function (body) {
                  if (isListenerCancelled) {
                    return;
                  }
                  listener(body);
                });
                return function () {
                  isListenerCancelled = true;
                };
              }
            }];
          });
        });
      };
      return FetchRequestAdapter;
    }();

    var DEFAULT_HTTP_CONFIGURATION = Symbol('solidium-default-http-configuration');
    var Http = /** @class */function () {
      function Http() {}
      Http.configure = function (config) {
        /** @class */(function () {
          function HttpConfigurationFactory() {}
          HttpConfigurationFactory.prototype.produce = function () {
            var _a;
            (_a = config.cacheBucket) !== null && _a !== void 0 ? _a : config.cacheBucket = this.defaultBucket.name;
            return config;
          };
          __decorate([ioc.Inject(), __metadata("design:type", persistence.Persistence)], HttpConfigurationFactory.prototype, "persistence", void 0);
          __decorate([ioc.Inject(persistence.DEFAULT_BUCKET), __metadata("design:type", persistence.Bucket)], HttpConfigurationFactory.prototype, "defaultBucket", void 0);
          __decorate([ioc.Factory(DEFAULT_HTTP_CONFIGURATION), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], HttpConfigurationFactory.prototype, "produce", null);
          return HttpConfigurationFactory;
        })();
        return Http;
      };
      Http.prototype.init = function () {};
      return Http;
    }();

    function buildEndpointClass(endpointClass, metadata) {
      Reflect.set(endpointClass.prototype, GET_INTERCEPTORS, function (exclude) {
        var _this = this;
        var _a, _b;
        var globalInterceptors = (_b = (_a = this[HTTP_CONFIGURATION]) === null || _a === void 0 ? void 0 : _a.interceptors) !== null && _b !== void 0 ? _b : [];
        return __spreadArray(__spreadArray([], __read(globalInterceptors), false), __read(metadata.getInterceptors()), false).filter(function (it) {
          return !(exclude === null || exclude === void 0 ? void 0 : exclude.includes(it));
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
            if (typeof identifier === 'object') {
              return identifier;
            }
            return appCtx.getInstance(identifier);
          }).flat();
        };
      })(endpointClass.prototype, CONSTRUCT_INTERCEPTORS);
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
      ioc.Inject(DEFAULT_HTTP_CONFIGURATION)(endpointClass.prototype, HTTP_CONFIGURATION);
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
        this.externalInterceptors = [];
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
        headers.setAll((_a = this.options.headers) !== null && _a !== void 0 ? _a : {});
        return headers;
      };
      RequestMethodMetadata.prototype.getTimeout = function () {
        var _a;
        return (_a = this.options.timeout) !== null && _a !== void 0 ? _a : 0;
      };
      RequestMethodMetadata.prototype.getInterceptors = function () {
        var _a;
        return ((_a = this.options.interceptors) !== null && _a !== void 0 ? _a : []).concat(this.externalInterceptors);
      };
      RequestMethodMetadata.prototype.getExcludeInterceptors = function () {
        var _a;
        return (_a = this.options.excludeInterceptors) !== null && _a !== void 0 ? _a : [];
      };
      RequestMethodMetadata.prototype.getAdapter = function () {
        return this.options.adapter;
      };
      RequestMethodMetadata.prototype.isReactive = function () {
        var _a;
        return (_a = this.options.reactive) !== null && _a !== void 0 ? _a : true;
      };
      RequestMethodMetadata.prototype.appendInterceptor = function (interceptor) {
        this.externalInterceptors.push(interceptor);
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
        Reflect.defineMetadata(ENDPOINT_METADATA_KEY, metadata, target.prototype);
        buildEndpointClass(target, metadata);
        return metadata;
      };
      EndpointMetadata.fromInstance = function (target) {
        var prototype = Object.getPrototypeOf(target);
        var metadata = Reflect.getMetadata(ENDPOINT_METADATA_KEY, prototype);
        if (metadata instanceof EndpointMetadata) {
          return metadata;
        }
        return EndpointMetadata.from(prototype.constructor);
      };
      EndpointMetadata.prototype.setOptions = function (endpointOptions) {
        var _a, _b;
        if ('extends' in endpointOptions) {
          var parent_1 = EndpointMetadata.from(endpointOptions.extends);
          this.baseURL = (_a = endpointOptions.baseURL) !== null && _a !== void 0 ? _a : parent_1.baseURL;
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
        this.baseURL = joinPath(this.baseURL, (_b = endpointOptions.path) !== null && _b !== void 0 ? _b : '');
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
        return (_a = this.interceptors) !== null && _a !== void 0 ? _a : [];
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
      return function (target) {
        EndpointMetadata.from(target).setOptions(options);
      };
    }

    /* eslint-disable @typescript-eslint/no-explicit-any */
    function decorateEndpointMethod(decorator) {
      return function decorateMethod(target, context, descriptor) {
        if (typeof target === 'function' && typeof context === 'object') {
          var propertyKey_1 = context.name;
          context.addInitializer(function () {
            var clazz = this.constructor;
            var method = EndpointMetadata.from(clazz).getMethodMetadata(propertyKey_1);
            var descriptor = decorator(clazz, propertyKey_1, method);
            if (descriptor) {
              Reflect.set(this, propertyKey_1, descriptor.value);
            }
          });
        } else if (typeof target === 'object' && typeof context !== 'object' && typeof descriptor === 'object') {
          var propertyKey = context;
          var clazz = target.constructor;
          var method = EndpointMetadata.from(clazz).getMethodMetadata(propertyKey);
          var descriptor_1 = decorator(clazz, propertyKey, method);
          return descriptor_1;
        }
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
      return decorateEndpointMethod(function (clazz, methodName, methodMetadata) {
        methodMetadata.setOptions(options);
        return {
          value: delegator(Reflect.get(clazz.prototype, methodName), methodMetadata)
        };
      });
      function delegator(originFunction, methodMetadata) {
        return function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          var params = {
            method: methodMetadata.getHttpMethod(),
            headers: methodMetadata.getHeaders().clone(),
            pathVariables: {},
            queryParams: new URLSearchParams(),
            adapter: methodMetadata.getAdapter(),
            args: args
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
          return originFunction.apply(this, args);
        };
      }
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
      var metadata = EndpointMetadata.from(target).getMethodMetadata(methodName);
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
        appendExecHandler(target.constructor, methodName, function (instance, metadata, params, args) {
          var _a;
          var _b;
          var value = (_b = args[parameterIndex]) !== null && _b !== void 0 ? _b : defaultValue;
          if (value) {
            (_a = params.headers).append.apply(_a, __spreadArray([name], __read(Array.isArray(value) ? value : [value]), false));
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
        appendExecHandler(target.constructor, methodName, function (instance, metadata, params, args) {
          var value = args[parameterIndex];
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
        appendExecHandler(target.constructor, methodName, function (instance, metadata, params, args) {
          var _a;
          var value = (_a = args[parameterIndex]) !== null && _a !== void 0 ? _a : defaultValue;
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
    var SWRInstance = /** @class */function () {
      function SWRInstance(key, fetcher, options) {
        if (options === void 0) {
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
        return __awaiter(this, void 0, void 0, function () {
          var now, dedupingInterval, newData, err_1, error, retryContext, delay;
          var _this = this;
          var _a, _b, _c, _d, _e, _f;
          return __generator(this, function (_g) {
            switch (_g.label) {
              case 0:
                now = Date.now();
                dedupingInterval = (_a = this.config.dedupingInterval) !== null && _a !== void 0 ? _a : 2000;
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
                  if (((_c = (_b = this.config.retry).shouldRetryOnError) === null || _c === void 0 ? void 0 : _c.call(_b, retryContext)) !== false) {
                    this.currentRetryAttempt++;
                    delay = (_f = (_e = (_d = this.config.retry).calculateDelay) === null || _e === void 0 ? void 0 : _e.call(_d, this.currentRetryAttempt, error)) !== null && _f !== void 0 ? _f : this.config.retry.interval * Math.pow(2, this.currentRetryAttempt - 1);
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
        var _b = (_a = this.config.revalidate) !== null && _a !== void 0 ? _a : {},
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
        if (((_a = this.config.refresh) === null || _a === void 0 ? void 0 : _a.interval) && this.config.refresh.interval > 0) {
          this.refreshInterval = setInterval(function () {
            var _a, _b;
            if (document.hidden && !((_a = _this.config.refresh) === null || _a === void 0 ? void 0 : _a.whenHidden) || !navigator.onLine && !((_b = _this.config.refresh) === null || _b === void 0 ? void 0 : _b.whenOffline)) {
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

    var EXTRA_METADATA_SWR_CONFIG = Symbol('swr-config');
    var EXTRA_METADATA_MUTATE = Symbol('swr-mutate');
    var EXTRA_METADATA_SWR_KEYGEN = Symbol('swr-key-gen');

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
    function SWR(config) {
      if (config === void 0) {
        config = {};
      }
      return decorateEndpointMethod(function (clazz, methodName, methodMetadata) {
        methodMetadata.setExtra(EXTRA_METADATA_SWR_KEYGEN, config.key);
        methodMetadata.setExtra(EXTRA_METADATA_SWR_CONFIG, config);
      });
    }

    var SWRService = /** @class */function () {
      function SWRService() {
        this.instances = new Map();
      }
      SWRService.prototype.obtainInstance = function (key) {
        return this.instances.get(key);
      };
      SWRService.prototype.useSWR = function (keygen, fetcher, config) {
        var key = keygen();
        if (!this.instances.has(key)) {
          var instance = new SWRInstance(key, fetcher, config);
          this.instances.set(key, instance);
          return instance;
        } else {
          return this.instances.get(key);
        }
      };
      return SWRService;
    }();

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
      var _this = this;
      return decorateEndpointMethod(function (clazz, methodName, methodMetadata) {
        methodMetadata.setExtra(EXTRA_METADATA_MUTATE, true);
        methodMetadata.appendInterceptor({
          invoke: function (instance, method, params, next) {
            return __awaiter(_this, void 0, void 0, function () {
              var result, swrService, args, key, swrInstance;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    return [4 /*yield*/, next(instance, method, params)];
                  case 1:
                    result = _a.sent();
                    swrService = instance[APPLICATION_CONTEXT].getInstance(SWRService);
                    args = params.args;
                    key = function () {
                      if (typeof _keygen === 'string') {
                        return _keygen;
                      }
                      if (typeof _keygen === 'function') {
                        return _keygen.apply(void 0, __spreadArray([], __read(args), false));
                      }
                      return method.resolveURL(params);
                    }();
                    swrInstance = swrService.obtainInstance(key);
                    swrInstance === null || swrInstance === void 0 ? void 0 : swrInstance.mutate();
                    return [2 /*return*/, result];
                }
              });
            });
          }
        });
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function Key(key) {
      return function (target, propertyKey) {
        var methodName = typeof propertyKey === 'object' ? propertyKey.name : propertyKey;
        var methodMetadata = EndpointMetadata.from(target.constructor).getMethodMetadata(methodName);
        methodMetadata.setExtra(EXTRA_METADATA_SWR_KEYGEN, key);
      };
    }

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
        var _this = _super.call(this, 1) || this;
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
      __decorate([solidium.Signal(), __metadata("design:type", Array)], ResourceExecutionState.prototype, "messages", void 0);
      __decorate([solidium.Signal(), __metadata("design:type", Object)], ResourceExecutionState.prototype, "data", void 0);
      __decorate([solidium.Signal(), __metadata("design:type", Object)], ResourceExecutionState.prototype, "reason", void 0);
      __decorate([solidium.Signal(), __metadata("design:type", Number)], ResourceExecutionState.prototype, "status", void 0);
      __decorate([ioc.PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], ResourceExecutionState.prototype, "init", null);
      ResourceExecutionState = __decorate([ioc.Scope(ioc.InstanceScope.TRANSIENT), __metadata("design:paramtypes", [])], ResourceExecutionState);
      return ResourceExecutionState;
    }(rxjs.ReplaySubject);

    /**
     * @internal Symbol for executing the resource
     */
    var EXECUTE = Symbol('execute');
    /**
     * @internal Symbol for setting data
     */
    var SET_DATA = Symbol('setData');
    /**
     * @internal Symbol for setting error
     */
    var SET_ERROR = Symbol('setError');
    /**
     * @internal Symbol for setup
     */
    var SETUP = Symbol('setup');
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
    var Resource = /** @class */function () {
      function Resource() {
        this.$state = new rxjs.ReplaySubject(1);
        this.abortController = new AbortController();
      }
      Object.defineProperty(Resource.prototype, "data", {
        get: function () {
          var _a;
          return (_a = this.state) === null || _a === void 0 ? void 0 : _a.data;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Resource.prototype, "error", {
        get: function () {
          var _a;
          return (_a = this.state) === null || _a === void 0 ? void 0 : _a.reason;
        },
        enumerable: false,
        configurable: true
      });
      Object.defineProperty(Resource.prototype, "messages", {
        get: function () {
          var _a, _b;
          return (_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.messages) !== null && _b !== void 0 ? _b : [];
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
      Resource.prototype[SETUP] = function (context) {
        if (this.context) {
          throw new Error('Unknown Error: Cannot setup resource more than once');
        }
        this.context = context;
      };
      Resource.prototype.wait = function () {
        return rxjs.lastValueFrom(this.$state.pipe(rxjs.switchMap(function (state) {
          return state;
        }), rxjs.take(1)));
      };
      Resource.prototype.subscribe = function (observerOrNext) {
        return this.$state.subscribe(observerOrNext);
      };
      Resource.prototype.reload = function () {
        return __awaiter(this, arguments, void 0, function (force) {
          if (force === void 0) {
            force = false;
          }
          return __generator(this, function (_a) {
            if (this.context) {
              return [2 /*return*/, this[EXECUTE](force)];
            }
            return [2 /*return*/];
          });
        });
      };
      Resource.prototype[EXECUTE] = function (force, state) {
        var _this = this;
        var _a;
        if (force === void 0) {
          force = false;
        }
        if (state === void 0) {
          state = this.ioc.getInstance(ResourceExecutionState);
        }
        var context = this.context;
        if (!context) {
          throw new Error('Execution context is not setup!');
        }
        var lastExecutionAbortController = (_a = this.state) === null || _a === void 0 ? void 0 : _a.abortController;
        lastExecutionAbortController === null || lastExecutionAbortController === void 0 ? void 0 : lastExecutionAbortController.abort();
        this.$state.next(state);
        var instance = context.instance,
          method = context.method,
          params = context.params;
        // Add force parameter to the request params
        var requestParams = __assign(__assign({}, params), {
          force: force
        });
        state.status = exports.RequestStatus.LOADING;
        var signal = params.signal;
        if (signal) {
          signal = mergeAbortSignal(params.signal, this.abortController.signal);
        } else {
          signal = lastExecutionAbortController ? mergeAbortSignal(lastExecutionAbortController.signal, this.abortController.signal) : this.abortController.signal;
        }
        var allInterceptors = method.getAllInterceptors(instance);
        var sendRequest = allInterceptors.reduceRight(function (next, interceptor) {
          return function (instance, method, params) {
            return interceptor.invoke(instance, method, params, next);
          };
        }, function (instance, method, params) {
          return __awaiter(_this, void 0, void 0, function () {
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
                  return [2 /*return*/, response];
              }
            });
          });
        });
        sendRequest(instance, method, requestParams).then(function (response) {
          return _this.handleResponse(response, state);
        }).catch(function (error) {
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
                contentType = (_a = headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.join(', ');
                if (!isJSON(contentType)) return [3 /*break*/, 8];
                _b.label = 2;
              case 2:
                _b.trys.push([2, 6,, 7]);
                return [4 /*yield*/, __await(response.json())];
              case 3:
                return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
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
                return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
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
        return __awaiter(this, void 0, void 0, function () {
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
        return __awaiter(this, void 0, void 0, function () {
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
                contentType = (_g = headers.get('content-type')) === null || _g === void 0 ? void 0 : _g.join(', ');
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
      __decorate([solidium.Signal(), __metadata("design:type", ResourceExecutionState)], Resource.prototype, "state", void 0);
      __decorate([ioc.Inject(), __metadata("design:type", ioc.ApplicationContext)], Resource.prototype, "ioc", void 0);
      __decorate([ioc.PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], Resource.prototype, "init", null);
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
      resource[SETUP](context);
      var dispose = tracker.track(args, function (args) {
        var executionHandlers = methodMetadata.getExecutionHandlers();
        var instance = context.instance,
          method = context.method,
          params = context.params;
        executionHandlers.forEach(function (handler) {
          handler(instance, method, params, args);
        });
        resource[EXECUTE]();
        if (!isReactive) {
          Promise.resolve().then(function () {
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
    var RestfulResource = /** @class */function (_super) {
      __extends(RestfulResource, _super);
      function RestfulResource() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      RestfulResource.prototype[EXECUTE] = function (force) {
        var _this = this;
        var _a;
        if (force === void 0) {
          force = false;
        }
        var context = this.context;
        if (!context) {
          throw new Error('Execution context is not setup!');
        }
        var args = context.params.args;
        var methodMetadata = context.method.metadata;
        var _keygen = methodMetadata.getExtra(EXTRA_METADATA_SWR_KEYGEN);
        var mutate = (_a = methodMetadata.getExtra(EXTRA_METADATA_MUTATE)) !== null && _a !== void 0 ? _a : false;
        var swrConfig = methodMetadata.getExtra(EXTRA_METADATA_SWR_CONFIG);
        if (mutate && swrConfig) {
          throw new Error('@SWR and @SWRMutation cannot be used together');
        }
        if (!swrConfig) {
          var state = this.ioc.getInstance(ResourceExecutionState);
          return _super.prototype[EXECUTE].call(this, force, state);
        }
        var keygen = function () {
          if (typeof _keygen === 'string') {
            return _keygen;
          }
          if (typeof _keygen === 'function') {
            return _keygen.apply(void 0, __spreadArray([], __read(args), false));
          }
          return context.method.resolveURL(context.params);
        };
        var instance = this.swrService.useSWR(keygen, function () {
          var state = _this.ioc.getInstance(ResourceExecutionState);
          _super.prototype[EXECUTE].call(_this, force, state);
          return rxjs.lastValueFrom(state).then(function () {
            return state;
          });
        }, swrConfig);
        instance === null || instance === void 0 ? void 0 : instance.onStateChange(function (state) {
          _this.state = state.data;
        });
      };
      __decorate([ioc.Inject(), __metadata("design:type", SWRService)], RestfulResource.prototype, "swrService", void 0);
      RestfulResource = __decorate([ioc.Scope(ioc.InstanceScope.TRANSIENT)], RestfulResource);
      return RestfulResource;
    }(Resource);

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
    function restful() {
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
                contentType = (_a = headers.get('content-type')) === null || _a === void 0 ? void 0 : _a.join(', ');
                if (!isTextEventStream(contentType)) return [3 /*break*/, 4];
                return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(response.jsonStream())))];
              case 2:
                return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
              case 3:
                _b.sent();
                return [3 /*break*/, 7];
              case 4:
                return [5 /*yield**/, __values(__asyncDelegator(__asyncValues(_super.prototype.resolveResponseBody.call(this, response))))];
              case 5:
                return [4 /*yield*/, __await.apply(void 0, [_b.sent()])];
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
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this.progress = new Progress(0, 0);
        return _this;
      }
      ProgressiveResource.prototype.updateProgress = function (progress) {
        this.progress = progress;
      };
      __decorate([solidium.Signal(), __metadata("design:type", Progress)], ProgressiveResource.prototype, "progress", void 0);
      return ProgressiveResource;
    }(Resource);

    var DownloadResource = /** @class */function (_super) {
      __extends(DownloadResource, _super);
      function DownloadResource() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      DownloadResource.prototype.handleResponse = function (response, state) {
        return __awaiter(this, void 0, void 0, function () {
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
      __decorate([solidium.Signal(), __metadata("design:type", Progress)], DownloadResource.prototype, "progress", void 0);
      DownloadResource = __decorate([ioc.Scope(ioc.InstanceScope.TRANSIENT)], DownloadResource);
      return DownloadResource;
    }(ProgressiveResource);

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
        var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
        _this.progress = new Progress(0, 0);
        return _this;
      }
      UploadResource.prototype.updateProgress = function (progress) {
        this.progress = progress;
      };
      UploadResource.prototype.handleResponse = function (response, state) {
        return __awaiter(this, void 0, void 0, function () {
          var _this = this;
          return __generator(this, function (_a) {
            response.onUpload(function (progress) {
              _this.updateProgress(progress);
            });
            return [2 /*return*/, _super.prototype.handleResponse.call(this, response, state)];
          });
        });
      };
      __decorate([solidium.Signal(), __metadata("design:type", Progress)], UploadResource.prototype, "progress", void 0);
      return UploadResource;
    }(ProgressiveResource);

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
    function upload() {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
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
    function createTimeBasedPolicy(ttl, name) {
      if (name === void 0) {
        name = "TimeBasedPolicy(".concat(ttl, "ms)");
      }
      return {
        name: name,
        shouldCache: function () {
          return true;
        },
        getTTL: function () {
          return ttl;
        },
        isValid: function (entry) {
          return entry.expiresAt > Date.now();
        }
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
    var CachePolicies = {
      /**
       * No caching policy - all requests bypass the cache.
       *
       * Use this when you need to ensure data is always fresh,
       * or to disable caching for specific endpoints.
       */
      NoCache: {
        name: 'NoCache',
        shouldCache: function () {
          return false;
        },
        getTTL: function () {
          return 0;
        },
        isValid: function () {
          return false;
        }
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
      createTimeBasedPolicy: createTimeBasedPolicy
    };

    var DEFAULT_CACHE_CONFIG = {
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
    var CacheInterceptor = /** @class */function () {
      function CacheInterceptor(config) {
        if (config === void 0) {
          config = {};
        }
        this.config = __assign(__assign({}, DEFAULT_CACHE_CONFIG), config);
      }
      CacheInterceptor.createWithConfig = function (config) {
        if (config === void 0) {
          config = {};
        }
        var SubCacheInterceptor = /** @class */function (_super) {
          __extends(SubCacheInterceptor, _super);
          function SubCacheInterceptor() {
            return _super.call(this, config) || this;
          }
          return SubCacheInterceptor;
        }(CacheInterceptor);
        return SubCacheInterceptor;
      };
      Object.defineProperty(CacheInterceptor.prototype, "policy", {
        get: function () {
          var _a;
          return (_a = this.config.policy) !== null && _a !== void 0 ? _a : CachePolicies.Default;
        },
        enumerable: false,
        configurable: true
      });
      CacheInterceptor.prototype.getBucket = function () {
        return __awaiter(this, void 0, void 0, function () {
          var bucketName;
          var _a, _b;
          return __generator(this, function (_c) {
            if (this.bucket) {
              return [2 /*return*/, this.bucket];
            }
            bucketName = (_a = this.config.bucketName) !== null && _a !== void 0 ? _a : (_b = this.httpConfig) === null || _b === void 0 ? void 0 : _b.cacheBucket;
            if (bucketName) {
              try {
                this.bucket = this.appCtx.getInstance(bucketName);
                return [2 /*return*/, this.bucket];
              } catch (_d) {
                // Bucket not found, fall back to default
              }
            }
            this.bucket = this.appCtx.getInstance(persistence.DEFAULT_BUCKET);
            return [2 /*return*/, this.bucket];
          });
        });
      };
      CacheInterceptor.prototype.generateCacheKey = function (method, params) {
        if (this.config.generateKey) {
          return this.config.generateKey(method, params);
        }
        // Default cache key generation
        var url = method.resolveURL(params);
        return "http-cache:".concat(url);
      };
      CacheInterceptor.prototype.shouldCache = function (method, params) {
        if (params.force) {
          return false;
        }
        if (this.config.shouldCache) {
          return this.config.shouldCache(method, params);
        }
        return this.policy.shouldCache(method, params);
      };
      CacheInterceptor.prototype.getExpirationFromHeaders = function (headers) {
        if (!this.config.respectCacheControl) {
          return null;
        }
        var cacheControl = headers.get('cache-control');
        if (!cacheControl) {
          return null;
        }
        // Parse Cache-Control header
        var directives = cacheControl.map(function (d) {
          return d.trim();
        });
        // Check for no-cache or no-store directives
        if (directives.includes('no-cache') || directives.includes('no-store')) {
          return 0; // Don't cache
        }
        // Check for max-age directive
        var maxAgeDirective = directives.find(function (d) {
          return d.startsWith('max-age=');
        });
        if (maxAgeDirective) {
          var maxAge = parseInt(maxAgeDirective.split('=')[1], 10);
          if (!isNaN(maxAge)) {
            return Date.now() + maxAge * 1000;
          }
        }
        return null;
      };
      CacheInterceptor.prototype.invoke = function (instance, method, params, next) {
        return __awaiter(this, void 0, void 0, function () {
          var cacheKey, bucket, cachedEntry, response_1, headers, response, status;
          var _this = this;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                // Skip caching for non-cacheable methods or when force=true
                if (!this.shouldCache(method, params)) {
                  return [2 /*return*/, next(instance, method, params)];
                }
                cacheKey = this.generateCacheKey(method, params);
                return [4 /*yield*/, this.getBucket()];
              case 1:
                bucket = _a.sent();
                return [4 /*yield*/, bucket.getItem(cacheKey)];
              case 2:
                cachedEntry = _a.sent();
                if (cachedEntry && this.policy.isValid(cachedEntry, method, params)) {
                  response_1 = cachedEntry.response;
                  headers = new HttpHeaders(response_1.headers);
                  // Create a new HttpResponse from the cached data
                  return [2 /*return*/, HttpResponse.of(Promise.resolve(new BlobByteStream(new Blob([response_1.body]))), headers, response_1.status, method)];
                }
                return [4 /*yield*/, next(instance, method, params)];
              case 3:
                response = _a.sent();
                return [4 /*yield*/, response.status()];
              case 4:
                status = _a.sent();
                if (status >= 200 && status < 300) {
                  response.onBodyComplete(function (body) {
                    return __awaiter(_this, void 0, void 0, function () {
                      var headers, bodyArrayBuffer, headerExpiration, ttl, expiresAt, cacheEntry, overrideEntry;
                      var _a, _b, _c;
                      return __generator(this, function (_d) {
                        switch (_d.label) {
                          case 0:
                            return [4 /*yield*/, response.headers()];
                          case 1:
                            headers = _d.sent();
                            return [4 /*yield*/, body.readAsBuffer()];
                          case 2:
                            bodyArrayBuffer = _d.sent();
                            headerExpiration = this.getExpirationFromHeaders(headers);
                            ttl = this.policy.getTTL(method, params);
                            expiresAt = headerExpiration !== null && headerExpiration !== void 0 ? headerExpiration : ttl === 0 ? 0 : Date.now() + ttl;
                            if (!(expiresAt > 0)) return [3 /*break*/, 4];
                            cacheEntry = {
                              response: {
                                status: status,
                                headers: headers.toJSON(),
                                body: new Uint8Array(bodyArrayBuffer)
                              },
                              cachedAt: Date.now(),
                              expiresAt: expiresAt,
                              metadata: {}
                            };
                            overrideEntry = (_c = (_b = (_a = this.policy).overrideCacheEntry) === null || _b === void 0 ? void 0 : _b.call(_a, cacheEntry, method, params)) !== null && _c !== void 0 ? _c : cacheEntry;
                            // Store in cache
                            return [4 /*yield*/, bucket.setItem(cacheKey, overrideEntry)];
                          case 3:
                            // Store in cache
                            _d.sent();
                            _d.label = 4;
                          case 4:
                            return [2 /*return*/];
                        }
                      });
                    });
                  });
                }
                return [2 /*return*/, response];
            }
          });
        });
      };
      __decorate([ioc.Inject(), __metadata("design:type", ioc.ApplicationContext)], CacheInterceptor.prototype, "appCtx", void 0);
      __decorate([ioc.Inject(DEFAULT_HTTP_CONFIGURATION), __metadata("design:type", Object)], CacheInterceptor.prototype, "httpConfig", void 0);
      return CacheInterceptor;
    }();

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
    function Cache(config) {
      if (config === void 0) {
        config = DEFAULT_CACHE_CONFIG;
      }
      return decorateEndpointMethod(function (clazz, methodName, methodMetadata) {
        methodMetadata.appendInterceptor(CacheInterceptor.createWithConfig(config));
      });
    }

    exports.AbortError = AbortError;
    exports.BadGatewayError = BadGatewayError;
    exports.BadRequestError = BadRequestError;
    exports.Cache = Cache;
    exports.CacheInterceptor = CacheInterceptor;
    exports.CachePolicies = CachePolicies;
    exports.CancellationError = CancellationError;
    exports.CircuitBreakerError = CircuitBreakerError;
    exports.CircuitBreakerInterceptor = CircuitBreakerInterceptor;
    exports.ConflictError = ConflictError;
    exports.DEFAULT_CACHE_CONFIG = DEFAULT_CACHE_CONFIG;
    exports.DEFAULT_HTTP_CONFIGURATION = DEFAULT_HTTP_CONFIGURATION;
    exports.Defer = Defer;
    exports.Delete = Delete;
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
    exports.Http = Http;
    exports.HttpError = HttpError;
    exports.HttpHeaders = HttpHeaders;
    exports.HttpResponse = HttpResponse;
    exports.HttpStatusError = HttpStatusError;
    exports.ImATeapotError = ImATeapotError;
    exports.InsufficientStorageError = InsufficientStorageError;
    exports.InternalServerError = InternalServerError;
    exports.Key = Key;
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
    exports.Put = Put;
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
    exports.SETUP = SETUP;
    exports.SET_DATA = SET_DATA;
    exports.SET_ERROR = SET_ERROR;
    exports.SWR = SWR;
    exports.SWRInstance = SWRInstance;
    exports.SWRMutation = SWRMutation;
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
    exports.buildEndpointClass = buildEndpointClass;
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
    exports.restful = restful;
    exports.upload = upload;

}));
//# sourceMappingURL=index.umd.js.map
