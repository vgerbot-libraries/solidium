import { Scope, ClassMetadata, Lifecycle, ApplicationContext, Mark, InstanceScope } from '@vgerbot/ioc';
import { getOwner, runWithOwner, onCleanup, createContext, createRoot, createSignal, createEffect, on, createMemo, untrack, batch, useContext } from 'solid-js';
import { createComponent } from 'solid-js/web';
import { createStore } from 'solid-js/store';

const COMPONENT_TREE_SCOPE = 'solidium-component-tree-scope';
/**
 * Classes marked with ComponentTreeScope are no longer globally shared singletons,
 * but instead are singletons shared among child components within a component tree.
 */
Scope(COMPONENT_TREE_SCOPE);

let instanceSerialNo = -1;
class InstanceWrapper {
  constructor(instance) {
    this.instance = instance;
    this.serialNo = ++instanceSerialNo;
  }
  compareTo(other) {
    return this.serialNo > other.serialNo ? -1 : this.serialNo < other.serialNo ? 1 : 0;
  }
}

class ComponentTreeScopeInstanceResolution {
  constructor() {
    this.allInstances = [];
  }
  shouldGenerate(options) {
    const solidOwner = this.getParentSolidOwner(options.identifier);
    return !solidOwner;
  }
  saveInstance(options) {
    const owner = getOwner();
    if (!owner) {
      return;
    }
    if (!owner.instances) {
      owner.instances = new Map();
    }
    const wrapper = new InstanceWrapper(options.instance);
    this.allInstances.push(wrapper);
    owner.instances.set(options.identifier, wrapper);
    runWithOwner(owner, () => {
      onCleanup(() => {
        this.invokeInstancePreDestroy(wrapper.instance);
        const index = this.allInstances.indexOf(wrapper);
        if (index > -1) {
          this.allInstances.splice(index, 1);
        }
      });
    });
  }
  getInstance(options) {
    var _a, _b;
    const solidOwner = this.getParentSolidOwner(options.identifier);
    if (!solidOwner) {
      return;
    }
    return (_b = (_a = solidOwner.instances) === null || _a === void 0 ? void 0 : _a.get(options.identifier)) === null || _b === void 0 ? void 0 : _b.instance;
  }
  destroy() {
    this.allInstances.sort((a, b) => a.compareTo(b));
    this.allInstances.forEach(wrapper => {
      this.invokeInstancePreDestroy(wrapper.instance);
    });
    this.allInstances.length = 0;
  }
  invokeInstancePreDestroy(instance) {
    const classMetadata = ClassMetadata.getInstance(instance.constructor);
    const preDestroyMethods = classMetadata.getMethods(Lifecycle.PRE_DESTROY);
    preDestroyMethods.forEach(methodName => {
      const method = instance[methodName];
      if (typeof method === 'function') {
        method.call(instance);
      }
    });
  }
  getParentSolidOwner(identifier) {
    var _a;
    let owner = getOwner();
    while (!!owner && !!owner.instances) {
      const hasInstance = owner.instances.has(identifier);
      if (hasInstance) {
        return owner;
      }
      owner = (_a = owner.owner) === null || _a === void 0 ? void 0 : _a.owner;
    }
    return owner;
  }
}

const SOLIDIUM_SOLID_OWNER_PROPERTY_KEY = Symbol('solidium-solid-owner-property');
function runWithSolidiumOwner(instance, callback) {
  const owner = Reflect.get(instance, SOLIDIUM_SOLID_OWNER_PROPERTY_KEY);
  return runWithOwner(owner, callback);
}
function setupOwner(instance, owner) {
  Reflect.set(instance, SOLIDIUM_SOLID_OWNER_PROPERTY_KEY, owner);
}

const IS_MEMBER_DECORATOR_PROCESSOR = Symbol('solidium-is-member-decorator-processor');
const IS_CLASS_DECORATOR_PROCESSOR = Symbol('solidium-is-class-decorator-processor');

function hasOwn(object, propertyKey) {
  return Object.prototype.hasOwnProperty.call(object, propertyKey);
}

const SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY = Symbol('solidium-member-decorator-processors');
const SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY = Symbol('solidium-class-decorator-processors');
function initClassDecoratorProcessorsSet(constructor, container) {
  if (hasOwn(constructor, SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY)) {
    return;
  }
  const metadata = ClassMetadata.getInstance(constructor);
  const metadataReader = metadata.reader();
  const classMarkInfo = metadataReader.getCtorMarkInfo();
  const allClassDecoratorProcessor = new Set();
  if (classMarkInfo) {
    const classMarkInfoMembers = [...Object.getOwnPropertyNames(classMarkInfo), ...Object.getOwnPropertySymbols(classMarkInfo)];
    classMarkInfoMembers.forEach(markInfoKey => {
      const processor = classMarkInfo[markInfoKey];
      if (typeof processor !== 'object' || !processor[IS_CLASS_DECORATOR_PROCESSOR]) {
        return;
      }
      allClassDecoratorProcessor.add(processor);
    });
  }
  if (allClassDecoratorProcessor.size === 0) {
    return;
  }
  Object.defineProperty(constructor, SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: allClassDecoratorProcessor
  });
  allClassDecoratorProcessor.forEach(processor => {
    var _a;
    (_a = processor.beforeInstantiation) === null || _a === void 0 ? void 0 : _a.call(processor, constructor, metadata, container);
  });
}
function initMemberDecoratorProcessorsSet(constructor, container) {
  if (hasOwn(constructor, SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY)) {
    return;
  }
  const metadata = ClassMetadata.getInstance(constructor);
  const metadataReader = metadata.reader();
  const instanceMembers = metadataReader.getAllMarkedMembers();
  const allMemberDecoratorProcessors = new Map();
  instanceMembers.forEach(member => {
    const markInfo = metadataReader.getMembersMarkInfo(member);
    if (!markInfo) {
      return;
    }
    const markInfoMembers = [...Object.getOwnPropertyNames(markInfo), ...Object.getOwnPropertySymbols(markInfo)];
    markInfoMembers.forEach(key => {
      const markData = markInfo[key];
      if (markData == null || typeof markData !== 'object' || !markData[IS_MEMBER_DECORATOR_PROCESSOR]) {
        return;
      }
      const processors = allMemberDecoratorProcessors.get(member) || [];
      allMemberDecoratorProcessors.set(member, processors);
      processors.push(markData);
    });
  });
  if (allMemberDecoratorProcessors.size === 0) {
    return;
  }
  allMemberDecoratorProcessors.forEach(value => {
    value.sort((a, b) => {
      var _a, _b;
      const priorityA = (_a = a.priority) !== null && _a !== void 0 ? _a : 0;
      const priorityB = (_b = b.priority) !== null && _b !== void 0 ? _b : 0;
      return priorityA > priorityB ? 1 : -1;
    });
  });
  Object.defineProperty(constructor, SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: allMemberDecoratorProcessors
  });
  allMemberDecoratorProcessors.forEach((processors, member) => {
    processors.forEach(processor => {
      if (processor.beforeInstantiation) {
        processor.beforeInstantiation(constructor, member, metadata, container);
      }
    });
  });
}
function beforeInstantiation(constructor, container) {
  initClassDecoratorProcessorsSet(constructor, container);
  initMemberDecoratorProcessorsSet(constructor, container);
}
function afterInstantiation(instance, container) {
  const constructor = instance.constructor;
  const metadata = ClassMetadata.getInstance(constructor);
  const allClassProcessors = constructor[SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY];
  if (allClassProcessors) {
    allClassProcessors.forEach(processor => {
      const newInstance = processor.afterInstantiation && processor.afterInstantiation(instance, metadata, container);
      if (newInstance instanceof constructor) {
        instance = newInstance;
      }
    });
  }
  const allMemberProcessors = constructor[SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY];
  if (allMemberProcessors) {
    allMemberProcessors.forEach((processors, member) => {
      processors.forEach(processor => {
        if (processor.afterInstantiation) {
          processor.afterInstantiation(instance, member, metadata, container);
        }
      });
    });
  }
  return instance;
}

