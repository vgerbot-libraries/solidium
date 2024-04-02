import { createComponent } from 'solid-js/web';
import { ClassMetadata, ApplicationContext, InstanceScope, Mark } from '@vgerbot/ioc';
import { createContext, createRoot, createSignal, createEffect, on, onCleanup, createMemo, untrack, batch, getOwner, runWithOwner, useContext } from 'solid-js';

const IS_MEMBER_DECORATOR_PROCESSOR = Symbol('solidium-is-member-decorator-processor');
const IS_CLASS_DECORATOR_PROCESSOR = Symbol('solidium-is-class-decorator-processor');

const SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY = Symbol('solidium-member-decorator-processors');
const SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY = Symbol('solidium-class-decorator-processors');
function beforeInstantiation(constructor) {
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
      if (markData == null || markData == undefined || typeof markData !== 'object' || !markData[IS_MEMBER_DECORATOR_PROCESSOR]) {
        return;
      }
      const processors = allMemberDecoratorProcessors.get(member) || new Set();
      allMemberDecoratorProcessors.set(member, processors);
      processors.add(markData);
    });
  });
  if (allClassDecoratorProcessor.size > 0) {
    Object.defineProperty(constructor, SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: allClassDecoratorProcessor
    });
    allClassDecoratorProcessor.forEach(processor => {
      processor.beforeInstantiation && processor.beforeInstantiation(constructor, metadata);
    });
  }
  if (allMemberDecoratorProcessors.size > 0) {
    Object.defineProperty(constructor, SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: allMemberDecoratorProcessors
    });
    allMemberDecoratorProcessors.forEach((processors, member) => {
      processors.forEach(processor => {
        if (processor.beforeInstantiation) {
          processor.beforeInstantiation(constructor, member, metadata);
        }
      });
    });
  }
}
function afterInstantiation(instance) {
  const constructor = instance.constructor;
  const metadata = ClassMetadata.getInstance(constructor).reader();
  if (SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY in constructor) {
    const allClassProcessors = constructor[SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY];
    allClassProcessors.forEach(processor => {
      const newInstance = processor.afterInstantiation && processor.afterInstantiation(instance, metadata);
      if (newInstance instanceof constructor) {
        instance = newInstance;
      }
    });
  }
  if (SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY in constructor) {
    const allMemberProcessors = constructor[SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY];
    allMemberProcessors.forEach((processors, member) => {
      processors.forEach(processor => {
        if (processor.afterInstantiation) {
          processor.afterInstantiation(instance, member, metadata);
        }
      });
    });
  }
  return instance;
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
  appCtx.registerBeforeInstantiationProcessor(beforeInstantiation);
  appCtx.registerAfterInstantiationProcessor(afterInstantiation);
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

const SETTER_INTERCEPTOR_MAP_KEY = Symbol('solidium-setter-interceptors-map');

const signalMap = new SignalMap();
const IS_SIGNAL_MEMBER_METADATA_KEY = 'is_signal_member_metadata_key';
function defineSignalMember(target, member, defaultValue) {
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
  Object.defineProperty(target, member, {
    get: function () {
      const [get] = signalMap.get(this, member, defaultValue);
      return get();
    },
    set: function (newValue) {
      const [get, set] = signalMap.get(this, member);
      const interceptorMap = target[SETTER_INTERCEPTOR_MAP_KEY];
      const interceptor = interceptorMap === null || interceptorMap === void 0 ? void 0 : interceptorMap.get(member);
      return set(interceptor ? interceptor.call(this, get(), newValue) : newValue);
    }
  });
}
function isSignalMember(target, member) {
  const extraDataOfMember = extraDataOf(target, member);
  return !!(extraDataOfMember === null || extraDataOfMember === void 0 ? void 0 : extraDataOfMember.get(IS_SIGNAL_MEMBER_METADATA_KEY));
}

const SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');
const Signal = Mark(SIGNAL_MARK_KEY, {
  [IS_MEMBER_DECORATOR_PROCESSOR]: true,
  beforeInstantiation: function (constructor, member) {
    defineSignalMember(constructor.prototype, member);
  }
});

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
  return Mark(OBSERVE_PROPERTY_MARK_KEY, {
    [IS_MEMBER_DECORATOR_PROCESSOR]: true,
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
const Computed = Mark(COMPUTED_GETTER_MARK_KEY, {
  [IS_MEMBER_DECORATOR_PROCESSOR]: true,
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
const Batch = Mark(BATCH_METHOD_MARK_KEY, {
  [IS_MEMBER_DECORATOR_PROCESSOR]: true,
  afterInstantiation(instance, member, metadata) {
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

const SOLIDIUM_MARK_CLASS_AUTO = Symbol('solidium-mark-class-auto');
const Auto = Mark(SOLIDIUM_MARK_CLASS_AUTO, {
  [IS_CLASS_DECORATOR_PROCESSOR]: true,
  afterInstantiation(instance) {
    if (!instance || typeof instance !== 'object') {
      return instance;
    }
    const prototype = Object.getPrototypeOf(instance);
    const owner = getOwner();
    return new Proxy(instance, {
      get(target, p, receiver) {
        if (typeof prototype[p] === 'function') {
          return Reflect.get(target, p, receiver);
        }
        if (isSignalMember(prototype, p)) {
          delete target[p];
          return Reflect.get(target, p, receiver);
        }
        runWithOwner(owner, () => {
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

export { Auto, Batch, Computed, IS_CLASS_DECORATOR_PROCESSOR, IS_MEMBER_DECORATOR_PROCESSOR, Observe, Signal, Solidium, Track, resultOf, useApplicationContext, useComputed, useService };
//# sourceMappingURL=index.es.js.map
