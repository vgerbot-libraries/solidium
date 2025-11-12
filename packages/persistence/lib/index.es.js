import { Inject, Factory, PostInject, createFactoryWrapper } from '@vgerbot/ioc';
import { defineClassDecoratorProcessor, defineMemberDecoratorProcessor, isSignalMember, getSignal } from '@vgerbot/solidium';
import { getOwner, runWithOwner, onCleanup, createEffect, on } from 'solid-js';
import { leadingAndTrailing, debounce } from '@solid-primitives/scheduled';
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
 * Symbol identifier for the default bucket configuration in the IoC container.
 * Used internally to register and retrieve the default bucket configuration.
 *
 * @public
 */
const DEFAULT_BUCKET_CONFIGURATION = Symbol('solidium-default-bucket-configuration');
/**
 * Symbol identifier for the default bucket instance in the IoC container.
 * Used internally to register and retrieve the default bucket.
 *
 * @public
 */
const DEFAULT_BUCKET = Symbol('solidium-default-bucket');

const STORAGE_LOAD_EVENTS = Symbol();
function notifyStorageLoad(event) {
  var _a;
  const prototype = Object.getPrototypeOf(event.instance);
  const events = (_a = Reflect.getMetadata(STORAGE_LOAD_EVENTS, prototype)) !== null && _a !== void 0 ? _a : [];
  events.forEach(handle => {
    handle.call(event.instance, event);
  });
}
/**
 * Method decorator that marks a method to be called when storage properties are loaded.
 * The decorated method will receive a {@link StorageLoadEvent} with information about
 * the loaded property.
 *
 * This is useful for performing actions after storage values are restored, such as
 * validation, transformation, or triggering side effects.
 *
 * @param options - Optional configuration to filter which properties trigger the callback
 * @returns A method decorator
 *
 * @example
 * Called for any storage property load:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @Signal()
 *   @Storage()
 *   fontSize: number = 14;
 *
 *   @OnStorageLoad()
 *   onAnyPropertyLoaded(event: StorageLoadEvent<UserSettings>) {
 *     console.log(`Loaded ${String(event.member)}: ${event.value}`);
 *   }
 * }
 * ```
 *
 * @example
 * Called only for specific properties:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @Signal()
 *   @Storage()
 *   fontSize: number = 14;
 *
 *   @OnStorageLoad({ members: ['theme', 'fontSize'] })
 *   onBothLoaded(event: StorageLoadEvent<UserSettings>) {
 *     // Called after both theme and fontSize are loaded
 *     if (event.loadedMembers.size === 2) {
 *       console.log('All settings loaded!');
 *     }
 *   }
 * }
 * ```
 *
 * @public
 */