const IoCContext = createContext();
function Solidium(props) {
  var _a;
  const owner = getOwner();
  const appCtx = new ApplicationContext();
  const IS_MANAGED = Symbol('IS_MANAGED');
  const originGetInstance = appCtx.getInstance;
  appCtx.getInstance = function (id, instanceOwner) {
    const [dispose, instance] = createRoot(dispose => {
      return [dispose, originGetInstance.call(this, id, instanceOwner)];
    }, owner);
    if (instance !== null && typeof instance === 'object') {
      const isManaged = Reflect.getMetadata(IS_MANAGED, instance);
      if (isManaged) {
        dispose();
      } else {
        Reflect.defineMetadata(IS_MANAGED, true, instance);
      }
      const removeListener = this.onPreDestroyThat(it => {
        if (it === instance) {
          dispose();
          removeListener();
        }
      });
    }
    return instance;
  };
  appCtx.registerBeforeInstantiationProcessor(function (constructor) {
    return beforeInstantiation(constructor, appCtx);
  });
  appCtx.registerAfterInstantiationProcessor(instance => {
    setupOwner(instance, owner);
    return instance;
  });
  appCtx.registerAfterInstantiationProcessor(function (instance) {
    return afterInstantiation(instance, appCtx);
  });
  appCtx.registerInstanceScopeResolution(COMPONENT_TREE_SCOPE, ComponentTreeScopeInstanceResolution);
  if (typeof props.init === 'function') {
    props.init(appCtx);
  }
  (_a = props.autoRegisterClasses) === null || _a === void 0 ? void 0 : _a.forEach(cls => {
    appCtx.getInstance(cls);
  });
  return createComponent(IoCContext.Provider, {
    value: appCtx,
    get children() {
      return props.children;
    }
  });
}

