(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('solid-js/web'), require('@vgerbot/ioc'), require('solid-js')) :
    typeof define === 'function' && define.amd ? define(['exports', 'solid-js/web', '@vgerbot/ioc', 'solid-js'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Solidium = {}, global.web, global.ioc, global.solidJs));
})(this, (function (exports, web, ioc, solidJs) { 'use strict';

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
    /* global Reflect, Promise, SuppressedError, Symbol */

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

    var SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY = Symbol('solidium-member-decorator-processors');
    var SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY = Symbol('solidium-class-decorator-processors');
    function beforeInstantiation(constructor) {
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
          if (markData == null || markData == undefined || typeof markData !== 'object' || !markData[IS_MEMBER_DECORATOR_PROCESSOR]) {
            return;
          }
          var processors = allMemberDecoratorProcessors.get(member) || new Set();
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
        allClassDecoratorProcessor.forEach(function (processor) {
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
        allMemberDecoratorProcessors.forEach(function (processors, member) {
          processors.forEach(function (processor) {
            if (processor.beforeInstantiation) {
              processor.beforeInstantiation(constructor, member, metadata);
            }
          });
        });
      }
    }
    function afterInstantiation(instance) {
      var constructor = instance.constructor;
      var metadata = ioc.ClassMetadata.getInstance(constructor).reader();
      if (SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY in constructor) {
        var allClassProcessors = constructor[SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY];
        allClassProcessors.forEach(function (processor) {
          var newInstance = processor.afterInstantiation && processor.afterInstantiation(instance, metadata);
          if (newInstance instanceof constructor) {
            instance = newInstance;
          }
        });
      }
      if (SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY in constructor) {
        var allMemberProcessors = constructor[SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY];
        allMemberProcessors.forEach(function (processors, member) {
          processors.forEach(function (processor) {
            if (processor.afterInstantiation) {
              processor.afterInstantiation(instance, member, metadata);
            }
          });
        });
      }
      return instance;
    }

    var IoCContext = solidJs.createContext();
    var ServiceInstanceStatusManager = /** @class */function () {
      function ServiceInstanceStatusManager() {
        this.store = new WeakMap();
      }
      ServiceInstanceStatusManager.prototype.record = function (cls) {
        this.store.set(cls, true);
      };
      ServiceInstanceStatusManager.prototype.isInstantiated = function (cls) {
        return this.store.has(cls);
      };
      return ServiceInstanceStatusManager;
    }();
    function Solidium(props) {
      var _a;
      var appCtx = new ioc.ApplicationContext();
      var manager = appCtx.getInstance(ServiceInstanceStatusManager);
      var originGetInstance = appCtx.getInstance;
      appCtx.getInstance = function (id, owner) {
        var _this = this;
        if (typeof id === 'function') {
          var metadata = ioc.ClassMetadata.getInstance(id).reader();
          if (metadata.getScope() === ioc.InstanceScope.TRANSIENT) {
            return originGetInstance.call(this, id, owner);
          }
          if (manager.isInstantiated(id)) {
            return originGetInstance.call(this, id, owner);
          }
        }
        var _a = solidJs.createRoot(function (dispose) {
            return [dispose, originGetInstance.call(_this, id, owner)];
          }),
          dispose = _a[0],
          instance = _a[1];
        this.onPreDestroy(function () {
          queueMicrotask(dispose);
        });
        return instance;
      };
      appCtx.registerBeforeInstantiationProcessor(beforeInstantiation);
      appCtx.registerAfterInstantiationProcessor(afterInstantiation);
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

    var SETTER_INTERCEPTOR_MAP_KEY = Symbol('solidium-setter-interceptors-map');

    var signalMap = new SignalMap();
    var IS_SIGNAL_MEMBER_METADATA_KEY = 'is_signal_member_metadata_key';
    function defineSignalMember(target, member, defaultValue) {
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
      Object.defineProperty(target, member, {
        get: function () {
          var get = signalMap.get(this, member, defaultValue)[0];
          return get();
        },
        set: function (newValue) {
          var _a = signalMap.get(this, member),
            get = _a[0],
            set = _a[1];
          var interceptorMap = target[SETTER_INTERCEPTOR_MAP_KEY];
          var interceptor = interceptorMap === null || interceptorMap === void 0 ? void 0 : interceptorMap.get(member);
          return set(interceptor ? interceptor.call(this, get(), newValue) : newValue);
        }
      });
    }
    function isSignalMember(target, member) {
      var extraDataOfMember = extraDataOf(target, member);
      return !!(extraDataOfMember === null || extraDataOfMember === void 0 ? void 0 : extraDataOfMember.get(IS_SIGNAL_MEMBER_METADATA_KEY));
    }

    var _a$3;
    var SIGNAL_MARK_KEY = Symbol('solidium_mark_as_signal_property');
    var Signal = ioc.Mark(SIGNAL_MARK_KEY, (_a$3 = {}, _a$3[IS_MEMBER_DECORATOR_PROCESSOR] = true, _a$3.beforeInstantiation = function (constructor, member) {
      defineSignalMember(constructor.prototype, member);
    }, _a$3));

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
    var Observe = function (options) {
      var _a;
      if (options === void 0) {
        options = {};
      }
      return ioc.Mark(OBSERVE_PROPERTY_MARK_KEY, (_a = {}, _a[IS_MEMBER_DECORATOR_PROCESSOR] = true, _a.afterInstantiation = function (instance, methodName) {
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
      }, _a));
    };

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

    var _a$2;
    var COMPUTED_GETTER_MARK_KEY = Symbol('solidium_computed_getter');
    var Computed = ioc.Mark(COMPUTED_GETTER_MARK_KEY, (_a$2 = {}, _a$2[IS_MEMBER_DECORATOR_PROCESSOR] = true, _a$2.afterInstantiation = function (instance, member) {
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
    }, _a$2));

    var _a$1;
    var BATCH_METHOD_MARK_KEY = Symbol('solidium-batch-method-mark-key');
    var Batch = ioc.Mark(BATCH_METHOD_MARK_KEY, (_a$1 = {}, _a$1[IS_MEMBER_DECORATOR_PROCESSOR] = true, _a$1.afterInstantiation = function (instance, member, metadata) {
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
    }, _a$1));

    var TRACK_METHOD_MARK_KEY = Symbol('solidium_track_method');
    var Track = function (fn) {
      return ioc.Mark(TRACK_METHOD_MARK_KEY, fn);
    };

    var _a;
    var SOLIDIUM_MARK_CLASS_AUTO = Symbol('solidium-mark-class-auto');
    var Auto = ioc.Mark(SOLIDIUM_MARK_CLASS_AUTO, (_a = {}, _a[IS_CLASS_DECORATOR_PROCESSOR] = true, _a.afterInstantiation = function (instance) {
      if (!instance || typeof instance !== 'object') {
        return instance;
      }
      var prototype = Object.getPrototypeOf(instance);
      var owner = solidJs.getOwner();
      return new Proxy(instance, {
        get: function (target, p, receiver) {
          if (typeof prototype[p] === 'function') {
            return Reflect.get(target, p, receiver);
          }
          if (isSignalMember(prototype, p)) {
            delete target[p];
            return Reflect.get(target, p, receiver);
          }
          solidJs.runWithOwner(owner, function () {
            defineSignalMember(prototype, p, target[p]);
            delete target[p];
          });
          return Reflect.get(target, p, receiver);
        },
        set: function (target, p, newValue, receiver) {
          return Reflect.set(target, p, newValue, receiver);
        }
      });
    }, _a));

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

    exports.Auto = Auto;
    exports.Batch = Batch;
    exports.Computed = Computed;
    exports.IS_CLASS_DECORATOR_PROCESSOR = IS_CLASS_DECORATOR_PROCESSOR;
    exports.IS_MEMBER_DECORATOR_PROCESSOR = IS_MEMBER_DECORATOR_PROCESSOR;
    exports.Observe = Observe;
    exports.Signal = Signal;
    exports.Solidium = Solidium;
    exports.Track = Track;
    exports.resultOf = resultOf;
    exports.useApplicationContext = useApplicationContext;
    exports.useComputed = useComputed;
    exports.useService = useService;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
