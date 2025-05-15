(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@vgerbot/ioc'), require('@vgerbot/solidium'), require('solid-js'), require('@vgerbot/msgpack-ext'), require('idb')) :
    typeof define === 'function' && define.amd ? define(['exports', '@vgerbot/ioc', '@vgerbot/solidium', 'solid-js', '@vgerbot/msgpack-ext', 'idb'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.SolidiumPersistence = {}, global.IOC, global.Solidium, global.solidJs, global.MPext, global.idb));
})(this, (function (exports, ioc, solidium, solidJs, msgpackExt, idb) { 'use strict';

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

    var DEFAULT_BUCKET_CONFIGURATION = Symbol('solidium-default-bucket-configuration');
    var DEFAULT_BUCKET = Symbol('solidium-default-bucket');

    var STORAGE_LOAD_EVENTS = Symbol();
    function notifyStorageLoad(event) {
      var _a;
      var prototype = Object.getPrototypeOf(event.instance);
      var events = (_a = Reflect.getMetadata(STORAGE_LOAD_EVENTS, prototype)) !== null && _a !== undefined ? _a : [];
      events.forEach(function (handle) {
        handle.call(event.instance, event);
      });
    }
    function OnStorageLoad(options) {
      return function (target, propertyKey) {
        var _a;
        var events = (_a = Reflect.getMetadata(STORAGE_LOAD_EVENTS, target)) !== null && _a !== undefined ? _a : [];
        Reflect.defineMetadata(STORAGE_LOAD_EVENTS, events, target);
        var loadedMembers = new Set();
        events.push(function listener(event) {
          loadedMembers.add(event.member);
          if ((options === null || options === undefined ? undefined : options.members) && !options.members.includes(event.member)) {
            return;
          }
          var method = Reflect.get(this, propertyKey);
          method.call(this, __assign(__assign({}, event), {
            loadedMembers: new Set(loadedMembers)
          }));
          if (options === null || options === undefined ? undefined : options.members) {
            var isAllHandled = loadedMembers.isSupersetOf(new Set(options.members));
            if (isAllHandled) {
              var index = events.indexOf(listener);
              if (index === -1) {
                return;
              }
              var newEvents = events.slice(0).splice(index, 1);
              Reflect.defineMetadata(STORAGE_LOAD_EVENTS, newEvents, target);
            }
          }
        });
      };
    }

    var ActionType;
    (function (ActionType) {
      ActionType[ActionType["UPDATE"] = 0] = "UPDATE";
      ActionType[ActionType["REMOVE"] = 1] = "REMOVE";
    })(ActionType || (ActionType = {}));

    var ChangeBy;
    (function (ChangeBy) {
      ChangeBy[ChangeBy["SELF"] = 0] = "SELF";
      ChangeBy[ChangeBy["OTHER"] = 1] = "OTHER";
    })(ChangeBy || (ChangeBy = {}));

    var Storage = function (options) {
      if (options === undefined) {
        options = {};
      }
      return solidium.defineMemberDecoratorProcessor('storage', {
        afterInstantiation: function (instance, member, metadata, container) {
          var _a;
          var _b = solidium.getSignal(instance, member),
            set = _b[1];
          var key = (_a = options.key) !== null && _a !== undefined ? _a : member.toString();
          var bucketOrName = options.bucket || DEFAULT_BUCKET;
          var bucket = typeof bucketOrName != 'object' ? container.getInstance(bucketOrName) : bucketOrName;
          var observe = function () {
            return bucket.observe(key, function (event) {
              if (bucket.debug) {
                console.debug("[Storage] ".concat(ActionType[event.action], " ").concat(JSON.stringify({
                  action: ActionType[event.action],
                  changeBy: ChangeBy[event.changeBy],
                  key: event.key,
                  bucketName: event.target.name,
                  newValue: event.newValue,
                  originValue: event.originValue
                })));
              }
              set(event.newValue);
            });
          };
          if (bucket.debug) {
            console.debug("[Storage] ".concat(key, " is loaded from ").concat(bucket.name));
          }
          var owner = solidJs.getOwner();
          bucket.getItem(key).then(function (value) {
            if (bucket.debug) {
              console.debug("[Storage] ".concat(key, " is loaded, value: ").concat(value));
            }
            set(value);
            notifyStorageLoad({
              instance: instance,
              member: member,
              value: value,
              timestamp: Date.now()
            });
            solidJs.runWithOwner(owner, function () {
              var unobserve = observe();
              solidJs.createEffect(solidJs.on(function () {
                return instance[member];
              }, function (newValue) {
                unobserve();
                if (bucket.debug) {
                  console.debug("[Storage] ".concat(instance.constructor.name, ".").concat(member.toString(), " \n                                        changed to ").concat(newValue).replace(/\s+/g, ' '));
                }
                bucket.setItem(key, newValue).finally(function () {
                  unobserve = observe();
                });
              }));
              solidJs.onCleanup(function () {
                unobserve();
              });
            });
          });
        }
      });
    };

    exports.DefaultDrivers = void 0;
    (function (DefaultDrivers) {
      DefaultDrivers["LOCAL_STORAGE"] = "localStorage";
      DefaultDrivers["SESSION_STORAGE"] = "sessionStorage";
      DefaultDrivers["INDEXED_DB"] = "indexedDB";
    })(exports.DefaultDrivers || (exports.DefaultDrivers = {}));

    function createBlob(parts, options) {
      return new Blob(parts, options);
    }
    function createPlainTextBlob() {
      var parts = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
      }
      return createBlob(parts, {
        type: 'text/plain'
      });
    }

    var BrowserStorageDriver = /** @class */function () {
      function BrowserStorageDriver(options, storage) {
        this.options = options;
        this.storage = storage;
        this.observers = new Map();
      }
      BrowserStorageDriver.prototype.getKeyPrefix = function () {
        return this.options.bucketName;
      };
      BrowserStorageDriver.prototype.normalizeKey = function (key) {
        return "".concat(this.getKeyPrefix(), ".").concat(key.replace(/\./g, '_'));
      };
      BrowserStorageDriver.prototype.prepare = function () {
        var _this = this;
        var storageEventListener = function (event) {
          var key = event.key,
            newValue = event.newValue,
            oldValue = event.oldValue;
          if (key === null) {
            return;
          }
          var newValueBlob = newValue ? createPlainTextBlob(newValue) : undefined;
          var oldValueBlob = oldValue ? createPlainTextBlob(oldValue) : undefined;
          _this.dispatchChangeEvent(ChangeBy.OTHER, ActionType.UPDATE, key, newValueBlob, oldValueBlob);
        };
        window.addEventListener('storage', storageEventListener);
        return Promise.resolve();
      };
      BrowserStorageDriver.prototype.supports = function () {
        return Promise.resolve(typeof this.storage !== 'undefined');
      };
      BrowserStorageDriver.prototype.iterate = function () {
        return __asyncGenerator(this, arguments, function iterate_1() {
          var len, prefix, regex, i, key, value;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                len = this.storage.length;
                prefix = this.getKeyPrefix();
                regex = new RegExp('^' + prefix + '.');
                i = 0;
                _a.label = 1;
              case 1:
                if (!(i < len)) return [3 /*break*/, 5];
                key = this.storage.key(i);
                if (!(key === null || key === undefined ? undefined : key.match(regex))) {
                  return [3 /*break*/, 4];
                }
                value = this.storage.getItem(key);
                if (!value) {
                  return [3 /*break*/, 4];
                }
                return [4 /*yield*/, __await({
                  key: key,
                  value: createBlob([value], {})
                })];
              case 2:
                return [4 /*yield*/, _a.sent()];
              case 3:
                _a.sent();
                _a.label = 4;
              case 4:
                i++;
                return [3 /*break*/, 1];
              case 5:
                return [2 /*return*/];
            }
          });
        });
      };
      BrowserStorageDriver.prototype.getItem = function (key) {
        var normalizedKey = this.normalizeKey(key);
        return Promise.resolve(this.getItemByNormalizedKey(normalizedKey));
      };
      BrowserStorageDriver.prototype.getItemByNormalizedKey = function (key) {
        var value = this.storage.getItem(key);
        if (!value) {
          return;
        }
        return this.deserialize(value);
      };
      BrowserStorageDriver.prototype.removeItem = function (key) {
        var normalizedKey = this.normalizeKey(key);
        var oldValue;
        var needDispatch = this.needDispatch(key);
        if (needDispatch) {
          oldValue = this.getItemByNormalizedKey(normalizedKey);
        }
        this.storage.removeItem(normalizedKey);
        if (needDispatch) {
          this.dispatchChangeEvent(ChangeBy.SELF, ActionType.REMOVE, key, undefined, oldValue);
        }
        return Promise.resolve();
      };
      BrowserStorageDriver.prototype.setItem = function (key, value) {
        return __awaiter(this, undefined, undefined, function () {
          var normalizeKey, needDispatch, oldValue, serialized;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                normalizeKey = this.normalizeKey(key);
                needDispatch = this.needDispatch(key);
                if (needDispatch) {
                  oldValue = this.getItemByNormalizedKey(normalizeKey);
                }
                return [4 /*yield*/, this.serialize(value)];
              case 1:
                serialized = _a.sent();
                this.storage.setItem(normalizeKey, serialized);
                if (needDispatch) {
                  this.dispatchChangeEvent(ChangeBy.SELF, ActionType.UPDATE, key, value, oldValue);
                }
                return [2 /*return*/];
            }
          });
        });
      };
      BrowserStorageDriver.prototype.length = function () {
        return __awaiter(this, undefined, undefined, function () {
          var len, _a, _b, _c, e_1_1;
          var _d, e_1, _e;
          return __generator(this, function (_g) {
            switch (_g.label) {
              case 0:
                len = 0;
                _g.label = 1;
              case 1:
                _g.trys.push([1, 6, 7, 12]);
                _a = true, _b = __asyncValues(this.keys());
                _g.label = 2;
              case 2:
                return [4 /*yield*/, _b.next()];
              case 3:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                _c.value;
                _a = false;
                len++;
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
                return [2 /*return*/, len];
            }
          });
        });
      };
      BrowserStorageDriver.prototype.keyAt = function (index) {
        return __awaiter(this, undefined, undefined, function () {
          var i, _a, _b, _c, key, e_2_1;
          var _d, e_2, _e, _f;
          return __generator(this, function (_g) {
            switch (_g.label) {
              case 0:
                i = 0;
                _g.label = 1;
              case 1:
                _g.trys.push([1, 6, 7, 12]);
                _a = true, _b = __asyncValues(this.keys());
                _g.label = 2;
              case 2:
                return [4 /*yield*/, _b.next()];
              case 3:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                _f = _c.value;
                _a = false;
                key = _f;
                if (i === index) {
                  return [2 /*return*/, key];
                }
                i++;
                _g.label = 4;
              case 4:
                _a = true;
                return [3 /*break*/, 2];
              case 5:
                return [3 /*break*/, 12];
              case 6:
                e_2_1 = _g.sent();
                e_2 = {
                  error: e_2_1
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
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
              case 11:
                return [7 /*endfinally*/];
              case 12:
                return [2 /*return*/];
            }
          });
        });
      };
      BrowserStorageDriver.prototype.deserialize = function (str) {
        var _a = JSON.parse(str),
          type = _a.type,
          text = _a.text,
          hexData = _a.hex;
        if (text) {
          return createBlob([text], {
            type: type
          });
        }
        var u8a = new Uint8Array(hexData.length / 2);
        var view = new DataView(u8a.buffer);
        for (var i = 0; i < hexData.length; i += 2) {
          var hex = hexData.substring(i, i + 2);
          view.setUint8(i / 2, parseInt(hex, 16));
        }
        return createBlob([u8a], {
          type: type
        });
      };
      BrowserStorageDriver.prototype.serialize = function (blob) {
        return __awaiter(this, undefined, undefined, function () {
          var text, buffer, u8a, hexArray, i, hex;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                if (!(blob.type.indexOf('text/') > -1)) return [3 /*break*/, 2];
                return [4 /*yield*/, blob.text()];
              case 1:
                text = _a.sent();
                return [2 /*return*/, JSON.stringify({
                  type: blob.type,
                  text: text
                })];
              case 2:
                return [4 /*yield*/, blob.arrayBuffer()];
              case 3:
                buffer = _a.sent();
                u8a = new Uint8Array(buffer);
                hexArray = new Array(u8a.length);
                for (i = 0; i < u8a.length; i++) {
                  hexArray[i] = u8a[i].toString(16).padStart(2, '0');
                }
                hex = hexArray.join('');
                return [2 /*return*/, JSON.stringify({
                  type: blob.type,
                  hex: hex
                })];
            }
          });
        });
      };
      BrowserStorageDriver.prototype.needDispatch = function (key) {
        var _a;
        return !!((_a = this.observers.get(key)) === null || _a === undefined ? undefined : _a.length);
      };
      BrowserStorageDriver.prototype.dispatchChangeEvent = function (changeBy, actionType, key, newValue, oldValue) {
        var _this = this;
        var listeners = this.observers.get(key);
        listeners === null || listeners === undefined ? undefined : listeners.forEach(function (listener) {
          listener({
            target: _this,
            key: key,
            changeBy: changeBy,
            action: actionType,
            newValue: newValue,
            originValue: oldValue
          });
        });
      };
      BrowserStorageDriver.prototype.keys = function () {
        return __asyncGenerator(this, arguments, function keys_1() {
          var len, prefix, i, key;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                len = this.storage.length;
                prefix = this.getKeyPrefix();
                i = 0;
                _a.label = 1;
              case 1:
                if (!(i < len)) return [3 /*break*/, 5];
                key = this.storage.key(i);
                if (!((key === null || key === undefined ? undefined : key.indexOf(prefix)) === 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, __await(key)];
              case 2:
                return [4 /*yield*/, _a.sent()];
              case 3:
                _a.sent();
                _a.label = 4;
              case 4:
                i++;
                return [3 /*break*/, 1];
              case 5:
                return [2 /*return*/];
            }
          });
        });
      };
      BrowserStorageDriver.prototype.clear = function () {
        return __awaiter(this, undefined, undefined, function () {
          var _a, _b, _c, key, e_3_1;
          var _d, e_3, _e, _f;
          return __generator(this, function (_g) {
            switch (_g.label) {
              case 0:
                _g.trys.push([0, 5, 6, 11]);
                _a = true, _b = __asyncValues(this.keys());
                _g.label = 1;
              case 1:
                return [4 /*yield*/, _b.next()];
              case 2:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 4];
                _f = _c.value;
                _a = false;
                key = _f;
                this.storage.removeItem(key);
                _g.label = 3;
              case 3:
                _a = true;
                return [3 /*break*/, 1];
              case 4:
                return [3 /*break*/, 11];
              case 5:
                e_3_1 = _g.sent();
                e_3 = {
                  error: e_3_1
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
                if (e_3) throw e_3.error;
                return [7 /*endfinally*/];
              case 10:
                return [7 /*endfinally*/];
              case 11:
                return [2 /*return*/];
            }
          });
        });
      };
      BrowserStorageDriver.prototype.observe = function (key, onChange) {
        var changeListener = onChange.bind(this);
        var listeners = this.observers.get(key) || [];
        listeners.push(changeListener);
        this.observers.set(key, listeners);
        return function () {
          var index = listeners.indexOf(changeListener);
          if (index === -1) {
            return;
          }
          listeners.splice(index, 1);
        };
      };
      return BrowserStorageDriver;
    }();

    var LocalStorageDriver = /** @class */function (_super) {
      __extends(LocalStorageDriver, _super);
      function LocalStorageDriver(options) {
        var _this = _super.call(this, options, window.localStorage) || this;
        _this.name = 'LocalStorageDriver';
        return _this;
      }
      LocalStorageDriver.createInstance = function (bucketName) {
        return new LocalStorageDriver({
          bucketName: bucketName
        });
      };
      return LocalStorageDriver;
    }(BrowserStorageDriver);

    var DefaultSerializer = /** @class */function () {
      function DefaultSerializer() {}
      DefaultSerializer.prototype.serialize = function (value) {
        var u8a = msgpackExt.encode(value);
        return Promise.resolve(new Blob([u8a]));
      };
      DefaultSerializer.prototype.deserialize = function (data) {
        return __awaiter(this, undefined, undefined, function () {
          var buffer;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, data.arrayBuffer()];
              case 1:
                buffer = _a.sent();
                return [2 /*return*/, msgpackExt.decode(buffer)];
            }
          });
        });
      };
      return DefaultSerializer;
    }();

    var SessionStorageDriver = /** @class */function (_super) {
      __extends(SessionStorageDriver, _super);
      function SessionStorageDriver(options) {
        var _this = _super.call(this, options, window.localStorage) || this;
        _this.name = 'SessionStorageDriver';
        return _this;
      }
      SessionStorageDriver.createInstance = function (bucketName) {
        return new SessionStorageDriver({
          bucketName: bucketName
        });
      };
      return SessionStorageDriver;
    }(BrowserStorageDriver);

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

    var STORE_NAME = 'keyval';
    var IndexedDBStorageDriver = /** @class */function () {
      function IndexedDBStorageDriver(options) {
        this.name = 'IndexedDBStorageDriver';
        this.observers = new Map();
        this.idbDefer = new Defer();
        this.bucketName = options.bucketName;
        this.version = options.version;
      }
      Object.defineProperty(IndexedDBStorageDriver.prototype, "idbPromise", {
        get: function () {
          return this.idbDefer.promise;
        },
        enumerable: false,
        configurable: true
      });
      IndexedDBStorageDriver.prototype.prepare = function () {
        return __awaiter(this, undefined, undefined, function () {
          var idb$1;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, idb.openDB(this.bucketName, this.version, {
                  upgrade: function (db) {
                    db.createObjectStore(STORE_NAME);
                  }
                })];
              case 1:
                idb$1 = _a.sent();
                this.idbDefer.resolve(idb$1);
                return [2 /*return*/];
            }
          });
        });
      };
      IndexedDBStorageDriver.prototype.supports = function () {
        return __awaiter(this, undefined, undefined, function () {
          var checkDBName;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                _b.trys.push([0, 3,, 4]);
                checkDBName = '_vgerbot_check_idb';
                return [4 /*yield*/, idb.openDB(checkDBName)];
              case 1:
                _b.sent();
                return [4 /*yield*/, idb.deleteDB(checkDBName)];
              case 2:
                _b.sent();
                return [2 /*return*/, true];
              case 3:
                _b.sent();
                return [2 /*return*/, false];
              case 4:
                return [2 /*return*/];
            }
          });
        });
      };
      IndexedDBStorageDriver.prototype.getItem = function (key) {
        return __awaiter(this, undefined, undefined, function () {
          var db, value;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.idbPromise];
              case 1:
                db = _a.sent();
                return [4 /*yield*/, db.get(STORE_NAME, IDBKeyRange.only(key))];
              case 2:
                value = _a.sent();
                if (!value) {
                  return [2 /*return*/];
                }
                return [2 /*return*/, createBlob([value], {})];
            }
          });
        });
      };
      IndexedDBStorageDriver.prototype.removeItem = function (key) {
        return __awaiter(this, undefined, undefined, function () {
          var db, needDispatch, oldValue, _a;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                return [4 /*yield*/, this.idbPromise];
              case 1:
                db = _b.sent();
                needDispatch = this.needDispatch(key);
                if (!needDispatch) return [3 /*break*/, 3];
                return [4 /*yield*/, this.getItem(key)];
              case 2:
                _a = _b.sent();
                return [3 /*break*/, 4];
              case 3:
                _a = undefined;
                _b.label = 4;
              case 4:
                oldValue = _a;
                return [4 /*yield*/, db.delete(STORE_NAME, IDBKeyRange.only(key))];
              case 5:
                _b.sent();
                if (needDispatch) {
                  this.dispatchChangeEvent(key, ActionType.REMOVE, undefined, oldValue);
                }
                return [2 /*return*/];
            }
          });
        });
      };
      IndexedDBStorageDriver.prototype.setItem = function (key, value) {
        return __awaiter(this, undefined, undefined, function () {
          var db, buffer, needDispatch, oldValue, _a;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                return [4 /*yield*/, this.idbPromise];
              case 1:
                db = _b.sent();
                return [4 /*yield*/, value.arrayBuffer()];
              case 2:
                buffer = _b.sent();
                needDispatch = this.needDispatch(key);
                if (!needDispatch) return [3 /*break*/, 4];
                return [4 /*yield*/, this.getItem(key)];
              case 3:
                _a = _b.sent();
                return [3 /*break*/, 5];
              case 4:
                _a = undefined;
                _b.label = 5;
              case 5:
                oldValue = _a;
                return [4 /*yield*/, db.put(STORE_NAME, buffer, IDBKeyRange.only(key))];
              case 6:
                _b.sent();
                if (needDispatch) {
                  this.dispatchChangeEvent(key, ActionType.UPDATE, value, oldValue);
                }
                return [2 /*return*/];
            }
          });
        });
      };
      IndexedDBStorageDriver.prototype.clear = function () {
        return __awaiter(this, undefined, undefined, function () {
          var db;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.idbPromise];
              case 1:
                db = _a.sent();
                return [4 /*yield*/, db.clear(STORE_NAME)];
              case 2:
                _a.sent();
                return [2 /*return*/];
            }
          });
        });
      };
      IndexedDBStorageDriver.prototype.observe = function (key, onChange) {
        var changeListener = onChange.bind(this);
        var listeners = this.observers.get(key) || [];
        listeners.push(changeListener);
        this.observers.set(key, listeners);
        return function () {
          var index = listeners.indexOf(changeListener);
          if (index === -1) {
            return;
          }
          listeners.splice(index, 1);
        };
      };
      IndexedDBStorageDriver.prototype.dispatchChangeEvent = function (key, action, newValue, originValue) {
        var _this = this;
        var listeners = this.observers.get(key);
        if (!listeners || listeners.length === 0) {
          return;
        }
        listeners.forEach(function (listener) {
          listener({
            target: _this,
            key: key,
            action: action,
            newValue: newValue,
            originValue: originValue,
            changeBy: ChangeBy.SELF
          });
        });
      };
      IndexedDBStorageDriver.prototype.needDispatch = function (key) {
        var _a;
        return !!((_a = this.observers.get(key)) === null || _a === undefined ? undefined : _a.length);
      };
      return IndexedDBStorageDriver;
    }();

    var PREPARE = Symbol('prepare');
    function Prepared() {
      return function (target, propertyKey, descriptor) {
        var origin = descriptor.value;
        if (!origin) {
          return;
        }
        var prepare_promise;
        descriptor.value = function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return __awaiter(this, undefined, undefined, function () {
            var _this = this;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  if (!prepare_promise) {
                    prepare_promise = this[PREPARE]().finally(function () {
                      descriptor.value = origin;
                      Object.defineProperty(_this, propertyKey, descriptor);
                    });
                  }
                  return [4 /*yield*/, prepare_promise];
                case 1:
                  _a.sent();
                  return [2 /*return*/, origin.apply(this, args)];
              }
            });
          });
        };
        Object.defineProperty(target, propertyKey, descriptor);
      };
    }
    var Bucket = /** @class */function () {
      function Bucket(config) {
        var _a, _b;
        this.name = (_a = config.name) !== null && _a !== undefined ? _a : '';
        this.serializer = config.serializer || new DefaultSerializer();
        this.debug = (_b = config.debug) !== null && _b !== undefined ? _b : false;
        var driver = config.driver;
        if (driver === exports.DefaultDrivers.LOCAL_STORAGE) {
          this.driver = LocalStorageDriver.createInstance(this.name);
        } else if (driver === exports.DefaultDrivers.INDEXED_DB) {
          this.driver = new IndexedDBStorageDriver({
            bucketName: this.name,
            version: config.version
          });
        } else if (driver === exports.DefaultDrivers.SESSION_STORAGE) {
          this.driver = SessionStorageDriver.createInstance(this.name);
        } else {
          this.driver = driver || LocalStorageDriver.createInstance(this.name);
        }
      }
      Bucket.prototype[PREPARE] = function () {
        return __awaiter(this, undefined, undefined, function () {
          var supports;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.driver.supports()];
              case 1:
                supports = _a.sent();
                if (!supports) {
                  throw new Error("Your current browser does not support this storage driver: ".concat(this.driver.name, "!"));
                }
                return [2 /*return*/, this.driver.prepare()];
            }
          });
        });
      };
      Bucket.prototype.prepared = function () {
        return __awaiter(this, undefined, undefined, function () {
          return __generator(this, function (_a) {
            return [2 /*return*/, undefined];
          });
        });
      };
      Bucket.prototype.observe = function (key, onChange) {
        var _this = this;
        var preparePromise = this.prepared();
        var unobserve = this.driver.observe(key, function (event) {
          return onChange(__assign(__assign({}, event), {
            target: _this
          }));
        });
        return function () {
          preparePromise.then(unobserve);
        };
      };
      Bucket.prototype.setItem = function (key, value) {
        return __awaiter(this, undefined, undefined, function () {
          var blob;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.serializer.serialize(value)];
              case 1:
                blob = _a.sent();
                return [2 /*return*/, this.driver.setItem(key, blob)];
            }
          });
        });
      };
      Bucket.prototype.getItem = function (key) {
        return __awaiter(this, undefined, undefined, function () {
          var blob;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.driver.getItem(key)];
              case 1:
                blob = _a.sent();
                if (!blob) {
                  return [2 /*return*/];
                }
                return [2 /*return*/, this.serializer.deserialize(blob)];
            }
          });
        });
      };
      Bucket.prototype.clear = function () {
        return this.driver.clear();
      };
      Bucket.prototype.removeItem = function (key) {
        return this.driver.removeItem(key);
      };
      Bucket.prototype.value = function (key) {
        return Storage({
          bucket: this,
          key: key
        });
      };
      __decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", Promise)], Bucket.prototype, "prepared", null);
      __decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", [String, Object]), __metadata("design:returntype", Promise)], Bucket.prototype, "setItem", null);
      __decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", [String]), __metadata("design:returntype", Promise)], Bucket.prototype, "getItem", null);
      __decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], Bucket.prototype, "clear", null);
      return Bucket;
    }();

    /**
     * ```jsx
     * <Solidium autoRegisterClasses={[
        Persistence.default({
            // default storage configuration
        }),
        Persistence.bucket(
            'custom-bucket-name',
            {
                // custom storage configuration
            }
        )
     ]}></Solidium>
     * ```
     *
     * ```js
     class BizService {
        @Signal()
        @Storage() // use default storage
        autoSaveToDefaultStorage: boolean;
        @Signal()
        @Storage({
            bucket: 'custom-bucket-name'
        }) //
        autoSaveToCustomStorage: boolean;
     }
     * ```
     */
    var Persistence = /** @class */function () {
      function Persistence() {
        this.configuration = {
          name: 'solidium-persistence',
          version: 1.0
        };
      }
      Persistence.default = function (configuration) {
        /** @class */(function () {
          function StorageConfigurationFactory() {}
          StorageConfigurationFactory.prototype.getConfiguration = function () {
            return configuration;
          };
          __decorate([ioc.Factory(DEFAULT_BUCKET_CONFIGURATION), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], StorageConfigurationFactory.prototype, "getConfiguration", null);
          return StorageConfigurationFactory;
        })();
        return Persistence;
      };
      Persistence.bucket = function (name, configuration) {
        var StorageFactory = /** @class */function () {
          function StorageFactory() {}
          StorageFactory.prototype.createStorage = function () {
            return new Bucket(configuration);
          };
          __decorate([ioc.Factory(name), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], StorageFactory.prototype, "createStorage", null);
          return StorageFactory;
        }();
        return StorageFactory;
      };
      Persistence.prototype.getDefaultBucket = function () {
        return new Bucket(this.configuration);
      };
      Persistence.prototype.init = function () {
        //
      };
      __decorate([ioc.Inject(DEFAULT_BUCKET_CONFIGURATION), __metadata("design:type", Object)], Persistence.prototype, "configuration", undefined);
      __decorate([ioc.Factory(DEFAULT_BUCKET), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], Persistence.prototype, "getDefaultBucket", null);
      __decorate([ioc.PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], Persistence.prototype, "init", null);
      return Persistence;
    }();

    exports.Bucket = Bucket;
    exports.DEFAULT_BUCKET = DEFAULT_BUCKET;
    exports.DEFAULT_BUCKET_CONFIGURATION = DEFAULT_BUCKET_CONFIGURATION;
    exports.DefaultSerializer = DefaultSerializer;
    exports.OnStorageLoad = OnStorageLoad;
    exports.Persistence = Persistence;
    exports.Storage = Storage;
    exports.notifyStorageLoad = notifyStorageLoad;

}));
//# sourceMappingURL=index.umd.js.map