function OnStorageLoad(options) {
  return (target, propertyKey) => {
    var _a;
    const events = (_a = Reflect.getMetadata(STORAGE_LOAD_EVENTS, target)) !== null && _a !== void 0 ? _a : [];
    Reflect.defineMetadata(STORAGE_LOAD_EVENTS, events, target);
    const loadedMembers = new Set();
    events.push(function listener(event) {
      loadedMembers.add(event.member);
      if ((options === null || options === void 0 ? void 0 : options.members) && !options.members.includes(event.member)) {
        return;
      }
      const method = Reflect.get(this, propertyKey);
      method.call(this, Object.assign(Object.assign({}, event), {
        loadedMembers: new Set(loadedMembers)
      }));
      if (options === null || options === void 0 ? void 0 : options.members) {
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

/**
 * Defines the type of action performed on storage.
 *
 * @public
 */
var ActionType;
(function (ActionType) {
  /**
   * Represents an update or insert operation on a storage item.
   */
  ActionType[ActionType["UPDATE"] = 0] = "UPDATE";
  /**
   * Represents a removal operation on a storage item.
   */
  ActionType[ActionType["REMOVE"] = 1] = "REMOVE";
})(ActionType || (ActionType = {}));

/**
 * Indicates the source of a storage change event.
 *
 * @public
 */
var ChangeBy;
(function (ChangeBy) {
  /**
   * The change was triggered by the current application instance.
   */
  ChangeBy[ChangeBy["SELF"] = 0] = "SELF";
  /**
   * The change was triggered by another application instance or external source.
   * For example, changes from other browser tabs/windows.
   */
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
    beforeInstantiation(constructor, metadata) {
      // Store the default options in class metadata using Mark
      metadata.marker().ctor(DEFAULT_STORAGE_OPTIONS, options);
    }
  });
};
/**
 * Gets the default storage options for a class if they exist
 * This is used internally by the Storage decorator
 */
function getDefaultStorageOptions(metadata) {
  const ctorMarkInfo = metadata.getCtorMarkInfo();
  return ctorMarkInfo === null || ctorMarkInfo === void 0 ? void 0 : ctorMarkInfo[DEFAULT_STORAGE_OPTIONS];
}

const STORAGE_CHANGE_EVENTS = Symbol('storage-change-events');
/**
 * Internal function to notify all registered storage change listeners.
 * @internal
 */
function notifyStorageChange(event) {
  var _a;
  const prototype = Object.getPrototypeOf(event.instance);
  const events = (_a = Reflect.getMetadata(STORAGE_CHANGE_EVENTS, prototype)) !== null && _a !== void 0 ? _a : [];
  events.forEach(handle => {
    handle.call(event.instance, event);
  });
}
/**
 * Method decorator that marks a method to be called when storage properties change.
 * Unlike {@link OnStorageLoad}, which is called only once when data is initially loaded,
 * this decorator is called whenever the storage value changes (including updates and removals).
 *
 * The decorated method receives a {@link StorageChangeEvent} with information about the change,
 * including what changed, who made the change, and the old/new values.
 *
 * @param options - Optional configuration to filter which changes trigger the callback
 * @returns A method decorator
 *
 * @example
 * Called for any storage property change:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @Signal()
 *   @Storage()
 *   fontSize: number = 14;
 *
 *   @OnStorageChange()
 *   onAnyChange(event: StorageChangeEvent<UserSettings>) {
 *     console.log(`${String(event.member)} changed to ${event.newValue}`);
 *     console.log(`Changed by: ${event.changeBy === ChangeBy.SELF ? 'this instance' : 'another tab'}`);
 *   }
 * }
 * ```
 *
 * @example
 * Filter by specific properties:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @Signal()
 *   @Storage()
 *   fontSize: number = 14;
 *
 *   @OnStorageChange({ members: ['theme'] })
 *   onThemeChange(event: StorageChangeEvent<UserSettings>) {
 *     // Only called when theme changes
 *     this.applyTheme(event.newValue as string);
 *   }
 * }
 * ```
 *
 * @example
 * Filter by change source (cross-tab synchronization):
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @OnStorageChange({ changeBy: ChangeBy.OTHER })
 *   onExternalChange(event: StorageChangeEvent<UserSettings>) {
 *     // Only called when changes come from other tabs/windows
 *     console.log(`Another tab changed ${String(event.member)}`);
 *     this.showNotification(`Settings synced from another tab`);
 *   }
 * }
 * ```
 *
 * @example
 * Filter by action type:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @OnStorageChange({ action: ActionType.REMOVE })
 *   onSettingRemoved(event: StorageChangeEvent<UserSettings>) {
 *     // Only called when a setting is removed
 *     console.log(`Setting ${String(event.member)} was removed`);
 *     this.restoreDefault(event.member);
 *   }
 * }
 * ```
 *
 * @example
 * Combine multiple filters:
 * ```typescript
 * class UserSettings {
 *   @Signal()
 *   @Storage()
 *   theme: string = 'light';
 *
 *   @OnStorageChange({
 *     members: ['theme', 'fontSize'],
 *     changeBy: ChangeBy.OTHER,
 *     action: ActionType.UPDATE
 *   })
 *   onExternalUpdate(event: StorageChangeEvent<UserSettings>) {
 *     // Called only when theme or fontSize is updated by another tab
 *     console.log(`${String(event.member)} synced from another tab`);
 *   }
 * }
 * ```
 *
 * @public
 */
function OnStorageChange(options) {
  return (target, propertyKey) => {
    var _a;
    const events = (_a = Reflect.getMetadata(STORAGE_CHANGE_EVENTS, target)) !== null && _a !== void 0 ? _a : [];
    Reflect.defineMetadata(STORAGE_CHANGE_EVENTS, events, target);
    events.push(function listener(event) {
      if ((options === null || options === void 0 ? void 0 : options.members) && !options.members.includes(event.member)) {
        return;
      }
      if ((options === null || options === void 0 ? void 0 : options.changeBy) && event.changeBy !== options.changeBy) {
        return;
      }
      if ((options === null || options === void 0 ? void 0 : options.action) && event.action !== options.action) {
        return;
      }
      const method = Reflect.get(this, propertyKey);
      method.call(this, event);
    });
  };
}

const BUILT_IN_MIGRATION_STRATEGIES = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  overwrite: (newValue, cachedValue) => newValue,
  keep: (newValue, cachedValue) => cachedValue
};
/**
 * Property decorator that automatically persists a signal property to storage.
 * The decorated property must be a signal created with `@Signal()`.
 *
 * When the property changes, the new value is automatically saved to storage.
 * When the component initializes, the last saved value is automatically loaded.
 *
 * @param options - Configuration options for storage behavior
 * @returns A property decorator
 *
 * @example
 * Basic usage with default bucket:
 * ```typescript
 * class UserPreferences {
 *   @Signal()
 *   @Storage()
 *   theme: 'light' | 'dark' = 'light';
 * }
 * ```
 *
 * @example
 * Using a custom bucket and key:
 * ```typescript
 * class UserPreferences {
 *   @Signal()
 *   @Storage({
 *     bucket: 'user-preferences',
 *     key: 'app-theme'
 *   })
 *   theme: 'light' | 'dark' = 'light';
 * }
 * ```
 *
 * @public
 */
const Storage = (options = {}) => {
  return defineMemberDecoratorProcessor('storage', {
    afterInstantiation(instance, member, metadata, container) {
      var _a, _b, _c;
      // Get default options from class decorator if they exist
      const defaultOptions = getDefaultStorageOptions(metadata.reader());
      // Merge options, with member-specific options taking precedence
      const mergedOptions = Object.assign(Object.assign({}, defaultOptions), typeof options === 'string' ? {
        key: options
      } : options);
      const version = (_a = mergedOptions.version) !== null && _a !== void 0 ? _a : '';
      const descriptor = Object.getOwnPropertyDescriptor(instance, member);
      const writable = (_b = descriptor === null || descriptor === void 0 ? void 0 : descriptor.writable) !== null && _b !== void 0 ? _b : true;
      const isSignal = isSignalMember(instance, member);
      const key = (_c = mergedOptions.key) !== null && _c !== void 0 ? _c : member.toString();
      const bucketOrName = mergedOptions.bucket || DEFAULT_BUCKET;
      const bucket = typeof bucketOrName != 'object' ? container.getInstance(bucketOrName) : bucketOrName;
      const initialValue = instance[member];
      const [get, set] = (() => {
        var _a;
        if (isSignal) {
          const [get, set] = getSignal(instance, member, initialValue);
          return [get, set];
        } else {
          const storageSymbol = Symbol(`__storage_${String(member)}`);
          instance[storageSymbol] = initialValue;
          const baseGetter = () => {
            return instance[storageSymbol];
          };
          const baseSetter = newValue => {
            instance[storageSymbol] = newValue;
          };
          Object.defineProperty(instance, member, {
            get: baseGetter,
            set: baseSetter,
            configurable: true,
            enumerable: (_a = descriptor === null || descriptor === void 0 ? void 0 : descriptor.enumerable) !== null && _a !== void 0 ? _a : true
          });
          return [baseGetter, baseSetter];
        }
      })();
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
          notifyStorageChange(Object.assign({
            instance,
            member: key
          }, event));
        });
      };
      if (bucket.debug) {
        console.debug(`[Storage] ${key} is loaded from ${bucket.name}`);
      }
      const owner = getOwner();
      bucket.getItem(key).then(storageValue => {
        if (bucket.debug) {
          console.debug(`[Storage] ${key} is loaded, value: ${storageValue === null || storageValue === void 0 ? void 0 : storageValue.$d}`);
        }
        if (!isValidStorageValue(storageValue)) {
          return;
        }
        const dataVersion = storageValue.$v;
        if (dataVersion !== version) {
          const mergeStrategy = mergedOptions.migrationStrategy;
          if (typeof mergeStrategy === 'string' && BUILT_IN_MIGRATION_STRATEGIES[mergeStrategy]) {
            set(BUILT_IN_MIGRATION_STRATEGIES[mergeStrategy](storageValue.$d, storageValue.$d));
          } else if (typeof mergeStrategy === 'function') {
            set(mergeStrategy(storageValue.$d, storageValue.$d));
          }
        } else {
          set(storageValue.$d);
        }
        notifyStorageLoad({
          instance,
          member,
          value: storageValue.$d,
          timestamp: Date.now()
        });
      }).then(() => {
        runWithOwner(owner, () => {
          let unobserve = observe();
          if (!writable) {
            onCleanup(() => {
              unobserve();
            });
            return;
          }
          const storageOnPropertyChange = createSaveTrigger(() => {
            unobserve();
          }, () => {
            unobserve = observe();
          }, bucket, key, version, instance, member);
          observePropertyChange(isSignal, instance, member, storageOnPropertyChange, get, set);
          onCleanup(() => {
            unobserve();
          });
        });
      });
    }
  });
};
function createSaveTrigger(unobserve, reobserve, bucket, key, version, instance, member) {
  return leadingAndTrailing(debounce, newValue => __awaiter(this, void 0, void 0, function* () {
    var _a;
    yield unobserve();
    if (bucket.debug) {
      console.debug(`[Storage] ${(_a = instance.constructor) === null || _a === void 0 ? void 0 : _a.name}.${member.toString()}
                    changed to ${newValue}`.replace(/\s+/g, ' '));
    }
    bucket.setItem(key, {
      $d: newValue,
      $v: version
    }).finally(() => {
      reobserve();
    });
  }), 300);
}
function observePropertyChange(isSignal, instance, member, trigger, getValue, setValue) {
  var _a, _b;
  if (isSignal) {
    createEffect(on(() => {
      return getValue();
    }, trigger));
  } else {
    const currentDescriptor = Object.getOwnPropertyDescriptor(instance, member);
    if (currentDescriptor) {
      Object.defineProperty(instance, member, {
        get: getValue,
        set: newValue => {
          setValue(newValue);
          trigger(newValue);
        },
        configurable: (_a = currentDescriptor.configurable) !== null && _a !== void 0 ? _a : true,
        enumerable: (_b = currentDescriptor.enumerable) !== null && _b !== void 0 ? _b : true
      });
    }
  }
}
function isValidStorageValue(value) {
  return typeof value === 'object' && value !== null && '$d' in value && '$v' in value;
}

