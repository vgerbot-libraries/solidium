'use strict';

var ioc = require('@vgerbot/ioc');
var solidJs = require('solid-js');
var web = require('solid-js/web');

var COMPONENT_TREE_SCOPE = 'solidium-component-tree-scope';
/**
 * 标记为 ComponentTreeScoped 的类，其不再是全局共享单实例，而是子组件共享单实例
 */
ioc.Scope(COMPONENT_TREE_SCOPE);

var instanceSerialNo = -1;
var InstanceWrapper = /** @class */function () {
  function InstanceWrapper(instance) {
    this.instance = instance;
    this.serialNo = ++instanceSerialNo;
  }
  InstanceWrapper.prototype.compareTo = function (other) {
    return this.serialNo > other.serialNo ? -1 : this.serialNo < other.serialNo ? 1 : 0;
  };
  return InstanceWrapper;
}();

var ComponentTreeScopeInstanceResolution = /** @class */function () {
  function ComponentTreeScopeInstanceResolution() {
    this.allInstances = [];
  }
  ComponentTreeScopeInstanceResolution.prototype.shouldGenerate = function (options) {
    var solidOwner = this.getParentSolidOwner(options.identifier);
    return !solidOwner;
  };
  ComponentTreeScopeInstanceResolution.prototype.saveInstance = function (options) {
    var _this = this;
    var owner = solidJs.getOwner();
    if (!owner) {
      return;
    }
    if (!owner.instances) {
      owner.instances = new Map();
    }
    var wrapper = new InstanceWrapper(options.instance);
    this.allInstances.push(wrapper);
    owner.instances.set(options.identifier, wrapper);
    solidJs.runWithOwner(owner, function () {
      solidJs.onCleanup(function () {
        _this.invokeInstancePreDestroy(wrapper.instance);
        var index = _this.allInstances.indexOf(wrapper);
        if (index > -1) {
          _this.allInstances.splice(index, 1);
        }
      });
    });
  };
  ComponentTreeScopeInstanceResolution.prototype.getInstance = function (options) {
    var _a, _b;
    var solidOwner = this.getParentSolidOwner(options.identifier);
    if (!solidOwner) {
      return;
    }
    return (_b = (_a = solidOwner.instances) === null || _a === undefined ? undefined : _a.get(options.identifier)) === null || _b === undefined ? undefined : _b.instance;
  };
  ComponentTreeScopeInstanceResolution.prototype.destroy = function () {
    var _this = this;
    this.allInstances.sort(function (a, b) {
      return a.compareTo(b);
    });
    this.allInstances.forEach(function (wrapper) {
      _this.invokeInstancePreDestroy(wrapper.instance);
    });
    this.allInstances.length = 0;
  };
  ComponentTreeScopeInstanceResolution.prototype.invokeInstancePreDestroy = function (instance) {
    var classMetadata = ioc.ClassMetadata.getInstance(instance.constructor);
    var preDestroyMethods = classMetadata.getMethods(ioc.Lifecycle.PRE_DESTROY);
    preDestroyMethods.forEach(function (methodName) {
      var method = instance[methodName];
      if (typeof method === 'function') {
        method.call(instance);
      }
    });
  };
  ComponentTreeScopeInstanceResolution.prototype.getParentSolidOwner = function (identifier) {
    var _a;
    var owner = solidJs.getOwner();
    while (!!owner && !!owner.instances) {
      var hasInstance = owner.instances.has(identifier);
      if (hasInstance) {
        return owner;
      }
      owner = (_a = owner.owner) === null || _a === undefined ? undefined : _a.owner;
    }
    return owner;
  };
  return ComponentTreeScopeInstanceResolution;
}();

