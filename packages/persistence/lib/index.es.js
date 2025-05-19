import { ClassMetadata, Inject, Factory, PostInject } from '@vgerbot/ioc';
import { defineClassDecoratorProcessor, defineMemberDecoratorProcessor, getSignal } from '@vgerbot/solidium';
import { getOwner, runWithOwner, createEffect, on, onCleanup } from 'solid-js';
import { encode, decode } from '@vgerbot/msgpack-ext';
import { openDB, deleteDB } from 'idb';

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

const DEFAULT_BUCKET_CONFIGURATION = Symbol('solidium-default-bucket-configuration');
const DEFAULT_BUCKET = Symbol('solidium-default-bucket');

function keep(...args) {
  return args;
}

const STORAGE_LOAD_EVENTS = Symbol();
function notifyStorageLoad(event) {
  var _a;
  const prototype = Object.getPrototypeOf(event.instance);
  const events = (_a = Reflect.getMetadata(STORAGE_LOAD_EVENTS, prototype)) !== null && _a !== undefined ? _a : [];
  events.forEach(handle => {
    handle.call(event.instance, event);
  });
}
function OnStorageLoad(options) {
  return (target, propertyKey) => {
    var _a;
    const events = (_a = Reflect.getMetadata(STORAGE_LOAD_EVENTS, target)) !== null && _a !== undefined ? _a : [];
    Reflect.defineMetadata(STORAGE_LOAD_EVENTS, events, target);
    const loadedMembers = new Set();
    events.push(function listener(event) {
      loadedMembers.add(event.member);
      if ((options === null || options === undefined ? undefined : options.members) && !options.members.includes(event.member)) {
        return;
      }
      const method = Reflect.get(this, propertyKey);
      method.call(this, Object.assign(Object.assign({}, event), {
        loadedMembers: new Set(loadedMembers)
      }));
      if (options === null || options === undefined ? undefined : options.members) {
        const isAllHandled = loadedMembers.isSupersetOf(new Set(options.members));
        if (isAllHandled) {
          const index = events.indexOf(listener);
          if (index === -1) {
            return;
          }
          const newEvents = events.slice(0).splice(index, 1);
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

/**
 * Symbol to mark class with default storage options
 * This is used internally to store and retrieve default storage options for a class
 */
const DEFAULT_STORAGE_OPTIONS = Symbol('solidium-default-storage-options');
/**
 * Class decorator to configure default storage options for all @Storage decorated properties
 * in a class that don't specify their own options.
 *
 * @example
 * ```typescript
 * @DefaultStorage({
 *   bucket: 'default-bucket-name'
 * })
 * class MyService {
 *   @Signal()
 *   @Storage() // Will use the default bucket from class decorator
 *   myProperty: string = 'default value';
 *
 *   @Signal()
 *   @Storage({ bucket: 'another-bucket' }) // Will override the default
 *   anotherProperty: number = 42;
 * }
 * ```
 */
const DefaultStorage = (options = {}) => {
  return defineClassDecoratorProcessor(DEFAULT_STORAGE_OPTIONS, {
    beforeInstantiation(constructor) {
      // Store the default options in class metadata using Mark
      const classMetadata = ClassMetadata.getInstance(constructor);
      classMetadata.marker().ctor(DEFAULT_STORAGE_OPTIONS, options);
    }
  });
};
/**
 * Gets the default storage options for a class if they exist
 * This is used internally by the Storage decorator
 */
function getDefaultStorageOptions(metadata) {
  const ctorMarkInfo = metadata.getCtorMarkInfo();
  return ctorMarkInfo === null || ctorMarkInfo === undefined ? undefined : ctorMarkInfo[DEFAULT_STORAGE_OPTIONS];
}

const Storage = (options = {}) => {
  return defineMemberDecoratorProcessor('storage', {
    afterInstantiation(instance, member, metadata, container) {
      var _a;
      // Get default options from class decorator if they exist
      const defaultOptions = getDefaultStorageOptions(metadata);
      // Merge options, with member-specific options taking precedence
      const mergedOptions = Object.assign(Object.assign({}, defaultOptions), options);
      const [, set] = getSignal(instance, member);
      const key = (_a = mergedOptions.key) !== null && _a !== undefined ? _a : member.toString();
      const bucketOrName = mergedOptions.bucket || DEFAULT_BUCKET;
      const bucket = typeof bucketOrName != 'object' ? container.getInstance(bucketOrName) : bucketOrName;
      const observe = () => {
        return bucket.observe(key, event => {
          if (bucket.debug) {
            console.debug(`[Storage] ${ActionType[event.action]} ${JSON.stringify({
              action: ActionType[event.action],
              changeBy: ChangeBy[event.changeBy],
              key: event.key,
              bucketName: event.target.name,
              newValue: event.newValue,
              originValue: event.originValue
            })}`);
          }
          set(event.newValue);
        });
      };
      if (bucket.debug) {
        console.debug(`[Storage] ${key} is loaded from ${bucket.name}`);
      }
      const owner = getOwner();
      bucket.getItem(key).then(value => {
        if (bucket.debug) {
          console.debug(`[Storage] ${key} is loaded, value: ${value}`);
        }
        set(value);
        notifyStorageLoad({
          instance,
          member,
          value,
          timestamp: Date.now()
        });
        runWithOwner(owner, () => {
          let unobserve = observe();
          createEffect(on(() => {
            return instance[member];
          }, newValue => {
            unobserve();
            if (bucket.debug) {
              console.debug(`[Storage] ${instance.constructor.name}.${member.toString()}
                                        changed to ${newValue}`.replace(/\s+/g, ' '));
            }
            bucket.setItem(key, newValue).finally(() => {
              unobserve = observe();
            });
          }));
          onCleanup(() => {
            unobserve();
          });
        });
      });
    }
  });
};

var DefaultDrivers;
(function (DefaultDrivers) {
  DefaultDrivers["LOCAL_STORAGE"] = "localStorage";
  DefaultDrivers["SESSION_STORAGE"] = "sessionStorage";
  DefaultDrivers["INDEXED_DB"] = "indexedDB";
})(DefaultDrivers || (DefaultDrivers = {}));

function createBlob(parts, options) {
  return new Blob(parts, options);
}
function createPlainTextBlob(...parts) {
  return createBlob(parts, {
    type: 'text/plain'
  });
}

class BrowserStorageDriver {
  constructor(options, storage) {
    this.options = options;
    this.storage = storage;
    this.observers = new Map();
  }
  getKeyPrefix() {
    return this.options.bucketName;
  }
  normalizeKey(key) {
    return `${this.getKeyPrefix()}.${key.replace(/\./g, '_')}`;
  }
  prepare() {
    const storageEventListener = event => {
      const {
        key,
        newValue,
        oldValue
      } = event;
      if (key === null) {
        return;
      }
      const newValueBlob = newValue ? createPlainTextBlob(newValue) : undefined;
      const oldValueBlob = oldValue ? createPlainTextBlob(oldValue) : undefined;
      this.dispatchChangeEvent(ChangeBy.OTHER, ActionType.UPDATE, key, newValueBlob, oldValueBlob);
    };
    window.addEventListener('storage', storageEventListener);
    return Promise.resolve();
  }
  supports() {
    return Promise.resolve(typeof this.storage !== 'undefined');
  }
  iterate() {
    return __asyncGenerator(this, arguments, function* iterate_1() {
      const len = this.storage.length;
      const prefix = this.getKeyPrefix();
      const regex = new RegExp('^' + prefix + '.');
      for (let i = 0; i < len; i++) {
        const key = this.storage.key(i);
        if (!(key === null || key === undefined ? undefined : key.match(regex))) {
          continue;
        }
        const value = this.storage.getItem(key);
        if (!value) {
          continue;
        }
        yield yield __await({
          key,
          value: createBlob([value], {})
        });
      }
    });
  }
  getItem(key) {
    const normalizedKey = this.normalizeKey(key);
    return Promise.resolve(this.getItemByNormalizedKey(normalizedKey));
  }
  getItemByNormalizedKey(key) {
    const value = this.storage.getItem(key);
    if (!value) {
      return;
    }
    return this.deserialize(value);
  }
  removeItem(key) {
    const normalizedKey = this.normalizeKey(key);
    let oldValue;
    const needDispatch = this.needDispatch(key);
    if (needDispatch) {
      oldValue = this.getItemByNormalizedKey(normalizedKey);
    }
    this.storage.removeItem(normalizedKey);
    if (needDispatch) {
      this.dispatchChangeEvent(ChangeBy.SELF, ActionType.REMOVE, key, undefined, oldValue);
    }
    return Promise.resolve();
  }
  setItem(key, value) {
    return __awaiter(this, undefined, undefined, function* () {
      const normalizeKey = this.normalizeKey(key);
      const needDispatch = this.needDispatch(key);
      let oldValue;
      if (needDispatch) {
        oldValue = this.getItemByNormalizedKey(normalizeKey);
      }
      const serialized = yield this.serialize(value);
      this.storage.setItem(normalizeKey, serialized);
      if (needDispatch) {
        this.dispatchChangeEvent(ChangeBy.SELF, ActionType.UPDATE, key, value, oldValue);
      }
    });
  }
  length() {
    return __awaiter(this, undefined, undefined, function* () {
      var _a, e_1, _b, _c;
      let len = 0;
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (var _d = true, _e = __asyncValues(this.keys()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const _ = _c;
          len++;
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
      return len;
    });
  }
  keyAt(index) {
    return __awaiter(this, undefined, undefined, function* () {
      var _a, e_2, _b, _c;
      let i = 0;
      try {
        for (var _d = true, _e = __asyncValues(this.keys()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const key = _c;
          if (i === index) {
            return key;
          }
          i++;
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
      return;
    });
  }
  deserialize(str) {
    const {
      type,
      text,
      hex: hexData
    } = JSON.parse(str);
    if (text) {
      return createBlob([text], {
        type
      });
    }
    const u8a = new Uint8Array(hexData.length / 2);
    const view = new DataView(u8a.buffer);
    for (let i = 0; i < hexData.length; i += 2) {
      const hex = hexData.substring(i, i + 2);
      view.setUint8(i / 2, parseInt(hex, 16));
    }
    return createBlob([u8a], {
      type
    });
  }
  serialize(blob) {
    return __awaiter(this, undefined, undefined, function* () {
      if (blob.type.indexOf('text/') > -1) {
        const text = yield blob.text();
        return JSON.stringify({
          type: blob.type,
          text: text
        });
      } else {
        const buffer = yield blob.arrayBuffer();
        const u8a = new Uint8Array(buffer);
        const hexArray = new Array(u8a.length);
        for (let i = 0; i < u8a.length; i++) {
          hexArray[i] = u8a[i].toString(16).padStart(2, '0');
        }
        const hex = hexArray.join('');
        return JSON.stringify({
          type: blob.type,
          hex
        });
      }
    });
  }
  needDispatch(key) {
    var _a;
    return !!((_a = this.observers.get(key)) === null || _a === undefined ? undefined : _a.length);
  }
  dispatchChangeEvent(changeBy, actionType, key, newValue, oldValue) {
    const listeners = this.observers.get(key);
    listeners === null || listeners === undefined ? undefined : listeners.forEach(listener => {
      listener({
        target: this,
        key,
        changeBy,
        action: actionType,
        newValue,
        originValue: oldValue
      });
    });
  }
  keys() {
    return __asyncGenerator(this, arguments, function* keys_1() {
      const len = this.storage.length;
      const prefix = this.getKeyPrefix();
      for (let i = 0; i < len; i++) {
        const key = this.storage.key(i);
        if ((key === null || key === undefined ? undefined : key.indexOf(prefix)) === 0) {
          yield yield __await(key);
        }
      }
    });
  }
  clear() {
    return __awaiter(this, undefined, undefined, function* () {
      var _a, e_3, _b, _c;
      try {
        for (var _d = true, _e = __asyncValues(this.keys()), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
          _c = _f.value;
          _d = false;
          const key = _c;
          this.storage.removeItem(key);
        }
      } catch (e_3_1) {
        e_3 = {
          error: e_3_1
        };
      } finally {
        try {
          if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
        } finally {
          if (e_3) throw e_3.error;
        }
      }
    });
  }
  observe(key, onChange) {
    const changeListener = onChange.bind(this);
    const listeners = this.observers.get(key) || [];
    listeners.push(changeListener);
    this.observers.set(key, listeners);
    return () => {
      const index = listeners.indexOf(changeListener);
      if (index === -1) {
        return;
      }
      listeners.splice(index, 1);
    };
  }
}

class LocalStorageDriver extends BrowserStorageDriver {
  static createInstance(bucketName) {
    return new LocalStorageDriver({
      bucketName
    });
  }
  constructor(options) {
    super(options, window.localStorage);
    this.name = 'LocalStorageDriver';
  }
}

class DefaultSerializer {
  serialize(value) {
    const u8a = encode(value);
    return Promise.resolve(new Blob([u8a]));
  }
  deserialize(data) {
    return __awaiter(this, undefined, undefined, function* () {
      const buffer = yield data.arrayBuffer();
      return decode(buffer);
    });
  }
}

class SessionStorageDriver extends BrowserStorageDriver {
  static createInstance(bucketName) {
    return new SessionStorageDriver({
      bucketName
    });
  }
  constructor(options) {
    super(options, window.localStorage);
    this.name = 'SessionStorageDriver';
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

const STORE_NAME = 'keyval';
class IndexedDBStorageDriver {
  get idbPromise() {
    return this.idbDefer.promise;
  }
  constructor(options) {
    this.name = 'IndexedDBStorageDriver';
    this.observers = new Map();
    this.idbDefer = new Defer();
    this.bucketName = options.bucketName;
    this.version = options.version;
  }
  prepare() {
    return __awaiter(this, undefined, undefined, function* () {
      const idb = yield openDB(this.bucketName, this.version, {
        upgrade(db) {
          db.createObjectStore(STORE_NAME);
        }
      });
      this.idbDefer.resolve(idb);
    });
  }
  supports() {
    return __awaiter(this, undefined, undefined, function* () {
      try {
        const checkDBName = '_vgerbot_check_idb';
        yield openDB(checkDBName);
        yield deleteDB(checkDBName);
        return true;
      } catch (_a) {
        return false;
      }
    });
  }
  getItem(key) {
    return __awaiter(this, undefined, undefined, function* () {
      const db = yield this.idbPromise;
      const value = yield db.get(STORE_NAME, IDBKeyRange.only(key));
      if (!value) {
        return;
      }
      return createBlob([value], {});
    });
  }
  removeItem(key) {
    return __awaiter(this, undefined, undefined, function* () {
      const db = yield this.idbPromise;
      const needDispatch = this.needDispatch(key);
      const oldValue = needDispatch ? yield this.getItem(key) : undefined;
      yield db.delete(STORE_NAME, IDBKeyRange.only(key));
      if (needDispatch) {
        this.dispatchChangeEvent(key, ActionType.REMOVE, undefined, oldValue);
      }
    });
  }
  setItem(key, value) {
    return __awaiter(this, undefined, undefined, function* () {
      const db = yield this.idbPromise;
      const buffer = yield value.arrayBuffer();
      const needDispatch = this.needDispatch(key);
      const oldValue = needDispatch ? yield this.getItem(key) : undefined;
      yield db.put(STORE_NAME, buffer, IDBKeyRange.only(key));
      if (needDispatch) {
        this.dispatchChangeEvent(key, ActionType.UPDATE, value, oldValue);
      }
    });
  }
  clear() {
    return __awaiter(this, undefined, undefined, function* () {
      const db = yield this.idbPromise;
      yield db.clear(STORE_NAME);
    });
  }
  observe(key, onChange) {
    const changeListener = onChange.bind(this);
    const listeners = this.observers.get(key) || [];
    listeners.push(changeListener);
    this.observers.set(key, listeners);
    return () => {
      const index = listeners.indexOf(changeListener);
      if (index === -1) {
        return;
      }
      listeners.splice(index, 1);
    };
  }
  dispatchChangeEvent(key, action, newValue, originValue) {
    const listeners = this.observers.get(key);
    if (!listeners || listeners.length === 0) {
      return;
    }
    listeners.forEach(listener => {
      listener({
        target: this,
        key,
        action,
        newValue,
        originValue,
        changeBy: ChangeBy.SELF
      });
    });
  }
  needDispatch(key) {
    var _a;
    return !!((_a = this.observers.get(key)) === null || _a === undefined ? undefined : _a.length);
  }
}

const PREPARE = Symbol('prepare');
function Prepared() {
  return (target, propertyKey, descriptor) => {
    const origin = descriptor.value;
    if (!origin) {
      return;
    }
    let prepare_promise;
    descriptor.value = function (...args) {
      return __awaiter(this, undefined, undefined, function* () {
        if (!prepare_promise) {
          prepare_promise = this[PREPARE]().finally(() => {
            descriptor.value = origin;
            Object.defineProperty(this, propertyKey, descriptor);
          });
        }
        yield prepare_promise;
        return origin.apply(this, args);
      });
    };
    Object.defineProperty(target, propertyKey, descriptor);
  };
}
class Bucket {
  constructor(config) {
    var _a, _b;
    this.name = (_a = config.name) !== null && _a !== undefined ? _a : '';
    this.serializer = config.serializer || new DefaultSerializer();
    this.debug = (_b = config.debug) !== null && _b !== undefined ? _b : false;
    const driver = config.driver;
    if (driver === DefaultDrivers.LOCAL_STORAGE) {
      this.driver = LocalStorageDriver.createInstance(this.name);
    } else if (driver === DefaultDrivers.INDEXED_DB) {
      this.driver = new IndexedDBStorageDriver({
        bucketName: this.name,
        version: config.version
      });
    } else if (driver === DefaultDrivers.SESSION_STORAGE) {
      this.driver = SessionStorageDriver.createInstance(this.name);
    } else {
      this.driver = driver || LocalStorageDriver.createInstance(this.name);
    }
  }
  [PREPARE]() {
    return __awaiter(this, undefined, undefined, function* () {
      const supports = yield this.driver.supports();
      if (!supports) {
        throw new Error(`Your current browser does not support this storage driver: ${this.driver.name}!`);
      }
      return this.driver.prepare();
    });
  }
  prepared() {
    return __awaiter(this, undefined, undefined, function* () {
      return undefined;
    });
  }
  observe(key, onChange) {
    const preparePromise = this.prepared();
    const unobserve = this.driver.observe(key, event => {
      return onChange(Object.assign(Object.assign({}, event), {
        target: this
      }));
    });
    return () => {
      preparePromise.then(unobserve);
    };
  }
  setItem(key, value) {
    return __awaiter(this, undefined, undefined, function* () {
      const blob = yield this.serializer.serialize(value);
      return this.driver.setItem(key, blob);
    });
  }
  getItem(key) {
    return __awaiter(this, undefined, undefined, function* () {
      const blob = yield this.driver.getItem(key);
      if (!blob) {
        return;
      }
      return this.serializer.deserialize(blob);
    });
  }
  clear() {
    return this.driver.clear();
  }
  removeItem(key) {
    return this.driver.removeItem(key);
  }
  value(key) {
    return Storage({
      bucket: this,
      key
    });
  }
}
__decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", Promise)], Bucket.prototype, "prepared", null);
__decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", [String, Object]), __metadata("design:returntype", Promise)], Bucket.prototype, "setItem", null);
__decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", [String]), __metadata("design:returntype", Promise)], Bucket.prototype, "getItem", null);
__decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], Bucket.prototype, "clear", null);

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
class Persistence {
  constructor() {
    this.configuration = {
      name: 'solidium-persistence',
      version: 1.0
    };
  }
  static default(configuration) {
    class StorageConfigurationFactory {
      getConfiguration() {
        return configuration;
      }
    }
    __decorate([Factory(DEFAULT_BUCKET_CONFIGURATION), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], StorageConfigurationFactory.prototype, "getConfiguration", null);
    keep(StorageConfigurationFactory);
    return Persistence;
  }
  static bucket(name, configuration) {
    class StorageFactory {
      createStorage() {
        return new Bucket(configuration);
      }
    }
    __decorate([Factory(name), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], StorageFactory.prototype, "createStorage", null);
    return StorageFactory;
  }
  getDefaultBucket() {
    return new Bucket(this.configuration);
  }
  init() {
    //
  }
}
__decorate([Inject(DEFAULT_BUCKET_CONFIGURATION), __metadata("design:type", Object)], Persistence.prototype, "configuration", undefined);
__decorate([Factory(DEFAULT_BUCKET), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], Persistence.prototype, "getDefaultBucket", null);
__decorate([PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", undefined)], Persistence.prototype, "init", null);

export { Bucket, DEFAULT_BUCKET, DEFAULT_BUCKET_CONFIGURATION, DEFAULT_STORAGE_OPTIONS, DefaultDrivers, DefaultSerializer, DefaultStorage, OnStorageLoad, Persistence, Storage, getDefaultStorageOptions, notifyStorageLoad };
//# sourceMappingURL=index.es.js.map
