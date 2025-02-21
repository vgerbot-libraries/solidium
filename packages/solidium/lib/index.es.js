import { ClassMetadata, Scope, Lifecycle, ApplicationContext, InstanceScope, Mark } from '@vgerbot/ioc';
import { getOwner, runWithOwner, onCleanup, createContext, createRoot, createSignal, createEffect, on, createMemo, untrack, batch, useContext } from 'solid-js';
import { createComponent } from 'solid-js/web';

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
  const metadata = ClassMetadata.getInstance(constructor).reader();
  const classMarkInfo = metadata.getCtorMarkInfo();
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
    (_a = processor.beforeInstantiation) === null || _a === undefined ? undefined : _a.call(processor, constructor, metadata, container);
  });
}
function initMemberDecoratorProcessorsSet(constructor, container) {
  if (hasOwn(constructor, SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY)) {
    return;
  }
  const metadata = ClassMetadata.getInstance(constructor).reader();
  const instanceMembers = metadata.getAllMarkedMembers();
  const allMemberDecoratorProcessors = new Map();
  instanceMembers.forEach(member => {
    const markInfo = metadata.getMembersMarkInfo(member);
    if (!markInfo) {
      return;
    }
    const markInfoMembers = [...Object.getOwnPropertyNames(markInfo), ...Object.getOwnPropertySymbols(markInfo)];
    markInfoMembers.forEach(key => {
      const markData = markInfo[key];
      if (markData == null || typeof markData !== 'object' || !markData[IS_MEMBER_DECORATOR_PROCESSOR]) {
        return;
      }
      const processors = allMemberDecoratorProcessors.get(member) || new Set();
      allMemberDecoratorProcessors.set(member, processors);
      processors.add(markData);
    });
  });
  if (allMemberDecoratorProcessors.size === 0) {
    return;
  }
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
  const metadata = ClassMetadata.getInstance(constructor).reader();
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

const COMPONENT_TREE_SCOPE = 'solidium-component-tree-scope';
/**
 * 标记为 ComponentTreeScoped 的类，其不再是全局共享单实例，而是子组件共享单实例
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
    return (_b = (_a = solidOwner.instances) === null || _a === undefined ? undefined : _a.get(options.identifier)) === null || _b === undefined ? undefined : _b.instance;
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
      owner = (_a = owner.owner) === null || _a === undefined ? undefined : _a.owner;
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

const IoCContext = createContext();
class ServiceInstanceStatusManager {
  constructor() {
    this.store = new WeakMap();
  }
  record(cls) {
    this.store.set(cls, true);
  }
  isInstantiated(cls) {
    return this.store.has(cls);
  }
}
function Solidium(props) {
  var _a;
  const appCtx = new ApplicationContext();
  const manager = appCtx.getInstance(ServiceInstanceStatusManager);
  const originGetInstance = appCtx.getInstance;
  appCtx.getInstance = function (id, owner) {
    if (typeof id === 'function') {
      const metadata = ClassMetadata.getInstance(id).reader();
      if (metadata.getScope() === InstanceScope.TRANSIENT) {
        return originGetInstance.call(this, id, owner);
      }
      if (manager.isInstantiated(id)) {
        return originGetInstance.call(this, id, owner);
      }
    }
    const [dispose, instance] = createRoot(dispose => {
      return [dispose, originGetInstance.call(this, id, owner)];
    });
    this.onPreDestroy(() => {
      queueMicrotask(dispose);
    });
    return instance;
  };
  appCtx.registerBeforeInstantiationProcessor(function (constructor) {
    return beforeInstantiation(constructor, appCtx);
  });
  const owner = getOwner();
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
  (_a = props.autoRegisterClasses) === null || _a === undefined ? undefined : _a.forEach(cls => {
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
}

const extraDatas = new WeakMap();
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
  const hasGetter = !!(descriptor === null || descriptor === undefined ? undefined : descriptor.get);
  const hasSetter = !!(descriptor === null || descriptor === undefined ? undefined : descriptor.set);
  if (hasGetter || hasSetter) {
    return;
  }
  const _isSignalMember = isSignalMember(target, member);
  if (_isSignalMember) {
    return;
  }
  const extraDataOfMember = extraDataOf(target, member);
  extraDataOfMember === null || extraDataOfMember === undefined ? undefined : extraDataOfMember.set(IS_SIGNAL_MEMBER_METADATA_KEY, true);
  defaultValue = arguments.length === 3 ? defaultValue : descriptor === null || descriptor === undefined ? undefined : descriptor.value;
  const owner = getOwner();
  Object.defineProperty(target, member, {
    get: function () {
      const [get] = runWithOwner(owner, () => {
        return signalMap.get(this, member, defaultValue);
      });
      if (interceptors === null || interceptors === undefined ? undefined : interceptors.getter) {
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
      const setterInterceptor = interceptorMap === null || interceptorMap === undefined ? undefined : interceptorMap.get(member);
      if (setterInterceptor && (interceptors === null || interceptors === undefined ? undefined : interceptors.setter)) {
        interceptor = combineSetterInterceptor(setterInterceptor, interceptors.setter);
      } else {
        interceptor = setterInterceptor || (interceptors === null || interceptors === undefined ? undefined : interceptors.setter);
      }
      set(interceptor ? interceptor.call(this, get(), newValue) : newValue);
    }
  });
}
function isSignalMember(target, member) {
  const extraDataOfMember = extraDataOf(target, member);
  return !!(extraDataOfMember === null || extraDataOfMember === undefined ? undefined : extraDataOfMember.get(IS_SIGNAL_MEMBER_METADATA_KEY));
}
function getSignal(instance, member) {
  return signalMap.get(instance, member);
}

function defineMemberDecoratorProcessor(key, processor) {
  return Mark(key, Object.assign({
    [IS_MEMBER_DECORATOR_PROCESSOR]: true
  }, processor));
}

const SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Signal(_ = {}) {
  return defineMemberDecoratorProcessor(SIGNAL_MARK_KEY, {
    afterInstantiation(instance, member) {
      defineSignalMember(instance, member, instance[member]);
      return instance;
    }
  });
}

const RESULT_MAP = new SignalMap();
function store(instance, methodName, value) {
  const [, set] = RESULT_MAP.get(instance, methodName);
  set(value);
}
function clean(instance, methodName) {
  RESULT_MAP.delete(instance, methodName);
}
function resultOf(instance, methodName) {
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
        store(instance, methodName, ret);
        onCleanup(() => {
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
const Computed = defineMemberDecoratorProcessor(COMPUTED_GETTER_MARK_KEY, {
  afterInstantiation: (instance, member) => {
    const prototype = Object.getPrototypeOf(instance);
    const descriptor = Object.getOwnPropertyDescriptor(prototype, member);
    const originGetter = descriptor === null || descriptor === undefined ? undefined : descriptor.get;
    const hasGetter = !!originGetter;
    const hasSetter = !!(descriptor === null || descriptor === undefined ? undefined : descriptor.set);
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
      return (_a = descriptor === null || descriptor === undefined ? undefined : descriptor.get) === null || _a === undefined ? undefined : _a.call(instance);
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
const Track = fn => Mark(TRACK_METHOD_MARK_KEY, fn);

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

export { Auto, Batch, Computed, IS_CLASS_DECORATOR_PROCESSOR, IS_MEMBER_DECORATOR_PROCESSOR, Observe, SETTER_INTERCEPTOR_MAP_KEY, Signal, Solidium, Track, appendSetterInterceptor, defineClassDecoratorProcessor, defineMemberDecoratorProcessor, defineSignalMember, getSignal, isSignalMember, resultOf, useApplicationContext, useComputed, useService };
//# sourceMappingURL=index.es.js.map