class SignalMap {
  constructor() {
    this.store = new WeakMap();
  }
  get(object, key, initValue) {
    if (object === null || typeof object !== 'object') {
      throw new Error('');
    }
    let signalMap = this.store.get(object);
    if (!signalMap) {
      this.store.set(object, signalMap = new Map());
    }
    let signal = signalMap.get(key);
    if (!signal) {
      signalMap.set(key, signal = createSignal(initValue));
    }
    return signal;
  }
  delete(object, key) {
    const signalMap = this.store.get(object);
    if (signalMap) {
      signalMap.delete(key);
    }
  }
  has(object, key) {
    if (!this.store.has(object)) {
      return false;
    }
    const signalMap = this.store.get(object);
    if (!(signalMap === null || signalMap === void 0 ? void 0 : signalMap.has(key))) {
      return false;
    }
    return true;
  }
}

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
const extraDatas = new WeakMap();
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
function extraDataOf(target, key) {
  if (!target || typeof target !== 'object') {
    return undefined;
  }
  if (!extraDatas.has(target)) {
    extraDatas.set(target, new Map());
  }
  const metadata = extraDatas.get(target);
  if (!metadata) {
    throw new Error('Will never happen');
  }
  if (!metadata.has(key)) {
    metadata.set(key, new Map());
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return metadata.get(key);
}

function combineSetterInterceptor(before, after) {
  if (typeof before !== 'function') {
    return after;
  }
  return function (oldValue, newValue) {
    return after.call(this, oldValue, before.call(this, oldValue, newValue));
  };
}

const SETTER_INTERCEPTOR_MAP_KEY = Symbol('solidium-setter-interceptors-map');
function appendSetterInterceptor(target, options, interceptorMethodName) {
  let interceptorsMap = target[SETTER_INTERCEPTOR_MAP_KEY];
  if (!interceptorsMap) {
    interceptorsMap = new Map();
    Object.defineProperty(target, SETTER_INTERCEPTOR_MAP_KEY, {
      value: interceptorsMap,
      enumerable: false,
      writable: false,
      configurable: false
    });
  }
  const leftInterceptor = interceptorsMap.get(options.key);
  const newInterceptor = combineSetterInterceptor(leftInterceptor,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target[interceptorMethodName]);
  interceptorsMap.set(options.key, newInterceptor);
}

const signalMap = new SignalMap();
const IS_SIGNAL_MEMBER_METADATA_KEY = 'is_signal_member_metadata_key';
function defineSignalMember(target, member, defaultValue, interceptors) {
  const descriptor = Object.getOwnPropertyDescriptor(target, member);
  const hasGetter = !!(descriptor === null || descriptor === void 0 ? void 0 : descriptor.get);
  const hasSetter = !!(descriptor === null || descriptor === void 0 ? void 0 : descriptor.set);
  if (hasGetter || hasSetter) {
    return;
  }
  const _isSignalMember = isSignalMember(target, member);
  if (_isSignalMember) {
    return;
  }
  const extraDataOfMember = extraDataOf(target, member);
  extraDataOfMember === null || extraDataOfMember === void 0 ? void 0 : extraDataOfMember.set(IS_SIGNAL_MEMBER_METADATA_KEY, true);
  defaultValue = arguments.length === 3 ? defaultValue : descriptor === null || descriptor === void 0 ? void 0 : descriptor.value;
  const owner = getOwner();
  Object.defineProperty(target, member, {
    get: function () {
      const [get] = runWithOwner(owner, () => {
        return signalMap.get(this, member, defaultValue);
      });
      if (interceptors === null || interceptors === void 0 ? void 0 : interceptors.getter) {
        return interceptors.getter.call(this, get());
      }
      return get();
    },
    set: function (newValue) {
      const [get, set] = runWithOwner(owner, () => {
        return signalMap.get(this, member);
      });
      const interceptorMap = target[SETTER_INTERCEPTOR_MAP_KEY];
      let interceptor;
      const setterInterceptor = interceptorMap === null || interceptorMap === void 0 ? void 0 : interceptorMap.get(member);
      if (setterInterceptor && (interceptors === null || interceptors === void 0 ? void 0 : interceptors.setter)) {
        interceptor = combineSetterInterceptor(setterInterceptor, interceptors.setter);
      } else {
        interceptor = setterInterceptor || (interceptors === null || interceptors === void 0 ? void 0 : interceptors.setter);
      }
      set(interceptor ? interceptor.call(this, get(), newValue) : newValue);
    }
  });
}
function isSignalMember(target, member) {
  const extraDataOfMember = extraDataOf(target, member);
  return !!(extraDataOfMember === null || extraDataOfMember === void 0 ? void 0 : extraDataOfMember.get(IS_SIGNAL_MEMBER_METADATA_KEY));
}
function getSignal(instance, member, initializeValue) {
  return signalMap.get(instance, member, initializeValue);
}
function hasSignal(instance, member) {
  return signalMap.has(instance, member);
}

function defineMemberDecoratorProcessor(key, processor) {
  return Mark(key, Object.assign({
    [IS_MEMBER_DECORATOR_PROCESSOR]: true
  }, processor));
}

const SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');
/**
 * Decorator that turns a class property into a reactive signal.
 *
 * When applied to a property, it replaces the property with a getter and a setter.
 * The first time the property is accessed, a SolidJS signal is created with the property's initial value.
 * Subsequent accesses will return the current value of the signal.
 * When the property is assigned a new value, the signal is updated.
 *
 * This allows other parts of the application, such as components or other reactive code,
 * to subscribe to changes in the property's value.
 *
 * Example usage:
 * ```typescript
 * class MyStore {
 *   @Signal()
 *   count = 0;
 * }
 *
 * const store = new MyStore();
 *
 * createEffect(() => {
 *   console.log('Count changed:', store.count);
 * });
 *
 * store.count = 1; // This will trigger the effect and log the new value.
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Signal(_ = {}) {
  return defineMemberDecoratorProcessor(SIGNAL_MARK_KEY, {
    priority: -1,
    afterInstantiation(instance, member) {
      defineSignalMember(instance, member, instance[member]);
      return instance;
    }
  });
}

const RESULT_MAP = new SignalMap();
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
function store(instance, methodName, value) {
  const [, set] = RESULT_MAP.get(instance, methodName);
  set(value);
}
// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
function clean(instance, methodName) {
  RESULT_MAP.delete(instance, methodName);
}
function resultOf(instance, methodName) {
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  const [get] = RESULT_MAP.get(instance, methodName);
  return get();
}

const OBSERVE_PROPERTY_MARK_KEY = Symbol('solidium_observed_property');
/**
 *
 * @param options optional
 * @returns an method decorator
 */
function Observe(options = {}) {
  return defineMemberDecoratorProcessor(OBSERVE_PROPERTY_MARK_KEY, {
    afterInstantiation(instance, methodName) {
      // TODO: supports scheduling
      const fn = () => {
        const ret = instance[methodName].call(instance);
        // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
        store(instance, methodName, ret);
        onCleanup(() => {
          // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
          clean(instance, methodName);
        });
      };
      if ('deps' in options) {
        createEffect(on(options.deps, fn, {
          defer: options.defer
        }));
      } else {
        createEffect(fn);
      }
      return instance;
    }
  });
}

const NOT_CHANGED_SYMBOL = Symbol('solidium-not-change-symbol');
/**
 * Creates a new memoized computation that is lazily evaluated.
 *
 * Unlike `createMemo` from `solid-js`, the computation function `fn` is not
 * executed until the returned getter is accessed for the first time. After the
 * initial access, it behaves like a standard memo, re-computing its value
 * only when its dependencies change.
 *
 * @param fn The computation function to be memoized. It should not take any
 *   arguments and should return a value of type T.
 * @returns A getter function that returns the memoized value. Accessing this
 *   getter tracks the computation in the current reactive context.
 *
 * @example
 * ```ts
 * const [count, setCount] = createSignal(0);
 * const doubleCount = useComputed(() => {
 *   console.log('Computing doubleCount...');
 *   return count() * 2;
 * });
 *
 * // At this point, 'Computing doubleCount...' has not been logged yet.
 *
 * console.log(doubleCount()); // Logs 'Computing doubleCount...' and then 0
 * console.log(doubleCount()); // Logs 0, no re-computation
 *
 * setCount(5);
 * console.log(doubleCount()); // Logs 'Computing doubleCount...' and then 10
 * ```
 */
function useComputed(fn) {
  const [get, emitChange] = createSignal(NOT_CHANGED_SYMBOL);
  const getter = createMemo(() => {
    const v = get();
    if (v != NOT_CHANGED_SYMBOL) {
      return fn();
    }
    return NOT_CHANGED_SYMBOL;
  });
  return function () {
    if (untrack(get) == NOT_CHANGED_SYMBOL) {
      emitChange(null);
    }
    return getter();
  };
}

const COMPUTED_GETTER_MARK_KEY = Symbol('solidium_computed_getter');
/**
 * A property decorator that transforms a class getter into a memoized,
 * lazily-evaluated computed property.
 *
 * The decorated getter will be converted into a `solid-js` memo under the hood,
 * but it will not be evaluated until it's accessed for the first time.
 * Once evaluated, its value is cached and will only be re-calculated when its
 * underlying reactive dependencies change.
 *
 * This decorator should only be applied to getter methods without a corresponding
 * setter.
 *
 * @example
 * ```ts
 * class MyStore {
 *   @Signal
 *   firstName = 'John';
 *
 *   @Signal
 *   lastName = 'Doe';
 *
 *   @Computed
 *   get fullName() {
 *     console.log('Computing fullName...');
 *     return `${this.firstName} ${this.lastName}`;
 *   }
 * }
 *
 * const store = useService(MyStore);
 * // At this point, 'Computing fullName...' has not been logged.
 *
 * console.log(store.fullName); // Logs 'Computing fullName...' and then 'John Doe'
 * console.log(store.fullName); // Logs 'John Doe' directly from cache.
 *
 * store.firstName = 'Jane';
 * // The value is now stale, but re-computation is deferred.
 *
 * console.log(store.fullName); // Logs 'Computing fullName...' and then 'Jane Doe'
 * ```
 */
const Computed = defineMemberDecoratorProcessor(COMPUTED_GETTER_MARK_KEY, {
  afterInstantiation: (instance, member) => {
    const prototype = Object.getPrototypeOf(instance);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, member);
    const originGetter = descriptor === null || descriptor === void 0 ? void 0 : descriptor.get;
    const hasGetter = !!originGetter;
    const hasSetter = !!(descriptor === null || descriptor === void 0 ? void 0 : descriptor.set);
    if (!hasGetter) {
      // WARNING
      return instance;
    }
    if (hasSetter) {
      // WARNING
      return instance;
    }
    const getter = useComputed(() => {
      var _a;
      return (_a = descriptor === null || descriptor === void 0 ? void 0 : descriptor.get) === null || _a === void 0 ? void 0 : _a.call(instance);
    });
    Object.defineProperty(instance, member, Object.assign(Object.assign({}, descriptor), {
      get: getter
    }));
    return instance;
  }
});