/**
 * Enumeration of built-in storage drivers available in the persistence library.
 *
 * @public
 */
var DefaultDrivers;
(function (DefaultDrivers) {
  /**
   * Uses browser's localStorage API for persistent storage across sessions.
   */
  DefaultDrivers["LOCAL_STORAGE"] = "localStorage";
  /**
   * Uses browser's sessionStorage API for storage that persists only for the session.
   */
  DefaultDrivers["SESSION_STORAGE"] = "sessionStorage";
  /**
   * Uses browser's IndexedDB API for more advanced persistent storage with larger capacity.
   */
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

/**
 * Abstract base class for storage drivers that use browser Web Storage APIs
 * (localStorage or sessionStorage).
 *
 * This class provides common functionality for:
 * - Key normalization and namespacing
 * - Serialization to/from Blob format
 * - Change event observation
 * - Cross-tab synchronization via storage events
 *
 * @public
 */
class BrowserStorageDriver {
  /**
   * Creates a new BrowserStorageDriver instance.
   *
   * @param options - Configuration options for the driver
   * @param storage - The Web Storage API object (localStorage or sessionStorage)
   */
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
  /**
   * Prepares the driver for use by setting up storage event listeners.
   * This enables cross-tab synchronization.
   *
   * @returns A promise that resolves when preparation is complete
   */
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
  /**
   * Checks if the storage API is supported in the current environment.
   *
   * @returns A promise that resolves to true if supported, false otherwise
   */
  supports() {
    return Promise.resolve(typeof this.storage !== 'undefined');
  }
  /**
   * Iterates over all key-value pairs in this bucket.
   *
   * @yields Objects containing key and value (as Blob)
   */
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
  /**
   * Retrieves an item from storage by key.
   *
   * @param key - The key of the item to retrieve
   * @returns A promise that resolves to the stored Blob, or undefined if not found
   */
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
  /**
   * Removes an item from storage by key.
   *
   * @param key - The key of the item to remove
   * @returns A promise that resolves when the item is removed
   */
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
  /**
   * Stores an item in storage.
   *
   * @param key - The key to store the item under
   * @param value - The Blob value to store
   * @returns A promise that resolves when the item is stored
   */
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
  /**
   * Returns the number of items in this bucket.
   *
   * @returns A promise that resolves to the item count
   */
  length() {
    return __awaiter(this, void 0, void 0, function* () {
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
  /**
   * Returns the key at the specified index.
   *
   * @param index - The index of the key to retrieve
   * @returns A promise that resolves to the key, or undefined if index is out of bounds
   */
  keyAt(index) {
    return __awaiter(this, void 0, void 0, function* () {
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
  /**
   * Iterates over all keys in this bucket.
   *
   * @yields Storage keys belonging to this bucket
   */
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
  /**
   * Clears all items from this bucket.
   *
   * @returns A promise that resolves when all items are cleared
   */
  clear() {
    return __awaiter(this, void 0, void 0, function* () {
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
  /**
   * Observes changes to a specific storage key.
   *
   * @param key - The key to observe
   * @param onChange - Callback function invoked when the key changes
   * @returns A function that can be called to stop observing
   */
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

/**
 * Storage driver implementation that uses the browser's localStorage API.
 * Data persists across browser sessions and tabs.
 *
 * @public
 */
class LocalStorageDriver extends BrowserStorageDriver {
  /**
   * Creates a new LocalStorageDriver instance with the specified bucket name.
   *
   * @param bucketName - The name of the storage bucket
   * @returns A new LocalStorageDriver instance
   */
  static createInstance(bucketName) {
    return new LocalStorageDriver({
      bucketName
    });
  }
  /**
   * Creates a new LocalStorageDriver instance.
   *
   * @param options - Configuration options for the driver
   */
  constructor(options) {
    super(options, window.localStorage);
    /**
     * The name identifier for this driver.
     */
    this.name = 'LocalStorageDriver';
  }
}

/**
 * Default serializer implementation using MessagePack format.
 * Provides efficient binary serialization for JavaScript values.
 *
 * @public
 */
class DefaultSerializer {
  /**
   * Serializes a value into a Blob using MessagePack encoding.
   * @param value - The value to serialize
   * @returns A promise that resolves to a Blob containing the MessagePack encoded data
   */
  serialize(value) {
    const u8a = encode(value);
    return Promise.resolve(new Blob([u8a]));
  }
  /**
   * Deserializes a Blob back into its original value using MessagePack decoding.
   * @param data - The Blob containing MessagePack encoded data
   * @returns A promise that resolves to the deserialized value
   * @typeParam T - The expected type of the deserialized value
   */
  deserialize(data) {
    return __awaiter(this, void 0, void 0, function* () {
      const buffer = yield data.arrayBuffer();
      return decode(buffer);
    });
  }
}

/**
 * Storage driver implementation that uses the browser's sessionStorage API.
 * Data persists only for the duration of the browser session and is not shared across tabs.
 *
 * @public
 */
class SessionStorageDriver extends BrowserStorageDriver {
  /**
   * Creates a new SessionStorageDriver instance with the specified bucket name.
   *
   * @param bucketName - The name of the storage bucket
   * @returns A new SessionStorageDriver instance
   */
  static createInstance(bucketName) {
    return new SessionStorageDriver({
      bucketName
    });
  }
  /**
   * Creates a new SessionStorageDriver instance.
   *
   * @param options - Configuration options for the driver
   */
  constructor(options) {
    super(options, window.sessionStorage);
    /**
     * The name identifier for this driver.
     */
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
/**
 * Storage driver implementation that uses the browser's IndexedDB API.
 * Provides larger storage capacity and more advanced features compared to Web Storage.
 * Data persists across browser sessions and supports versioning for schema migrations.
 *
 * @public
 */
class IndexedDBStorageDriver {
  get idbPromise() {
    return this.idbDefer.promise;
  }
  /**
   * Creates a new IndexedDBStorageDriver instance.
   *
   * @param options - Configuration options including bucket name and version
   */
  constructor(options) {
    /**
     * The name identifier for this driver.
     */
    this.name = 'IndexedDBStorageDriver';
    this.observers = new Map();
    this.idbDefer = new Defer();
    this.bucketName = options.bucketName;
    this.version = options.version;
  }
  /**
   * Prepares the driver by opening the IndexedDB database and creating the object store.
   *
   * @returns A promise that resolves when the database is ready
   */
  prepare() {
    return __awaiter(this, void 0, void 0, function* () {
      const idb = yield openDB(this.bucketName, this.version, {
        blocked(currentVersion, blockedVersion, event) {
          console.log('blocked', currentVersion, blockedVersion, event);
        },
        blocking(currentVersion, blockedVersion, event) {
          console.log('blocking', currentVersion, blockedVersion, event);
        },
        upgrade(db) {
          db.createObjectStore(STORE_NAME);
        },
        terminated: () => {
          console.log('bucket terminated: ', this.bucketName);
        }
      });
      this.idbDefer.resolve(idb);
    });
  }
  /**
   * Checks if IndexedDB is supported in the current environment.
   *
   * @returns A promise that resolves to true if IndexedDB is supported, false otherwise
   */
  supports() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        if (typeof indexedDB === 'undefined') {
          return false;
        }
        const checkDBName = '_vgerbot_check_idb';
        const db = yield openDB(checkDBName);
        yield db.close();
        yield deleteDB(checkDBName);
        return true;
      } catch (_a) {
        return false;
      }
    });
  }
  /**
   * Retrieves an item from IndexedDB by key.
   *
   * @param key - The key of the item to retrieve
   * @returns A promise that resolves to the stored Blob, or undefined if not found
   */
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
  /**
   * Removes an item from IndexedDB by key.
   *
   * @param key - The key of the item to remove
   * @returns A promise that resolves when the item is removed
   */
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
  /**
   * Stores an item in IndexedDB.
   *
   * @param key - The key to store the item under
   * @param value - The Blob value to store
   * @returns A promise that resolves when the item is stored
   */
  setItem(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
      const db = yield this.idbPromise;
      const buffer = yield value.arrayBuffer();
      const needDispatch = this.needDispatch(key);
      const oldValue = needDispatch ? yield this.getItem(key) : undefined;
      yield db.put(STORE_NAME, buffer, key);
      if (needDispatch) {
        this.dispatchChangeEvent(key, ActionType.UPDATE, value, oldValue);
      }
    });
  }
  /**
   * Clears all items from the IndexedDB object store.
   *
   * @returns A promise that resolves when all items are cleared
   */
  clear() {
    return __awaiter(this, void 0, void 0, function* () {
      const db = yield this.idbPromise;
      yield db.clear(STORE_NAME);
    });
  }
  /**
   * Observes changes to a specific storage key.
   * Note: IndexedDB doesn't support cross-tab observation natively.
   *
   * @param key - The key to observe
   * @param onChange - Callback function invoked when the key changes
   * @returns A function that can be called to stop observing
   */
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
    descriptor.value = function (...args) {
      return __awaiter(this, void 0, void 0, function* () {
        let prepare_promise = Reflect.getMetadata(PREPARE, this);
        if (!prepare_promise) {
          prepare_promise = this[PREPARE]().finally(() => {
            descriptor.value = origin;
            Object.defineProperty(this, propertyKey, descriptor);
          });
          Reflect.defineMetadata(PREPARE, prepare_promise, this);
        }
        yield prepare_promise;
        return origin.apply(this, args);
      });
    };
    Object.defineProperty(target, propertyKey, descriptor);
  };
}
/**
 * Represents a storage bucket that provides a high-level API for persistent data storage.
 * A bucket uses a storage driver for the underlying storage mechanism and a serializer
 * for encoding/decoding data.
 *
 * @public
 */
class Bucket {
  /**
   * Creates a new Bucket instance.
   * @param config - Configuration options for the bucket
   */
  constructor(config) {
    var _a, _b;
    this.name = (_a = config.name) !== null && _a !== void 0 ? _a : '';
    this.serializer = config.serializer || new DefaultSerializer();
    this.debug = (_b = config.debug) !== null && _b !== void 0 ? _b : false;
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
  prepared() {
    return __awaiter(this, void 0, void 0, function* () {
      return void 0;
    });
  }
  /**
   * Observes changes to a specific storage key within this bucket.
   * The observer will be notified when the key is updated or removed.
   *
   * @param key - The key to observe
   * @param onChange - Callback function invoked when the key changes
   * @returns A function that can be called to stop observing
   *
   * @example
   * ```typescript
   * const unobserve = bucket.observe('myKey', (event) => {
   *   console.log('Value changed:', event.newValue);
   * });
   *
   * // Later, to stop observing:
   * unobserve();
   * ```
   */
  observe(key, onChange) {
    const preparePromise = this.prepared();
    const unobserve = this.driver.observe(key, event => {
      return onChange(Object.assign(Object.assign({}, event), {
        target: this
      }));
    });
    return () => {
      return preparePromise.then(unobserve);
    };
  }
  /**
   * Stores a value in the bucket under the specified key.
   * The value will be serialized before storage.
   *
   * @param key - The key to store the value under
   * @param value - The value to store
   * @returns A promise that resolves when the value is stored
   *
   * @example
   * ```typescript
   * await bucket.setItem('user', { name: 'John', age: 30 });
   * ```
   */
  setItem(key, value) {
    return __awaiter(this, void 0, void 0, function* () {
      const blob = yield this.serializer.serialize(value);
      return this.driver.setItem(key, blob);
    });
  }
  /**
   * Retrieves a value from the bucket by key.
   * The value will be deserialized before being returned.
   *
   * @param key - The key of the value to retrieve
   * @returns A promise that resolves to the stored value, or undefined if not found
   * @typeParam T - The expected type of the stored value
   *
   * @example
   * ```typescript
   * const user = await bucket.getItem<User>('user');
   * if (user) {
   *   console.log(user.name);
   * }
   * ```
   */
  getItem(key) {
    return __awaiter(this, void 0, void 0, function* () {
      const blob = yield this.driver.getItem(key);
      if (!blob) {
        return;
      }
      return this.serializer.deserialize(blob);
    });
  }
  /**
   * Clears all items from the bucket.
   *
   * @returns A promise that resolves when the bucket is cleared
   */
  clear() {
    return this.driver.clear();
  }
  /**
   * Removes an item from the bucket by key.
   *
   * @param key - The key of the item to remove
   * @returns A promise that resolves when the item is removed
   */
  removeItem(key) {
    return this.driver.removeItem(key);
  }
  /**
   * Creates a property decorator that binds a signal property to this bucket.
   * This is equivalent to using `@Storage({ bucket: this, key })`.
   *
   * @param key - The storage key to use for this property
   * @returns A property decorator
   *
   * @example
   * ```typescript
   * class MyService {
   *   @Signal()
   *   @myBucket.value('username')
   *   username: string;
   * }
   * ```
   */
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
__decorate([Prepared(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], Bucket.prototype, "clear", null);

/**
 * Main entry point for the persistence system.
 * Provides factory methods for configuring storage buckets.
 *
 * @example
 * Configure default and custom buckets in your Solidium application:
 * ```tsx
 * <Solidium autoRegisterClasses={[
 *   Persistence.default({
 *     driver: DefaultDrivers.LOCAL_STORAGE,
 *     debug: true
 *   }),
 *   Persistence.bucket('custom-bucket-name', {
 *     name: 'custom-bucket-name',
 *     driver: DefaultDrivers.INDEXED_DB,
 *     version: 1.0
 *   })
 * ]}></Solidium>
 * ```
 *
 * @example
 * Use storage decorators in your services:
 * ```typescript
 * class BizService {
 *   @Signal()
 *   @Storage() // uses default bucket
 *   autoSaveToDefaultStorage: boolean;
 *
 *   @Signal()
 *   @Storage({
 *     bucket: 'custom-bucket-name'
 *   })
 *   autoSaveToCustomStorage: boolean;
 * }
 * ```
 *
 * @public
 */
class Persistence {
  constructor() {
    this.configuration = {
      name: 'solidium-persistence',
      version: 1.0
    };
  }
  /**
   * Creates a factory wrapper for the default storage bucket configuration.
   * The default bucket is used when no bucket is specified in `@Storage()` decorators.
   *
   * @param configuration - Configuration options for the default bucket (name is automatically set)
   * @returns A factory wrapper that can be registered with Solidium
   *
   * @example
   * ```typescript
   * Persistence.default({
   *   driver: DefaultDrivers.LOCAL_STORAGE,
   *   debug: true
   * })
   * ```
   */
  static default(configuration) {
    return createFactoryWrapper(DEFAULT_BUCKET_CONFIGURATION, configuration, Persistence);
  }
  /**
   * Creates a factory wrapper for a custom named storage bucket.
   * Named buckets can be referenced in `@Storage()` decorators by their name.
   *
   * @param name - The name identifier for this bucket
   * @param configuration - Configuration options for the bucket
   * @returns A factory wrapper that can be registered with Solidium
   *
   * @example
   * ```typescript
   * Persistence.bucket('user-preferences', {
   *   name: 'user-preferences',
   *   driver: DefaultDrivers.INDEXED_DB,
   *   version: 1.0
   * })
   * ```
   */
  static bucket(name, configuration) {
    return createFactoryWrapper(name, new Bucket(configuration), Persistence);
  }
  /**
   * Factory method that creates and returns the default bucket instance.
   * @internal
   */
  getDefaultBucket() {
    return new Bucket(this.configuration);
  }
  /**
   * Initialization hook called after dependency injection.
   * @internal
   */
  init() {
    //
  }
}
__decorate([Inject(DEFAULT_BUCKET_CONFIGURATION), __metadata("design:type", Object)], Persistence.prototype, "configuration", void 0);
__decorate([Factory(DEFAULT_BUCKET), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], Persistence.prototype, "getDefaultBucket", null);
__decorate([PostInject(), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], Persistence.prototype, "init", null);

export { Bucket, DEFAULT_BUCKET, DEFAULT_BUCKET_CONFIGURATION, DEFAULT_STORAGE_OPTIONS, DefaultDrivers, DefaultSerializer, DefaultStorage, OnStorageChange, OnStorageLoad, Persistence, Storage, getDefaultStorageOptions, notifyStorageChange, notifyStorageLoad };
//# sourceMappingURL=index.es.js.map
