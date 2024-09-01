import { Inject, Factory, PostInject } from '@vgerbot/ioc';
import { defineMemberDecoratorProcessor, getSignal } from '@vgerbot/solidium';
import { createEffect, on } from 'solid-js';
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

const DEFAULT_BUCKET_CONFIGURATION = Symbol('solidium-default-bucket-configuration');
const DEFAULT_BUCKET = Symbol('solidium-default-bucket');

const Storage = (options = {}) => {
  return defineMemberDecoratorProcessor('storage', {
    afterInstantiation(instance, member, metadata, container) {
      const [, set] = getSignal(instance, member);
      const key = options.key || member.toString();
      const bucketOrName = options.bucket || DEFAULT_BUCKET;
      const bucket = typeof bucketOrName === 'string' || typeof bucketOrName === 'symbol' ? container.getInstance(bucketOrName) : bucketOrName;
      const observe = () => {
        return bucket.observe(key, event => {
          set(event.newValue);
        });
      };
      let unobserve = observe();
      createEffect(on(() => {
        return instance[member];
      }, newValue => {
        unobserve();
        bucket.setItem(key, newValue).finally(() => {
          unobserve = observe();
        });
      }));
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

var ChangeBy;
(function (ChangeBy) {
  ChangeBy[ChangeBy["SELF"] = 0] = "SELF";
  ChangeBy[ChangeBy["OTHER"] = 1] = "OTHER";
})(ChangeBy || (ChangeBy = {}));

var ActionType;
(function (ActionType) {
  ActionType[ActionType["UPDATE"] = 0] = "UPDATE";
  ActionType[ActionType["REMOVE"] = 1] = "REMOVE";
})(ActionType || (ActionType = {}));

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
        if (!(key === null || key === void 0 ? void 0 : key.match(regex))) {
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
    return __awaiter(this, void 0, void 0, function* () {
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
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
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
    var _a, e_2, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
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
    const len = hexData.length / 2;
    const u8a = new Uint8Array(len);
    for (let i = 0; i < len; i += 2) {
      const hex = hexData.substring(i * 2, i * 2 + 2);
      u8a[i] = parseInt(hex, 16);
    }
    return createBlob([u8a], {
      type
    });
  }
  serialize(blob) {
    return __awaiter(this, void 0, void 0, function* () {
      if (blob.type.indexOf('text/') > -1) {
        const text = yield blob.text();
        return JSON.stringify({
          type: blob.type,
          text: text
        });
      } else {
        const buffer = yield blob.arrayBuffer();
        const u8a = new Uint8Array(buffer);
        let hex = '';
        u8a.forEach(v => {
          hex += v.toString(16).padStart(2, '0');
        });
        return JSON.stringify({
          type: blob.type,
          hex
        });
      }
    });
  }
  needDispatch(key) {
    var _a;
    return !!((_a = this.observers.get(key)) === null || _a === void 0 ? void 0 : _a.length);
  }
  dispatchChangeEvent(changeBy, actionType, key, newValue, oldValue) {
    const listeners = this.observers.get(key);
    listeners === null || listeners === void 0 ? void 0 : listeners.forEach(listener => {
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
        if ((key === null || key === void 0 ? void 0 : key.indexOf(prefix)) === 0) {
          yield yield __await(key);
        }
      }
    });
  }
  clear() {
    var _a, e_3, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
      const idb = yield openDB(this.bucketName, this.version, {
        upgrade(db) {
          db.createObjectStore(STORE_NAME);
        }
      });
      this.idbDefer.resolve(idb);
    });
  }
  supports() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const checkDBName = '_vgerbot_check_idb';
        yield openDB(checkDBName);
        yield deleteDB(checkDBName);
        return true;
      } catch (error) {
        return false;
      }
    });
  }
  getItem(key) {
    return __awaiter(this, void 0, void 0, function* () {
      const db = yield this.idbPromise;
      const value = yield db.get(STORE_NAME, IDBKeyRange.only(key));
      if (!value) {
        return;
      }
      return createBlob([value], {});
    });
  }
  removeItem(key) {
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
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
    return !!((_a = this.observers.get(key)) === null || _a === void 0 ? void 0 : _a.length);
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
      return __awaiter(this, void 0, void 0, function* () {
        if (!prepare_promise) {
          prepare_promise = target[PREPARE]().finally(() => {
            descriptor.value = origin;
            Object.defineProperty(target, propertyKey, descriptor);
          });
        }
        yield prepare_promise;
        return origin.apply(target, args);
      });
    };
    Object.defineProperty(target, propertyKey, descriptor);
  };
}
class Bucket {
  constructor(config) {
    this.name = config.name;
    this.serializer = config.serializer || new DefaultSerializer();
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
    return __awaiter(this, void 0, void 0, function* () {
      const supports = yield this.driver.supports();
      if (!supports) {
        throw new Error(`Your current browser does not support this storage driver: ${this.driver.name}!`);
      }
      return this.driver.prepare();
    });
  }
  observe(key, onChange) {
    return this.driver.observe(key, event => {
      return onChange(Object.assign(Object.assign({}, event), {
        target: this
      }));
    });
  }
  setItem(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
      const blob = yield this.serializer.serialize(value);
      return this.driver.setItem(key, blob);
    });
  }
  getItem(key) {
    return __awaiter(this, void 0, void 0, function* () {
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
  value(key) {
    return Storage({
      bucket: this,
      key
    });
  }
}
__decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", [String, Function]), __metadata("design:returntype", Function)], Bucket.prototype, "observe", null);
__decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", [String, Object]), __metadata("design:returntype", Promise)], Bucket.prototype, "setItem", null);
__decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", [String]), __metadata("design:returntype", Promise)], Bucket.prototype, "getItem", null);
__decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], Bucket.prototype, "clear", null);

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
    __decorate([Factory(DEFAULT_BUCKET_CONFIGURATION), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], StorageConfigurationFactory.prototype, "getConfiguration", null);
    return Persistence;
  }
  static bucket(name, configuration) {
    class StorageFactory {
      createStorage() {
        return new Bucket(configuration);
      }
    }
    __decorate([Factory(name), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], StorageFactory.prototype, "createStorage", null);
    return StorageFactory;
  }
  getDefaultBucket() {
    return new Bucket(this.configuration);
  }
  init() {
    //
  }
}
__decorate([Inject(DEFAULT_BUCKET_CONFIGURATION), __metadata("design:type", Object)], Persistence.prototype, "configuration", void 0);
__decorate([Factory(DEFAULT_BUCKET), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], Persistence.prototype, "getDefaultBucket", null);
__decorate([PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], Persistence.prototype, "init", null);

export { DefaultDrivers, DefaultSerializer, Persistence, Storage };
//# sourceMappingURL=index.es.js.map