const BATCH_METHOD_MARK_KEY = Symbol('solidium-batch-method-mark-key');
const Batch = defineMemberDecoratorProcessor(BATCH_METHOD_MARK_KEY, {
  afterInstantiation(instance, member) {
    const origin = instance[member];
    if (typeof origin !== 'function') {
      return;
    }
    const batchFn = batch((...args) => {
      return origin.apply(instance, args);
    });
    Object.defineProperty(instance, member, {
      enumerable: false,
      writable: true,
      value: batchFn
    });
  }
});

const TRACK_METHOD_MARK_KEY = Symbol('solidium_track_method');
function Track(fn) {
  return Mark(TRACK_METHOD_MARK_KEY, fn);
}

function defineClassDecoratorProcessor(key, processor) {
  return Mark(key, Object.assign({
    [IS_CLASS_DECORATOR_PROCESSOR]: true
  }, processor));
}

const SOLIDIUM_MARK_CLASS_AUTO = Symbol('solidium-mark-class-auto');
const Auto = defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_AUTO, {
  afterInstantiation(instance) {
    if (!instance || typeof instance !== 'object') {
      return instance;
    }
    const prototype = Object.getPrototypeOf(instance);
    return new Proxy(instance, {
      get(target, p, receiver) {
        if (typeof prototype[p] === 'function') {
          return Reflect.get(target, p, receiver);
        }
        if (isSignalMember(prototype, p)) {
          delete target[p];
          return Reflect.get(target, p, receiver);
        }
        runWithSolidiumOwner(target, () => {
          defineSignalMember(prototype, p, target[p]);
          delete target[p];
        });
        return Reflect.get(target, p, receiver);
      },
      set(target, p, newValue, receiver) {
        return Reflect.set(target, p, newValue, receiver);
      }
    });
  }
});

