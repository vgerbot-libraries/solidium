(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@vgerbot/ioc'), require('solid-js'), require('solid-js/web'), require('solid-js/store')) :
    typeof define === 'function' && define.amd ? define(['exports', '@vgerbot/ioc', 'solid-js', 'solid-js/web', 'solid-js/store'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Solidium = {}, global.IOC, global.solidJs, global.web, global.store$1));
})(this, (function (exports, ioc, solidJs, web, store$1) { 'use strict';

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

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var COMPONENT_TREE_SCOPE = 'solidium-component-tree-scope';
    /**
     * Classes marked with ComponentTreeScope are no longer globally shared singletons,
     * but instead are singletons shared among child components within a component tree.
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
        return (_b = (_a = solidOwner.instances) === null || _a === void 0 ? void 0 : _a.get(options.identifier)) === null || _b === void 0 ? void 0 : _b.instance;
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
          owner = (_a = owner.owner) === null || _a === void 0 ? void 0 : _a.owner;
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
      var metadata = ioc.ClassMetadata.getInstance(constructor);
      var metadataReader = metadata.reader();
      var classMarkInfo = metadataReader.getCtorMarkInfo();
      var allClassDecoratorProcessor = new Set();
      if (classMarkInfo) {
        var classMarkInfoMembers = __spreadArray(__spreadArray([], __read(Object.getOwnPropertyNames(classMarkInfo)), false), __read(Object.getOwnPropertySymbols(classMarkInfo)), false);
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
        (_a = processor.beforeInstantiation) === null || _a === void 0 ? void 0 : _a.call(processor, constructor, metadata, container);
      });
    }
    function initMemberDecoratorProcessorsSet(constructor, container) {
      if (hasOwn(constructor, SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY)) {
        return;
      }
      var metadata = ioc.ClassMetadata.getInstance(constructor);
      var metadataReader = metadata.reader();
      var instanceMembers = metadataReader.getAllMarkedMembers();
      var allMemberDecoratorProcessors = new Map();
      instanceMembers.forEach(function (member) {
        var markInfo = metadataReader.getMembersMarkInfo(member);
        if (!markInfo) {
          return;
        }
        var markInfoMembers = __spreadArray(__spreadArray([], __read(Object.getOwnPropertyNames(markInfo)), false), __read(Object.getOwnPropertySymbols(markInfo)), false);
        markInfoMembers.forEach(function (key) {
          var markData = markInfo[key];
          if (markData == null || typeof markData !== 'object' || !markData[IS_MEMBER_DECORATOR_PROCESSOR]) {
            return;
          }
          var processors = allMemberDecoratorProcessors.get(member) || [];
          allMemberDecoratorProcessors.set(member, processors);
          processors.push(markData);
        });
      });
      if (allMemberDecoratorProcessors.size === 0) {
        return;
      }
      allMemberDecoratorProcessors.forEach(function (value) {
        value.sort(function (a, b) {
          var _a, _b;
          var priorityA = (_a = a.priority) !== null && _a !== void 0 ? _a : 0;
          var priorityB = (_b = b.priority) !== null && _b !== void 0 ? _b : 0;
          return priorityA > priorityB ? 1 : -1;
        });
      });
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
      var metadata = ioc.ClassMetadata.getInstance(constructor);
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
        var _a = __read(solidJs.createRoot(function (dispose) {
            return [dispose, originGetInstance.call(_this, id, instanceOwner)];
          }, owner), 2),
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
      (_a = props.autoRegisterClasses) === null || _a === void 0 ? void 0 : _a.forEach(function (cls) {
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
      SignalMap.prototype.has = function (object, key) {
        if (!this.store.has(object)) {
          return false;
        }
        var signalMap = this.store.get(object);
        if (!(signalMap === null || signalMap === void 0 ? void 0 : signalMap.has(key))) {
          return false;
        }
        return true;
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
      var hasGetter = !!(descriptor === null || descriptor === void 0 ? void 0 : descriptor.get);
      var hasSetter = !!(descriptor === null || descriptor === void 0 ? void 0 : descriptor.set);
      if (hasGetter || hasSetter) {
        return;
      }
      var _isSignalMember = isSignalMember(target, member);
      if (_isSignalMember) {
        return;
      }
      var extraDataOfMember = extraDataOf(target, member);
      extraDataOfMember === null || extraDataOfMember === void 0 ? void 0 : extraDataOfMember.set(IS_SIGNAL_MEMBER_METADATA_KEY, true);
      defaultValue = arguments.length === 3 ? defaultValue : descriptor === null || descriptor === void 0 ? void 0 : descriptor.value;
      var owner = solidJs.getOwner();
      Object.defineProperty(target, member, {
        get: function () {
          var _this = this;
          var _a = __read(solidJs.runWithOwner(owner, function () {
              return signalMap.get(_this, member, defaultValue);
            }), 1),
            get = _a[0];
          if (interceptors === null || interceptors === void 0 ? void 0 : interceptors.getter) {
            return interceptors.getter.call(this, get());
          }
          return get();
        },
        set: function (newValue) {
          var _this = this;
          var _a = __read(solidJs.runWithOwner(owner, function () {
              return signalMap.get(_this, member);
            }), 2),
            get = _a[0],
            set = _a[1];
          var interceptorMap = target[SETTER_INTERCEPTOR_MAP_KEY];
          var interceptor;
          var setterInterceptor = interceptorMap === null || interceptorMap === void 0 ? void 0 : interceptorMap.get(member);
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
      var extraDataOfMember = extraDataOf(target, member);
      return !!(extraDataOfMember === null || extraDataOfMember === void 0 ? void 0 : extraDataOfMember.get(IS_SIGNAL_MEMBER_METADATA_KEY));
    }
    function getSignal(instance, member, initializeValue) {
      return signalMap.get(instance, member, initializeValue);
    }
    function hasSignal(instance, member) {
      return signalMap.has(instance, member);
    }

    function defineMemberDecoratorProcessor(key, processor) {
      var _a;
      return ioc.Mark(key, __assign((_a = {}, _a[IS_MEMBER_DECORATOR_PROCESSOR] = true, _a), processor));
    }

    var SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');
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
    function Signal(_) {
      return defineMemberDecoratorProcessor(SIGNAL_MARK_KEY, {
        priority: -1,
        afterInstantiation: function (instance, member) {
          defineSignalMember(instance, member, instance[member]);
          return instance;
        }
      });
    }

    var RESULT_MAP = new SignalMap();
    function store(instance, methodName, value) {
      var _a = __read(RESULT_MAP.get(instance, methodName), 2),
        set = _a[1];
      set(value);
    }
    function clean(instance, methodName) {
      RESULT_MAP.delete(instance, methodName);
    }
    function resultOf(instance, methodName) {
      var _a = __read(RESULT_MAP.get(instance, methodName), 1),
        get = _a[0];
      return get();
    }

    var OBSERVE_PROPERTY_MARK_KEY = Symbol('solidium_observed_property');
    /**
     *
     * @param options optional
     * @returns an method decorator
     */
    function Observe(options) {
      if (options === void 0) {
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
      var _a = __read(solidJs.createSignal(NOT_CHANGED_SYMBOL), 2),
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
    var Computed = defineMemberDecoratorProcessor(COMPUTED_GETTER_MARK_KEY, {
      afterInstantiation: function (instance, member) {
        var prototype = Object.getPrototypeOf(instance);
        var descriptor = Object.getOwnPropertyDescriptor(prototype, member);
        var originGetter = descriptor === null || descriptor === void 0 ? void 0 : descriptor.get;
        var hasGetter = !!originGetter;
        var hasSetter = !!(descriptor === null || descriptor === void 0 ? void 0 : descriptor.set);
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
          return (_a = descriptor === null || descriptor === void 0 ? void 0 : descriptor.get) === null || _a === void 0 ? void 0 : _a.call(instance);
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

    var SOLIDIUM_MARK_CLASS_STORE = Symbol('solidium-mark-class-store');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var proxyCache = new WeakMap();
    var Store = function () {
      return defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_STORE, {
        afterInstantiation: function (instance) {
          if (!instance || typeof instance !== 'object') {
            return instance;
          }
          var _a = __read(store$1.createStore(instance), 2),
            object = _a[0],
            set = _a[1];
          var createProxyForNestedObject = function (obj, path, setter) {
            if (path === void 0) {
              path = [];
            }
            if (setter === void 0) {
              setter = set;
            }
            if (proxyCache.has(obj)) {
              return proxyCache.get(obj);
            }
            var proxy = new Proxy(obj, {
              get: function (target, p, receiver) {
                var value = Reflect.get(target, p, receiver);
                if (!!value && typeof value === 'object') {
                  return createProxyForNestedObject(value, __spreadArray(__spreadArray([], __read(path), false), [p], false), setter);
                }
                return value;
              },
              set: function (target, p, newValue) {
                if (path.length === 0) {
                  setter(p, newValue);
                } else {
                  setter.apply(void 0, __spreadArray(__spreadArray([], __read(path), false), [p, newValue], false));
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

    var SETTER_INTERCEPTOR_METHOD_MARK_KEY = Symbol('solidium_setter_interceptor_method');
    var SetterInterceptor = function (options) {
      switch (typeof options) {
        case 'string':
        case 'symbol':
          options = {
            key: options
          };
          break;
      }
      return defineMemberDecoratorProcessor(SETTER_INTERCEPTOR_METHOD_MARK_KEY, {
        beforeInstantiation: function (constructor, member) {
          appendSetterInterceptor(constructor.prototype, options, member);
        }
      });
    };

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
    exports.SetterInterceptor = SetterInterceptor;
    exports.Signal = Signal;
    exports.Solidium = Solidium;
    exports.Store = Store;
    exports.Track = Track;
    exports.Tracker = Tracker;
    exports.appendSetterInterceptor = appendSetterInterceptor;
    exports.defineClassDecoratorProcessor = defineClassDecoratorProcessor;
    exports.defineMemberDecoratorProcessor = defineMemberDecoratorProcessor;
    exports.defineSignalMember = defineSignalMember;
    exports.getSignal = getSignal;
    exports.hasSignal = hasSignal;
    exports.isSignalMember = isSignalMember;
    exports.resultOf = resultOf;
    exports.runWithSolidiumOwner = runWithSolidiumOwner;
    exports.useApplicationContext = useApplicationContext;
    exports.useComputed = useComputed;
    exports.useService = useService;

}));
//# sourceMappingURL=index.umd.js.map