var SOLIDIUM_SOLID_OWNER_PROPERTY_KEY = Symbol('solidium-solid-owner-property');
function runWithSolidiumOwner(instance, callback) {
  var owner = Reflect.get(instance, SOLIDIUM_SOLID_OWNER_PROPERTY_KEY);
  return solidJs.runWithOwner(owner, callback);
}
function setupOwner(instance, owner) {
  Reflect.set(instance, SOLIDIUM_SOLID_OWNER_PROPERTY_KEY, owner);
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

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var IS_MEMBER_DECORATOR_PROCESSOR = Symbol('solidium-is-member-decorator-processor');
var IS_CLASS_DECORATOR_PROCESSOR = Symbol('solidium-is-class-decorator-processor');

function hasOwn(object, propertyKey) {
  return Object.prototype.hasOwnProperty.call(object, propertyKey);
}

var SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY = Symbol('solidium-member-decorator-processors');
var SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY = Symbol('solidium-class-decorator-processors');
function initClassDecoratorProcessorsSet(constructor, container) {
  if (hasOwn(constructor, SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY)) {
    return;
  }
  var metadata = ioc.ClassMetadata.getInstance(constructor).reader();
  var classMarkInfo = metadata.getCtorMarkInfo();
  var allClassDecoratorProcessor = new Set();
  if (classMarkInfo) {
    var classMarkInfoMembers = __spreadArray(__spreadArray([], Object.getOwnPropertyNames(classMarkInfo), true), Object.getOwnPropertySymbols(classMarkInfo), true);
    classMarkInfoMembers.forEach(function (markInfoKey) {
      var processor = classMarkInfo[markInfoKey];
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
  allClassDecoratorProcessor.forEach(function (processor) {
    var _a;
    (_a = processor.beforeInstantiation) === null || _a === undefined ? undefined : _a.call(processor, constructor, metadata, container);
  });
}
function initMemberDecoratorProcessorsSet(constructor, container) {
  if (hasOwn(constructor, SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY)) {
    return;
  }
  var metadata = ioc.ClassMetadata.getInstance(constructor).reader();
  var instanceMembers = metadata.getAllMarkedMembers();
  var allMemberDecoratorProcessors = new Map();
  instanceMembers.forEach(function (member) {
    var markInfo = metadata.getMembersMarkInfo(member);
    if (!markInfo) {
      return;
    }
    var markInfoMembers = __spreadArray(__spreadArray([], Object.getOwnPropertyNames(markInfo), true), Object.getOwnPropertySymbols(markInfo), true);
    markInfoMembers.forEach(function (key) {
      var markData = markInfo[key];
      if (markData == null || typeof markData !== 'object' || !markData[IS_MEMBER_DECORATOR_PROCESSOR]) {
        return;
      }
      var processors = allMemberDecoratorProcessors.get(member) || new Set();
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
  allMemberDecoratorProcessors.forEach(function (processors, member) {
    processors.forEach(function (processor) {
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
  var constructor = instance.constructor;
  var metadata = ioc.ClassMetadata.getInstance(constructor).reader();
  var allClassProcessors = constructor[SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY];
  if (allClassProcessors) {
    allClassProcessors.forEach(function (processor) {
      var newInstance = processor.afterInstantiation && processor.afterInstantiation(instance, metadata, container);
      if (newInstance instanceof constructor) {
        instance = newInstance;
      }
    });
  }
  var allMemberProcessors = constructor[SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY];
  if (allMemberProcessors) {
    allMemberProcessors.forEach(function (processors, member) {
      processors.forEach(function (processor) {
        if (processor.afterInstantiation) {
          processor.afterInstantiation(instance, member, metadata, container);
        }
      });
    });
  }
  return instance;
}

var IoCContext = solidJs.createContext();
function Solidium(props) {
  var _a;
  var owner = solidJs.getOwner();
  var appCtx = new ioc.ApplicationContext();
  var IS_MANAGED = Symbol('IS_MANAGED');
  var originGetInstance = appCtx.getInstance;
  appCtx.getInstance = function (id, instanceOwner) {
    var _this = this;
    var _a = solidJs.createRoot(function (dispose) {
        return [dispose, originGetInstance.call(_this, id, instanceOwner)];
      }, owner),
      dispose = _a[0],
      instance = _a[1];
    if (instance !== null && typeof instance === 'object') {
      var isManaged = Reflect.getMetadata(IS_MANAGED, instance);
      if (isManaged) {
        dispose();
      } else {
        Reflect.defineMetadata(IS_MANAGED, true, instance);
      }
      var removeListener_1 = this.onPreDestroyThat(function (it) {
        if (it === instance) {
          dispose();
          removeListener_1();
        }
      });
    }
    return instance;
  };
  appCtx.registerBeforeInstantiationProcessor(function (constructor) {
    return beforeInstantiation(constructor, appCtx);
  });
  appCtx.registerAfterInstantiationProcessor(function (instance) {
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
  (_a = props.autoRegisterClasses) === null || _a === undefined ? undefined : _a.forEach(function (cls) {
    appCtx.getInstance(cls);
  });
  return web.createComponent(IoCContext.Provider, {
    value: appCtx,
    get children() {
      return props.children;
    }
  });
}

var SignalMap = /** @class */function () {
  function SignalMap() {
    this.store = new WeakMap();
  }
  SignalMap.prototype.get = function (object, key, initValue) {
    if (object === null || typeof object !== 'object') {
      throw new Error('');
    }
    var signalMap = this.store.get(object);
    if (!signalMap) {
      this.store.set(object, signalMap = new Map());
    }
    var signal = signalMap.get(key);
    if (!signal) {
      signalMap.set(key, signal = solidJs.createSignal(initValue));
    }
    return signal;
  };
  SignalMap.prototype.delete = function (object, key) {
    var signalMap = this.store.get(object);
    if (signalMap) {
      signalMap.delete(key);
    }
  };
  return SignalMap;
}();

var extraDatas = new WeakMap();
function extraDataOf(target, key) {
  if (!target || typeof target !== 'object') {
    return undefined;
  }
  if (!extraDatas.has(target)) {
    extraDatas.set(target, new Map());
  }
  var metadata = extraDatas.get(target);
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

var SETTER_INTERCEPTOR_MAP_KEY = Symbol('solidium-setter-interceptors-map');
function appendSetterInterceptor(target, options, interceptorMethodName) {
  var interceptorsMap = target[SETTER_INTERCEPTOR_MAP_KEY];
  if (!interceptorsMap) {
    interceptorsMap = new Map();
    Object.defineProperty(target, SETTER_INTERCEPTOR_MAP_KEY, {
      value: interceptorsMap,
      enumerable: false,
      writable: false,
      configurable: false
    });
  }
  var leftInterceptor = interceptorsMap.get(options.key);
  var newInterceptor = combineSetterInterceptor(leftInterceptor,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  target[interceptorMethodName]);
  interceptorsMap.set(options.key, newInterceptor);
}

var signalMap = new SignalMap();
var IS_SIGNAL_MEMBER_METADATA_KEY = 'is_signal_member_metadata_key';
function defineSignalMember(target, member, defaultValue, interceptors) {
  var descriptor = Object.getOwnPropertyDescriptor(target, member);
  var hasGetter = !!(descriptor === null || descriptor === undefined ? undefined : descriptor.get);
  var hasSetter = !!(descriptor === null || descriptor === undefined ? undefined : descriptor.set);
  if (hasGetter || hasSetter) {
    return;
  }
  var _isSignalMember = isSignalMember(target, member);
  if (_isSignalMember) {
    return;
  }
  var extraDataOfMember = extraDataOf(target, member);
  extraDataOfMember === null || extraDataOfMember === undefined ? undefined : extraDataOfMember.set(IS_SIGNAL_MEMBER_METADATA_KEY, true);
  defaultValue = arguments.length === 3 ? defaultValue : descriptor === null || descriptor === undefined ? undefined : descriptor.value;
  var owner = solidJs.getOwner();
  Object.defineProperty(target, member, {
    get: function () {
      var _this = this;
      var get = solidJs.runWithOwner(owner, function () {
        return signalMap.get(_this, member, defaultValue);
      })[0];
      if (interceptors === null || interceptors === undefined ? undefined : interceptors.getter) {
        return interceptors.getter.call(this, get());
      }
      return get();
    },
    set: function (newValue) {
      var _this = this;
      var _a = solidJs.runWithOwner(owner, function () {
          return signalMap.get(_this, member);
        }),
        get = _a[0],
        set = _a[1];
      var interceptorMap = target[SETTER_INTERCEPTOR_MAP_KEY];
      var interceptor;
      var setterInterceptor = interceptorMap === null || interceptorMap === undefined ? undefined : interceptorMap.get(member);
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
  var extraDataOfMember = extraDataOf(target, member);
  return !!(extraDataOfMember === null || extraDataOfMember === undefined ? undefined : extraDataOfMember.get(IS_SIGNAL_MEMBER_METADATA_KEY));
}
function getSignal(instance, member) {
  return signalMap.get(instance, member);
}

function defineMemberDecoratorProcessor(key, processor) {
  var _a;
  return ioc.Mark(key, __assign((_a = {}, _a[IS_MEMBER_DECORATOR_PROCESSOR] = true, _a), processor));
}

var SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Signal(_) {
  return defineMemberDecoratorProcessor(SIGNAL_MARK_KEY, {
    afterInstantiation: function (instance, member) {
      defineSignalMember(instance, member, instance[member]);
      return instance;
    }
  });
}

var RESULT_MAP = new SignalMap();
function store(instance, methodName, value) {
  var _a = RESULT_MAP.get(instance, methodName),
    set = _a[1];
  set(value);
}
function clean(instance, methodName) {
  RESULT_MAP.delete(instance, methodName);
}
function resultOf(instance, methodName) {
  var get = RESULT_MAP.get(instance, methodName)[0];
  return get();
}

var OBSERVE_PROPERTY_MARK_KEY = Symbol('solidium_observed_property');
/**
 *
 * @param options optional
 * @returns an method decorator
 */
function Observe(options) {
  if (options === undefined) {
    options = {};
  }
  return defineMemberDecoratorProcessor(OBSERVE_PROPERTY_MARK_KEY, {
    afterInstantiation: function (instance, methodName) {
      // TODO: supports scheduling
      var fn = function () {
        var ret = instance[methodName].call(instance);
        store(instance, methodName, ret);
        solidJs.onCleanup(function () {
          clean(instance, methodName);
        });
      };
      if ('deps' in options) {
        solidJs.createEffect(solidJs.on(options.deps, fn, {
          defer: options.defer
        }));
      } else {
        solidJs.createEffect(fn);
      }
      return instance;
    }
  });
}

var NOT_CHANGED_SYMBOL = Symbol('solidium-not-change-symbol');
function useComputed(fn) {
  var _a = solidJs.createSignal(NOT_CHANGED_SYMBOL),
    get = _a[0],
    emitChange = _a[1];
  var getter = solidJs.createMemo(function () {
    var v = get();
    if (v != NOT_CHANGED_SYMBOL) {
      return fn();
    }
    return NOT_CHANGED_SYMBOL;
  });
  return function () {
    if (solidJs.untrack(get) == NOT_CHANGED_SYMBOL) {
      emitChange(null);
    }
    return getter();
  };
}

var COMPUTED_GETTER_MARK_KEY = Symbol('solidium_computed_getter');
var Computed = defineMemberDecoratorProcessor(COMPUTED_GETTER_MARK_KEY, {
  afterInstantiation: function (instance, member) {
    var prototype = Object.getPrototypeOf(instance);
    var descriptor = Object.getOwnPropertyDescriptor(prototype, member);
    var originGetter = descriptor === null || descriptor === undefined ? undefined : descriptor.get;
    var hasGetter = !!originGetter;
    var hasSetter = !!(descriptor === null || descriptor === undefined ? undefined : descriptor.set);
    if (!hasGetter) {
      // WARNING
      return instance;
    }
    if (hasSetter) {
      // WARNING
      return instance;
    }
    var getter = useComputed(function () {
      var _a;
      return (_a = descriptor === null || descriptor === undefined ? undefined : descriptor.get) === null || _a === undefined ? undefined : _a.call(instance);
    });
    Object.defineProperty(instance, member, __assign(__assign({}, descriptor), {
      get: getter
    }));
    return instance;
  }
});

var BATCH_METHOD_MARK_KEY = Symbol('solidium-batch-method-mark-key');
var Batch = defineMemberDecoratorProcessor(BATCH_METHOD_MARK_KEY, {
  afterInstantiation: function (instance, member) {
    var origin = instance[member];
    if (typeof origin !== 'function') {
      return;
    }
    var batchFn = solidJs.batch(function () {
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      return origin.apply(instance, args);
    });
    Object.defineProperty(instance, member, {
      enumerable: false,
      writable: true,
      value: batchFn
    });
  }
});

var TRACK_METHOD_MARK_KEY = Symbol('solidium_track_method');
function Track(fn) {
  return ioc.Mark(TRACK_METHOD_MARK_KEY, fn);
}

function defineClassDecoratorProcessor(key, processor) {
  var _a;
  return ioc.Mark(key, __assign((_a = {}, _a[IS_CLASS_DECORATOR_PROCESSOR] = true, _a), processor));
}

var SOLIDIUM_MARK_CLASS_AUTO = Symbol('solidium-mark-class-auto');
var Auto = defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_AUTO, {
  afterInstantiation: function (instance) {
    if (!instance || typeof instance !== 'object') {
      return instance;
    }
    var prototype = Object.getPrototypeOf(instance);
    return new Proxy(instance, {
      get: function (target, p, receiver) {
        if (typeof prototype[p] === 'function') {
          return Reflect.get(target, p, receiver);
        }
        if (isSignalMember(prototype, p)) {
          delete target[p];
          return Reflect.get(target, p, receiver);
        }
        runWithSolidiumOwner(target, function () {
          defineSignalMember(prototype, p, target[p]);
          delete target[p];
        });
        return Reflect.get(target, p, receiver);
      },
      set: function (target, p, newValue, receiver) {
        return Reflect.set(target, p, newValue, receiver);
      }
    });
  }
});

var MissingSolidiumContextError = /** @class */function (_super) {
  __extends(MissingSolidiumContextError, _super);
  function MissingSolidiumContextError() {
    var _this = _super.call(this, '<Solidium> not found. Please ensure it is added to the parent node.') || this;
    _this.name = 'MissingSolidiumContextError';
    return _this;
  }
  return MissingSolidiumContextError;
}(Error);

function useApplicationContext() {
  var context = solidJs.useContext(IoCContext);
  if (!context) {
    throw new MissingSolidiumContextError();
  }
  return context;
}

function useService(cls) {
  var context = useApplicationContext();
  var instance = context.getInstance(cls);
  var metadata = ioc.ClassMetadata.getInstance(cls).reader();
  var scope = metadata.getScope();
  if (scope === ioc.InstanceScope.TRANSIENT) {
    solidJs.onCleanup(function () {
      context.destroyTransientInstance(instance);
    });
  }
  return instance;
}

var Tracker = /** @class */function () {
  function Tracker() {}
  Tracker.prototype.track = function (callback) {
    return runWithSolidiumOwner(this, function () {
      var dispose;
      solidJs.createRoot(function (_dispose) {
        dispose = _dispose;
        solidJs.createEffect(function () {
          callback(_dispose);
        });
      }, solidJs.getOwner());
      return dispose;
    });
  };
  Tracker.prototype.until = function (contition) {
    var _this = this;
    return new Promise(function (resolve) {
      _this.track(function (dispose) {
        if (contition()) {
          resolve();
          dispose();
        }
      });
    });
  };
  return Tracker;
}();

exports.Auto = Auto;
exports.Batch = Batch;
exports.Computed = Computed;
exports.IS_CLASS_DECORATOR_PROCESSOR = IS_CLASS_DECORATOR_PROCESSOR;
exports.IS_MEMBER_DECORATOR_PROCESSOR = IS_MEMBER_DECORATOR_PROCESSOR;
exports.Observe = Observe;
exports.SETTER_INTERCEPTOR_MAP_KEY = SETTER_INTERCEPTOR_MAP_KEY;
exports.Signal = Signal;
exports.Solidium = Solidium;
exports.Track = Track;
exports.Tracker = Tracker;
exports.appendSetterInterceptor = appendSetterInterceptor;
exports.defineClassDecoratorProcessor = defineClassDecoratorProcessor;
exports.defineMemberDecoratorProcessor = defineMemberDecoratorProcessor;
exports.defineSignalMember = defineSignalMember;
exports.getSignal = getSignal;
exports.isSignalMember = isSignalMember;
exports.resultOf = resultOf;
exports.runWithSolidiumOwner = runWithSolidiumOwner;
exports.useApplicationContext = useApplicationContext;
exports.useComputed = useComputed;
exports.useService = useService;
//# sourceMappingURL=index.cjs.js.map