const SOLIDIUM_MARK_CLASS_STORE = Symbol('solidium-mark-class-store');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const proxyCache = new WeakMap();
const Store = () => {
  return defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_STORE, {
    afterInstantiation(instance) {
      if (!instance || typeof instance !== 'object') {
        return instance;
      }
      const [object, set] = createStore(instance);
      const createProxyForNestedObject = (obj, path = [], setter = set) => {
        if (proxyCache.has(obj)) {
          return proxyCache.get(obj);
        }
        const proxy = new Proxy(obj, {
          get(target, p, receiver) {
            const value = Reflect.get(target, p, receiver);
            if (!!value && typeof value === 'object') {
              return createProxyForNestedObject(value, [...path, p], setter);
            }
            return value;
          },
          set(target, p, newValue) {
            if (path.length === 0) {
              setter(p, newValue);
            } else {
              setter(...path, p, newValue);
            }
            return true;
          }
        });
        proxyCache.set(obj, proxy);
        return proxy;
      };
      return createProxyForNestedObject(object);
    }
  });
};

const SETTER_INTERCEPTOR_METHOD_MARK_KEY = Symbol('solidium_setter_interceptor_method');
const SetterInterceptor = options => {
  switch (typeof options) {
    case 'string':
    case 'symbol':
      options = {
        key: options
      };
      break;
  }
  return defineMemberDecoratorProcessor(SETTER_INTERCEPTOR_METHOD_MARK_KEY, {
    beforeInstantiation: (constructor, member) => {
      appendSetterInterceptor(constructor.prototype, options, member);
    }
  });
};

class MissingSolidiumContextError extends Error {
  constructor() {
    super('<Solidium> not found. Please ensure it is added to the parent node.');
    this.name = 'MissingSolidiumContextError';
  }
}

function useApplicationContext() {
  const context = useContext(IoCContext);
  if (!context) {
    throw new MissingSolidiumContextError();
  }
  return context;
}

function useService(cls) {
  const context = useApplicationContext();
  const instance = context.getInstance(cls);
  const metadata = ClassMetadata.getInstance(cls).reader();
  const scope = metadata.getScope();
  if (scope === InstanceScope.TRANSIENT) {
    onCleanup(() => {
      context.destroyTransientInstance(instance);
    });
  }
  return instance;
}

class Tracker {
  track(callback) {
    return runWithSolidiumOwner(this, () => {
      let dispose;
      createRoot(_dispose => {
        dispose = _dispose;
        createEffect(() => {
          callback(_dispose);
        });
      }, getOwner());
      return dispose;
    });
  }
  until(contition) {
    return new Promise(resolve => {
      this.track(dispose => {
        if (contition()) {
          resolve();
          dispose();
        }
      });
    });
  }
}

export { Auto, Batch, Computed, IS_CLASS_DECORATOR_PROCESSOR, IS_MEMBER_DECORATOR_PROCESSOR, Observe, SETTER_INTERCEPTOR_MAP_KEY, SetterInterceptor, Signal, Solidium, Store, Track, Tracker, appendSetterInterceptor, defineClassDecoratorProcessor, defineMemberDecoratorProcessor, defineSignalMember, getSignal, hasSignal, isSignalMember, resultOf, runWithSolidiumOwner, useApplicationContext, useComputed, useService };
//# sourceMappingURL=index.es.js.map
