'use strict';

var solidJs = require('solid-js');
require('reflect-metadata');
var lazy = require('@vgerbot/lazy');
var web = require('solid-js/web');
var store$1 = require('solid-js/store');

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

var extendStatics$1 = function(d, b) {
    extendStatics$1 = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics$1(d, b);
};

function __extends$1(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics$1(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign$1 = function() {
    __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign$1.apply(this, arguments);
};

function __read$1(o, n) {
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

function __spreadArray$1(to, from, pack) {
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

var SignalMap = /** @class */function () {
  function SignalMap() {
    this.store = new WeakMap();
  }
  SignalMap.prototype.get = function (object, key, initValue) {
    if (object === null || typeof object !== "object") {
      throw new Error("");
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

var RESULT_MAP = new SignalMap();
function store(instance, methodName, value) {
  var _a = __read$1(RESULT_MAP.get(instance, methodName), 2),
    set = _a[1];
  set(value);
}
function clean(instance, methodName) {
  RESULT_MAP.delete(instance, methodName);
}
function resultOf(instance, methodName) {
  var _a = __read$1(RESULT_MAP.get(instance, methodName), 1),
    get = _a[0];
  return get();
}

var IS_MEMBER_DECORATOR_PROCESSOR = Symbol("solidium-is-member-decorator-processor");
var IS_CLASS_DECORATOR_PROCESSOR = Symbol("solidium-is-class-decorator-processor");

var Advice;
(function (Advice) {
  Advice[Advice["Before"] = 0] = "Before";
  Advice[Advice["After"] = 1] = "After";
  Advice[Advice["Around"] = 2] = "Around";
  Advice[Advice["AfterReturn"] = 3] = "AfterReturn";
  Advice[Advice["Thrown"] = 4] = "Thrown";
  Advice[Advice["Finally"] = 5] = "Finally";
})(Advice || (Advice = {}));

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

var extendStatics = function (d, b) {
  extendStatics = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (d, b) {
    d.__proto__ = b;
  } || function (d, b) {
    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
  };
  return extendStatics(d, b);
};
function __extends(d, b) {
  if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var __assign = function () {
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
  var c = arguments.length,
    r = c < 3 ? target : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator,
    m = s && o[s],
    i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
    next: function () {
      if (o && i >= o.length) o = void 0;
      return {
        value: o && o[i++],
        done: !o
      };
    }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o),
    r,
    ar = [],
    e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  } catch (error) {
    e = {
      error: error
    };
  } finally {
    try {
      if (r && !r.done && (m = i["return"])) m.call(i);
    } finally {
      if (e) throw e.error;
    }
  }
  return ar;
}
function __spreadArray(to, from, pack) {
  if (arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
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
function createDefaultValueMap(factory) {
  var map = new Map();
  var originGet = map.get.bind(map);
  map.get = function (key) {
    if (map.has(key)) {
      return originGet(key);
    } else {
      var defaultValue = factory(key);
      map.set(key, defaultValue);
      return map.get(key);
    }
  };
  return map;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
var ComponentMethodAspect = /** @class */function () {
  function ComponentMethodAspect() {}
  ComponentMethodAspect.create = function (clazz, methodName) {
    return /** @class */function (_super) {
      __extends(ComponentMethodAspectImpl, _super);
      function ComponentMethodAspectImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
      }
      ComponentMethodAspectImpl.prototype.execute = function (jp) {
        var aspectInstance = jp.ctx.getInstance(clazz);
        var func = aspectInstance[methodName];
        return func.call(this.aspectInstance, jp);
      };
      return ComponentMethodAspectImpl;
    }(ComponentMethodAspect);
  };
  return ComponentMethodAspect;
}();
var AspectMetadata = /** @class */function () {
  function AspectMetadata() {
    this.aspects = [];
    //
  }
  AspectMetadata.getInstance = function () {
    return AspectMetadata.INSTANCE;
  };
  AspectMetadata.prototype.init = function () {
    //
  };
  AspectMetadata.prototype.append = function (componentAspectClass, methodName, advice, pointcut) {
    var AspectClass = ComponentMethodAspect.create(componentAspectClass, methodName);
    this.aspects.push({
      aspectClass: AspectClass,
      methodName: methodName,
      pointcut: pointcut,
      advice: advice
    });
  };
  AspectMetadata.prototype.reader = function () {
    var _this = this;
    return {
      getAspects: function (jpIdentifier, jpMember) {
        return _this.aspects.filter(function (_a) {
          var pointcut = _a.pointcut;
          return pointcut.test(jpIdentifier, jpMember);
        });
      }
    };
  };
  AspectMetadata.INSTANCE = new AspectMetadata();
  return AspectMetadata;
}();
function getMethodDescriptors(prototype) {
  if (typeof prototype !== 'object' || prototype === null || Object.prototype === prototype || Function.prototype === prototype) {
    return {};
  }
  var superPrototype = Object.getPrototypeOf(prototype);
  var superDescriptors = superPrototype === prototype ? {} : getMethodDescriptors(superPrototype);
  return Object.assign(superDescriptors, Object.getOwnPropertyDescriptors(prototype));
}
function getAllMethodMemberNames(cls) {
  var descriptors = getMethodDescriptors(cls.prototype);
  var methodNames = new Set();
  Reflect.ownKeys(descriptors).forEach(function (key) {
    if (key === 'constructor') {
      return;
    }
    var member = cls.prototype[key];
    if (typeof member === 'function') {
      methodNames.add(key);
    }
  });
  return methodNames;
}
var metadataInstanceMap = createDefaultValueMap(function () {
  return new Set();
});
var MetadataInstanceManager = /** @class */function () {
  function MetadataInstanceManager() {}
  MetadataInstanceManager.getMetadata = function (target, metadataClass) {
    var key = metadataClass.getReflectKey();
    var metadata = Reflect.getMetadata(key, target);
    if (!metadata) {
      metadata = new metadataClass();
      metadata.init(target);
      Reflect.defineMetadata(key, metadata, target);
      var instanceSet = metadataInstanceMap.get(metadataClass);
      instanceSet.add(metadata);
    }
    return metadata;
  };
  MetadataInstanceManager.getAllInstanceof = function (metadataClass) {
    return Array.from(metadataInstanceMap.get(metadataClass));
  };
  return MetadataInstanceManager;
}();

// eslint-disable @typescript-eslint/no-explicit-any
var CLASS_METADATA_KEY = 'ioc:class-metadata';
var MarkInfoContainer = /** @class */function () {
  function MarkInfoContainer() {
    this.map = createDefaultValueMap(function () {
      return {};
    });
  }
  MarkInfoContainer.prototype.getMarkInfo = function (method) {
    return this.map.get(method);
  };
  MarkInfoContainer.prototype.mark = function (method, key, value) {
    var markInfo = this.map.get(method);
    markInfo[key] = value;
  };
  MarkInfoContainer.prototype.getMembers = function () {
    return new Set(this.map.keys());
  };
  return MarkInfoContainer;
}();
var ParameterMarkInfoContainer = /** @class */function () {
  function ParameterMarkInfoContainer() {
    this.map = createDefaultValueMap(function () {
      return {};
    });
  }
  ParameterMarkInfoContainer.prototype.getMarkInfo = function (method) {
    return this.map.get(method);
  };
  ParameterMarkInfoContainer.prototype.mark = function (method, index, key, value) {
    var paramsMarkInfo = this.map.get(method);
    var markInfo = paramsMarkInfo[index] || {};
    markInfo[key] = value;
    paramsMarkInfo[index] = markInfo;
  };
  return ParameterMarkInfoContainer;
}();
var ClassMetadata = /** @class */function () {
  function ClassMetadata() {
    this.constructorParameterTypes = [];
    this.lifecycleMethodsMap = {};
    this.propertyTypesMap = new Map();
    this.marks = {
      ctor: {},
      members: new MarkInfoContainer(),
      params: new ParameterMarkInfoContainer()
    };
  }
  ClassMetadata.getReflectKey = function () {
    return CLASS_METADATA_KEY;
  };
  ClassMetadata.getInstance = function (ctor) {
    return MetadataInstanceManager.getMetadata(ctor, ClassMetadata);
  };
  ClassMetadata.getReader = function (ctor) {
    return ClassMetadata.getInstance(ctor).reader();
  };
  ClassMetadata.prototype.init = function (target) {
    var _this = this;
    this.clazz = target;
    var constr = target;
    if (typeof constr.scope === 'function') {
      this.setScope(constr.scope());
    }
    if (typeof constr.inject === 'function') {
      var injections_1 = constr.inject();
      Reflect.ownKeys(injections_1).forEach(function (key) {
        _this.recordPropertyType(key, injections_1[key]);
      });
    }
    if (typeof constr.metadata === 'function') {
      var metadata = constr.metadata();
      if (metadata.scope) {
        this.setScope(metadata.scope);
      }
      var injections_2 = metadata.inject;
      if (injections_2) {
        Reflect.ownKeys(injections_2).forEach(function (key) {
          _this.recordPropertyType(key, injections_2[key]);
        });
      }
    }
  };
  ClassMetadata.prototype.marker = function () {
    var _this = this;
    return {
      ctor: function (key, value) {
        _this.marks.ctor[key] = value;
      },
      member: function (propertyKey) {
        return {
          mark: function (key, value) {
            _this.marks.members.mark(propertyKey, key, value);
          }
        };
      },
      parameter: function (propertyKey, index) {
        return {
          mark: function (key, value) {
            _this.marks.params.mark(propertyKey, index, key, value);
          }
        };
      }
    };
  };
  ClassMetadata.prototype.setScope = function (scope) {
    this.scope = scope;
  };
  ClassMetadata.prototype.setConstructorParameterType = function (index, type) {
    this.constructorParameterTypes[index] = type;
  };
  ClassMetadata.prototype.recordPropertyType = function (propertyKey, type) {
    this.propertyTypesMap.set(propertyKey, type);
  };
  ClassMetadata.prototype.addLifecycleMethod = function (methodName, lifecycle) {
    var lifecycles = this.getLifecycles(methodName);
    lifecycles.add(lifecycle);
    this.lifecycleMethodsMap[methodName] = lifecycles;
  };
  ClassMetadata.prototype.getLifecycles = function (methodName) {
    return this.lifecycleMethodsMap[methodName] || new Set();
  };
  ClassMetadata.prototype.getMethods = function (lifecycle) {
    var _this = this;
    return Object.keys(this.lifecycleMethodsMap).filter(function (it) {
      var lifecycles = _this.lifecycleMethodsMap[it];
      return lifecycles.has(lifecycle);
    });
  };
  ClassMetadata.prototype.getSuperClass = function () {
    var superClassPrototype = Object.getPrototypeOf(this.clazz);
    if (!superClassPrototype) {
      return null;
    }
    var superClass = superClassPrototype.constructor;
    if (superClass === this.clazz) {
      return null;
    }
    return superClass;
  };
  ClassMetadata.prototype.getSuperClassMetadata = function () {
    var superClass = this.getSuperClass();
    if (!superClass) {
      return null;
    }
    return ClassMetadata.getInstance(superClass);
  };
  ClassMetadata.prototype.reader = function () {
    var _this = this;
    var _a;
    var superReader = (_a = this.getSuperClassMetadata()) === null || _a === void 0 ? void 0 : _a.reader();
    return {
      getClass: function () {
        return _this.clazz;
      },
      getScope: function () {
        return _this.scope;
      },
      getConstructorParameterTypes: function () {
        return _this.constructorParameterTypes.slice(0);
      },
      getMethods: function (lifecycle) {
        var superMethods = (superReader === null || superReader === void 0 ? void 0 : superReader.getMethods(lifecycle)) || [];
        var thisMethods = _this.getMethods(lifecycle);
        return Array.from(new Set(superMethods.concat(thisMethods)));
      },
      getPropertyTypeMap: function () {
        var superPropertyTypeMap = superReader === null || superReader === void 0 ? void 0 : superReader.getPropertyTypeMap();
        var thisPropertyTypesMap = _this.propertyTypesMap;
        if (!superPropertyTypeMap) {
          return new Map(thisPropertyTypesMap);
        }
        var result = new Map(superPropertyTypeMap);
        thisPropertyTypesMap.forEach(function (value, key) {
          result.set(key, value);
        });
        return result;
      },
      getCtorMarkInfo: function () {
        return __assign({}, _this.marks.ctor);
      },
      getAllMarkedMembers: function () {
        var superMethods = superReader === null || superReader === void 0 ? void 0 : superReader.getAllMarkedMembers();
        var thisMembers = _this.marks.members.getMembers();
        var result = superMethods ? new Set(superMethods) : new Set();
        thisMembers.forEach(function (it) {
          return result.add(it);
        });
        return result;
      },
      getMembersMarkInfo: function (key) {
        return _this.marks.members.getMarkInfo(key);
      },
      getParameterMarkInfo: function (methodKey) {
        return _this.marks.params.getMarkInfo(methodKey);
      }
    };
  };
  return ClassMetadata;
}();
var FUNCTION_METADATA_KEY = Symbol('ioc:function-metadata');
var FunctionMetadata = /** @class */function () {
  function FunctionMetadata() {
    this.parameters = [];
    this.isFactory = false;
  }
  FunctionMetadata.getReflectKey = function () {
    return FUNCTION_METADATA_KEY;
  };
  FunctionMetadata.prototype.setParameterType = function (index, symbol) {
    this.parameters[index] = symbol;
  };
  FunctionMetadata.prototype.setScope = function (scope) {
    this.scope = scope;
  };
  FunctionMetadata.prototype.setIsFactory = function (isFactory) {
    this.isFactory = isFactory;
  };
  FunctionMetadata.prototype.init = function () {
    // PASS;
  };
  FunctionMetadata.prototype.reader = function () {
    var _this = this;
    return {
      getParameters: function () {
        return _this.parameters.slice(0);
      },
      isFactory: function () {
        return _this.isFactory;
      },
      getScope: function () {
        return _this.scope;
      }
    };
  };
  return FunctionMetadata;
}();
var InstanceScope;
(function (InstanceScope) {
  InstanceScope["SINGLETON"] = "ioc-resolution:container-singleton";
  InstanceScope["TRANSIENT"] = "ioc-resolution:transient";
  InstanceScope["GLOBAL_SHARED_SINGLETON"] = "ioc-resolution:global-shared-singleton";
})(InstanceScope || (InstanceScope = {}));
var ServiceFactoryDef = /** @class */function () {
  /**
   * @param identifier The unique identifier of this factories
   * @param isSingle Indicates whether the identifier defines only one factory.
   */
  function ServiceFactoryDef(identifier, scope) {
    this.identifier = identifier;
    this.scope = scope;
    this.factories = new Map();
  }
  ServiceFactoryDef.createFromClassMetadata = function (metadata) {
    var def = new ServiceFactoryDef(metadata.reader().getClass(), InstanceScope.SINGLETON);
    def.append(function (container, owner) {
      return function () {
        var reader = metadata.reader();
        var clazz = reader.getClass();
        return container.getInstance(clazz, owner);
      };
    });
    return def;
  };
  ServiceFactoryDef.prototype.append = function (factory, injections) {
    if (injections === void 0) {
      injections = [];
    }
    if (this.scope === InstanceScope.SINGLETON && this.factories.size === 1 && this.factories.has(factory)) {
      throw new Error("".concat(this.identifier.toString(), " is A singleton! But multiple factories are defined!"));
    }
    this.factories.set(factory, injections);
  };
  ServiceFactoryDef.prototype.produce = function (container, owner) {
    // if (this.isSingle) {
    //     const [factory, injections] = this.factories.entries().next().value as [ServiceFactory<T, unknown>, Identifier[]];
    //     const fn = factory(container, owner);
    //     return () => {
    //         return container.invoke(fn, {
    //             injections
    //         });
    //     };
    // } else {
    // }
    var producers = Array.from(this.factories).map(function (_a) {
      var _b = __read(_a, 2),
        factory = _b[0],
        injections = _b[1];
      var fn = factory(container, owner);
      return function () {
        return container.invoke(fn, {
          injections: injections
        });
      };
    });
    return function () {
      return producers.map(function (it) {
        return it();
      });
    };
  };
  return ServiceFactoryDef;
}();
var FactoryRecorder = /** @class */function () {
  function FactoryRecorder() {
    this.factories = new Map();
  }
  FactoryRecorder.prototype.append = function (identifier, factory, injections, scope) {
    if (injections === void 0) {
      injections = [];
    }
    if (scope === void 0) {
      scope = InstanceScope.SINGLETON;
    }
    var def = this.factories.get(identifier);
    if (def) {
      def.append(factory, injections);
    } else {
      def = new ServiceFactoryDef(identifier, scope);
      def.append(factory, injections);
    }
    this.factories.set(identifier, def);
  };
  FactoryRecorder.prototype.set = function (identifier, factoryDef) {
    this.factories.set(identifier, factoryDef);
  };
  FactoryRecorder.prototype.get = function (identifier) {
    return this.factories.get(identifier);
  };
  FactoryRecorder.prototype.iterator = function () {
    return this.factories.entries();
  };
  return FactoryRecorder;
}();
var GlobalMetadata = /** @class */function () {
  function GlobalMetadata() {
    this.classAliasMetadataMap = new Map();
    this.componentFactories = new FactoryRecorder();
    this.processorClasses = new Set();
  }
  GlobalMetadata.getInstance = function () {
    return GlobalMetadata.INSTANCE;
  };
  GlobalMetadata.getReader = function () {
    return GlobalMetadata.getInstance().reader();
  };
  GlobalMetadata.prototype.recordFactory = function (symbol, factory, injections, scope) {
    if (injections === void 0) {
      injections = [];
    }
    if (scope === void 0) {
      scope = InstanceScope.SINGLETON;
    }
    this.componentFactories.append(symbol, factory, injections, scope);
  };
  GlobalMetadata.prototype.recordClassAlias = function (aliasName, metadata) {
    this.classAliasMetadataMap.set(aliasName, metadata);
  };
  GlobalMetadata.prototype.recordProcessorClass = function (clazz) {
    this.processorClasses.add(clazz);
  };
  GlobalMetadata.prototype.init = function () {
    // PASS;
  };
  GlobalMetadata.prototype.reader = function () {
    var _this = this;
    return {
      getComponentFactory: function (key) {
        return _this.componentFactories.get(key);
      },
      getClassMetadata: function (aliasName) {
        return _this.classAliasMetadataMap.get(aliasName);
      },
      getInstAwareProcessorClasses: function () {
        return Array.from(_this.processorClasses);
      }
    };
  };
  GlobalMetadata.INSTANCE = new GlobalMetadata();
  return GlobalMetadata;
}();
var Pointcut = /** @class */function () {
  function Pointcut() {}
  Pointcut.combine = function () {
    var pointcuts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      pointcuts[_i] = arguments[_i];
    }
    return new OrPointcut(pointcuts);
  };
  Pointcut.of = function (cls) {
    var methodNames = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      methodNames[_i - 1] = arguments[_i];
    }
    var entries = new Map();
    var methods = new Set(methodNames);
    if (arguments.length === 1) {
      getAllMethodMemberNames(cls).forEach(function (methodName) {
        methods.add(methodName);
      });
    }
    entries.set(cls, methods);
    return new PrecitePointcut(entries);
  };
  /**
   * @deprecated
   */
  Pointcut.testMatch = function (cls, regex) {
    return Pointcut.match(cls, regex);
  };
  Pointcut.match = function (cls, regex) {
    return new MemberMatchPointcut(cls, regex);
  };
  Pointcut.from = function () {
    var classes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      classes[_i] = arguments[_i];
    }
    var of = function () {
      var methodNames = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        methodNames[_i] = arguments[_i];
      }
      return new OrPointcut(classes.map(function (cls) {
        return Pointcut.of.apply(Pointcut, __spreadArray([cls], __read(methodNames), false));
      }));
    };
    var match = function (regex) {
      return new OrPointcut(classes.map(function (cls) {
        return new MemberMatchPointcut(cls, regex);
      }));
    };
    return {
      of: of,
      match: match,
      /**
       * @deprecated
       */
      testMatch: match
    };
  };
  Pointcut.marked = function (type, value) {
    if (value === void 0) {
      value = true;
    }
    return new MarkedPointcut(type, value);
  };
  Pointcut.class = function (cls) {
    return new ClassPointcut(cls);
  };
  return Pointcut;
}();
var OrPointcut = /** @class */function (_super) {
  __extends(OrPointcut, _super);
  function OrPointcut(pointcuts) {
    var _this = _super.call(this) || this;
    _this.pointcuts = pointcuts;
    return _this;
  }
  OrPointcut.prototype.test = function (jpIdentifier, jpMember) {
    return this.pointcuts.some(function (it) {
      return it.test(jpIdentifier, jpMember);
    });
  };
  return OrPointcut;
}(Pointcut);
var PrecitePointcut = /** @class */function (_super) {
  __extends(PrecitePointcut, _super);
  function PrecitePointcut(methodEntries) {
    var _this = _super.call(this) || this;
    _this.methodEntries = methodEntries;
    return _this;
  }
  PrecitePointcut.prototype.test = function (jpIdentifier, jpMember) {
    var members = this.methodEntries.get(jpIdentifier);
    return !!members && members.has(jpMember);
  };
  return PrecitePointcut;
}(Pointcut);
var MarkedPointcut = /** @class */function (_super) {
  __extends(MarkedPointcut, _super);
  function MarkedPointcut(markedType, markedValue) {
    if (markedValue === void 0) {
      markedValue = true;
    }
    var _this = _super.call(this) || this;
    _this.markedType = markedType;
    _this.markedValue = markedValue;
    return _this;
  }
  MarkedPointcut.prototype.test = function (jpIdentifier, jpMember) {
    if (typeof jpIdentifier !== 'function') {
      return false;
    }
    var metadata = MetadataInstanceManager.getMetadata(jpIdentifier, ClassMetadata);
    var markInfo = metadata.reader().getMembersMarkInfo(jpMember);
    return markInfo[this.markedType] === this.markedValue;
  };
  return MarkedPointcut;
}(Pointcut);
var MemberMatchPointcut = /** @class */function (_super) {
  __extends(MemberMatchPointcut, _super);
  function MemberMatchPointcut(clazz, regex) {
    var _this = _super.call(this) || this;
    _this.clazz = clazz;
    _this.regex = regex;
    return _this;
  }
  MemberMatchPointcut.prototype.test = function (jpIdentifier, jpMember) {
    return jpIdentifier === this.clazz && typeof jpMember === 'string' && !!this.regex.test(jpMember);
  };
  return MemberMatchPointcut;
}(Pointcut);
var ClassPointcut = /** @class */function (_super) {
  __extends(ClassPointcut, _super);
  function ClassPointcut(clazz) {
    var _this = _super.call(this) || this;
    _this.clazz = clazz;
    return _this;
  }
  ClassPointcut.prototype.test = function (jpIdentifier) {
    return jpIdentifier === this.clazz;
  };
  return ClassPointcut;
}(Pointcut);
var ExpressionType;
(function (ExpressionType) {
  ExpressionType["ENV"] = "inject-environment-variables";
  ExpressionType["JSON_PATH"] = "inject-json-data";
  ExpressionType["ARGV"] = "inject-argv";
})(ExpressionType || (ExpressionType = {}));
var isNodeJs = function () {
  try {
    return process.versions.node !== null;
  } catch (_e) {
    return false;
  }
}();
var PROXY_TARGET_MAP = new WeakMap();
function recordProxyTarget(proxy, target) {
  PROXY_TARGET_MAP.set(proxy, target);
}

/* eslint-disable @typescript-eslint/no-explicit-any */
var AspectUtils = /** @class */function () {
  function AspectUtils(fn) {
    this.fn = fn;
    this.beforeHooks = [];
    this.afterHooks = [];
    this.thrownHooks = [];
    this.finallyHooks = [];
    this.afterReturnHooks = [];
    this.aroundHooks = [];
  }
  AspectUtils.prototype.append = function (advice, hook) {
    var hooksArray;
    switch (advice) {
      case Advice.Before:
        hooksArray = this.beforeHooks;
        break;
      case Advice.After:
        hooksArray = this.afterHooks;
        break;
      case Advice.Thrown:
        hooksArray = this.thrownHooks;
        break;
      case Advice.Finally:
        hooksArray = this.finallyHooks;
        break;
      case Advice.AfterReturn:
        hooksArray = this.afterReturnHooks;
        break;
      case Advice.Around:
        hooksArray = this.aroundHooks;
        break;
    }
    if (hooksArray) {
      hooksArray.push(hook);
    }
  };
  AspectUtils.prototype.extract = function () {
    var _a = this,
      aroundHooks = _a.aroundHooks,
      beforeHooks = _a.beforeHooks,
      afterHooks = _a.afterHooks,
      afterReturnHooks = _a.afterReturnHooks,
      finallyHooks = _a.finallyHooks,
      thrownHooks = _a.thrownHooks;
    var fn = aroundHooks.reduceRight(function (prev, next) {
      return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          args[_i] = arguments[_i];
        }
        return next.call(this, prev, args);
      };
    }, this.fn);
    return function () {
      var _this = this;
      var args = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }
      beforeHooks.forEach(function (hook) {
        hook.call(_this, args);
      });
      var invoke = function (onError, onFinally, onAfter) {
        var returnValue;
        var isPromise = false;
        try {
          returnValue = fn.apply(_this, args);
          if (returnValue instanceof Promise) {
            isPromise = true;
            returnValue = returnValue.catch(onError).finally(onFinally);
          }
        } catch (error) {
          onError(error);
        } finally {
          if (!isPromise) {
            onFinally();
          }
        }
        if (isPromise) {
          return returnValue.then(function (value) {
            return onAfter(value);
          });
        } else {
          return onAfter(returnValue);
        }
      };
      return invoke(function (error) {
        if (thrownHooks.length > 0) {
          thrownHooks.forEach(function (hook) {
            return hook.call(_this, error, args);
          });
        } else {
          throw error;
        }
      }, function () {
        finallyHooks.forEach(function (hook) {
          return hook.call(_this, args);
        });
      }, function (value) {
        afterHooks.forEach(function (hook) {
          hook.call(_this, args);
        });
        return afterReturnHooks.reduce(function (retVal, hook) {
          return hook.call(_this, retVal, args);
        }, value);
      });
    };
  };
  return AspectUtils;
}();
function createAspect(appCtx, target, methodName, methodFunc, aspects) {
  var createAspectCtx = function (advice, args, returnValue, error) {
    if (returnValue === void 0) {
      returnValue = null;
    }
    if (error === void 0) {
      error = null;
    }
    return {
      target: target,
      methodName: methodName,
      arguments: args,
      returnValue: returnValue,
      error: error,
      advice: advice,
      ctx: appCtx
    };
  };
  var aspectUtils = new AspectUtils(methodFunc);
  var ClassToInstance = function (aspectInfo) {
    return appCtx.getInstance(aspectInfo.aspectClass);
  };
  var targetConstructor = target.constructor;
  var allMatchAspects = aspects.filter(function (it) {
    return it.pointcut.test(targetConstructor, methodName);
  });
  var beforeAdviceAspects = allMatchAspects.filter(function (it) {
    return it.advice === Advice.Before;
  }).map(ClassToInstance);
  var afterAdviceAspects = allMatchAspects.filter(function (it) {
    return it.advice === Advice.After;
  }).map(ClassToInstance);
  var tryCatchAdviceAspects = allMatchAspects.filter(function (it) {
    return it.advice === Advice.Thrown;
  }).map(ClassToInstance);
  var tryFinallyAdviceAspects = allMatchAspects.filter(function (it) {
    return it.advice === Advice.Finally;
  }).map(ClassToInstance);
  var afterReturnAdviceAspects = allMatchAspects.filter(function (it) {
    return it.advice === Advice.AfterReturn;
  }).map(ClassToInstance);
  var aroundAdviceAspects = allMatchAspects.filter(function (it) {
    return it.advice === Advice.Around;
  }).map(ClassToInstance);
  if (beforeAdviceAspects.length > 0) {
    aspectUtils.append(Advice.Before, function (args) {
      var joinPoint = createAspectCtx(Advice.Before, args);
      beforeAdviceAspects.forEach(function (aspect) {
        aspect.execute(joinPoint);
      });
    });
  }
  if (afterAdviceAspects.length > 0) {
    aspectUtils.append(Advice.After, function (args) {
      var joinPoint = createAspectCtx(Advice.After, args);
      afterAdviceAspects.forEach(function (aspect) {
        aspect.execute(joinPoint);
      });
    });
  }
  if (tryCatchAdviceAspects.length > 0) {
    aspectUtils.append(Advice.Thrown, function (error, args) {
      var joinPoint = createAspectCtx(Advice.Thrown, args, null, error);
      tryCatchAdviceAspects.forEach(function (aspect) {
        aspect.execute(joinPoint);
      });
    });
  }
  if (tryFinallyAdviceAspects.length > 0) {
    aspectUtils.append(Advice.Finally, function (args) {
      var joinPoint = createAspectCtx(Advice.Finally, args);
      tryFinallyAdviceAspects.forEach(function (aspect) {
        aspect.execute(joinPoint);
      });
    });
  }
  if (afterReturnAdviceAspects.length > 0) {
    aspectUtils.append(Advice.AfterReturn, function (returnValue, args) {
      return afterReturnAdviceAspects.reduce(function (_prevReturnValue, aspect) {
        var joinPoint = createAspectCtx(Advice.AfterReturn, args, returnValue);
        return aspect.execute(joinPoint);
      }, returnValue);
    });
  }
  if (aroundAdviceAspects.length > 0) {
    aroundAdviceAspects.forEach(function (aspect) {
      aspectUtils.append(Advice.Around, function (originFn, args) {
        var joinPoint = createAspectCtx(Advice.Around, args, null);
        joinPoint.proceed = function (jpArgs) {
          if (jpArgs === void 0) {
            jpArgs = args;
          }
          return originFn(jpArgs);
        };
        return aspect.execute(joinPoint);
      });
    });
  }
  return aspectUtils.extract();
}
var AOPInstantiationAwareProcessor = /** @class */function () {
  function AOPInstantiationAwareProcessor() {}
  AOPInstantiationAwareProcessor.create = function (appCtx) {
    return /** @class */function (_super) {
      __extends(class_1, _super);
      function class_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.appCtx = appCtx;
        return _this;
      }
      return class_1;
    }(AOPInstantiationAwareProcessor);
  };
  AOPInstantiationAwareProcessor.prototype.afterInstantiation = function (instance) {
    var _this = this;
    if (!instance || typeof instance !== 'object') {
      return instance;
    }
    var clazz = instance.constructor;
    var aspectMetadata = AspectMetadata.getInstance().reader();
    // const useAspectMetadata = MetadataInstanceManager.getMetadata(clazz, AOPClassMetadata);
    // const useAspectMetadataReader = useAspectMetadata.reader();
    // const useAspectsMap = useAspectMetadataReader.getAspects();
    // if (useAspectsMap.size === 0) {
    //     return instance;
    // }
    var aspectStoreMap = new WeakMap();
    aspectStoreMap.set(instance, new Map());
    var proxyResult = new Proxy(instance, {
      get: function (target, prop, receiver) {
        var originValue = Reflect.get(target, prop, receiver);
        switch (prop) {
          case 'constructor':
            return originValue;
        }
        if (Reflect.has(target, prop) && typeof originValue === 'function') {
          var aspectMap = aspectStoreMap.get(instance);
          if (!aspectMap) {
            return originValue;
          }
          if (aspectMap.has(prop)) {
            return aspectMap.get(prop);
          }
          var aspectsOfMethod = aspectMetadata.getAspects(clazz, prop);
          var aspectFn = createAspect(_this.appCtx, target, prop, originValue, aspectsOfMethod);
          aspectMap.set(prop, aspectFn);
          return aspectFn;
        }
        return originValue;
      }
    });
    if (process.env.NODE_ENV === 'test') {
      recordProxyTarget(proxyResult, instance);
    }
    return proxyResult;
  };
  return AOPInstantiationAwareProcessor;
}();
var ArgvEvaluator = /** @class */function () {
  function ArgvEvaluator() {}
  ArgvEvaluator.prototype.eval = function (_context, expression, args) {
    var argv = args || process.argv;
    var minimist = require('minimist');
    var map = minimist(argv);
    return map[expression];
  };
  return ArgvEvaluator;
}();
var EnvironmentEvaluator = /** @class */function () {
  function EnvironmentEvaluator() {}
  EnvironmentEvaluator.prototype.eval = function (_context, expression) {
    return process.env[expression];
  };
  return EnvironmentEvaluator;
}();
var JSONDataEvaluator = /** @class */function () {
  function JSONDataEvaluator() {
    this.namespaceDataMap = new Map();
  }
  JSONDataEvaluator.prototype.eval = function (_context, expression) {
    var colonIndex = expression.indexOf(':');
    if (colonIndex === -1) {
      throw new Error('Incorrect expression, namespace not specified');
    }
    var namespace = expression.substring(0, colonIndex);
    var exp = expression.substring(colonIndex + 1);
    if (!this.namespaceDataMap.has(namespace)) {
      throw new Error("Incorrect expression: namespace not recorded: \"".concat(namespace, "\""));
    }
    var data = this.namespaceDataMap.get(namespace);
    return runExpression(exp, data);
  };
  JSONDataEvaluator.prototype.recordData = function (namespace, data) {
    this.namespaceDataMap.set(namespace, data);
  };
  JSONDataEvaluator.prototype.getJSONData = function (namespace) {
    return this.namespaceDataMap.get(namespace);
  };
  return JSONDataEvaluator;
}();
function runExpression(expression, rootContext) {
  var fn = compileExpression(expression);
  return fn(rootContext);
}
function compileExpression(expression) {
  if (expression.indexOf(',') > -1) {
    throw new Error("Incorrect expression syntax, The ',' is not allowed in expression: \"".concat(expression, "\""));
  }
  if (expression.length > 120) {
    throw new Error("Incorrect expression syntax, expression length cannot be greater than 120, but actual: ".concat(expression.length));
  }
  if (/\(.*?\)/.test(expression)) {
    throw new Error("Incorrect expression syntax, parentheses are not allowed in expression: \"".concat(expression, "\""));
  }
  expression = expression.trim();
  if (expression === '') {
    return function (root) {
      return root;
    };
  }
  var rootVarName = varName('context');
  return new Function(rootVarName, "\n        \"use strict\";\n        try {\n            return ".concat(rootVarName, ".").concat(expression, ";\n        } catch(error) { throw error }\n    "));
}
var VAR_SEQUENCE = Date.now();
function varName(prefix) {
  return "".concat(prefix).concat((VAR_SEQUENCE++).toString(16));
}
var Lifecycle;
(function (Lifecycle) {
  Lifecycle["PRE_INJECT"] = "ioc-scope:pre-inject";
  Lifecycle["POST_INJECT"] = "ioc-scope:post-inject";
  Lifecycle["PRE_DESTROY"] = "ioc-scope:pre-destroy";
})(Lifecycle || (Lifecycle = {}));
function invokePreDestroy(instance) {
  var clazz = instance === null || instance === void 0 ? void 0 : instance.constructor;
  if (!clazz) {
    return;
  }
  var metadata = MetadataInstanceManager.getMetadata(clazz, ClassMetadata);
  var preDestroyMethods = metadata.getMethods(Lifecycle.PRE_DESTROY);
  preDestroyMethods.forEach(function (methodName) {
    var method = clazz.prototype[methodName];
    if (typeof method === 'function') {
      method.apply(instance);
    }
  });
}
var instanceSerialNo$1 = -1;
var ComponentInstanceWrapper = /** @class */function () {
  function ComponentInstanceWrapper(instance) {
    this.instance = instance;
    this.serialNo = ++instanceSerialNo$1;
  }
  ComponentInstanceWrapper.prototype.compareTo = function (other) {
    return this.serialNo > other.serialNo ? -1 : this.serialNo < other.serialNo ? 1 : 0;
  };
  return ComponentInstanceWrapper;
}();
var SingletonInstanceResolution = /** @class */function () {
  function SingletonInstanceResolution() {
    this.INSTANCE_MAP = new Map();
  }
  SingletonInstanceResolution.prototype.getInstance = function (options) {
    var _a;
    return (_a = this.INSTANCE_MAP.get(options.identifier)) === null || _a === void 0 ? void 0 : _a.instance;
  };
  SingletonInstanceResolution.prototype.saveInstance = function (options) {
    this.INSTANCE_MAP.set(options.identifier, new ComponentInstanceWrapper(options.instance));
  };
  SingletonInstanceResolution.prototype.shouldGenerate = function (options) {
    return !this.INSTANCE_MAP.has(options.identifier);
  };
  SingletonInstanceResolution.prototype.destroy = function () {
    var instanceWrappers = Array.from(this.INSTANCE_MAP.values());
    instanceWrappers.sort(function (a, b) {
      return a.compareTo(b);
    });
    instanceWrappers.forEach(function (instanceWrapper) {
      invokePreDestroy(instanceWrapper.instance);
    });
    this.INSTANCE_MAP.clear();
  };
  return SingletonInstanceResolution;
}();
var SINGLETON_INSTANCE_SINGLETON = new SingletonInstanceResolution();
var GlobalSharedInstanceResolution = /** @class */function () {
  function GlobalSharedInstanceResolution() {}
  GlobalSharedInstanceResolution.prototype.getInstance = function (options) {
    return SINGLETON_INSTANCE_SINGLETON.getInstance(options);
  };
  GlobalSharedInstanceResolution.prototype.saveInstance = function (options) {
    SINGLETON_INSTANCE_SINGLETON.saveInstance(options);
  };
  GlobalSharedInstanceResolution.prototype.shouldGenerate = function (options) {
    return SINGLETON_INSTANCE_SINGLETON.shouldGenerate(options);
  };
  GlobalSharedInstanceResolution.prototype.destroy = function () {
    // PASS;
  };
  return GlobalSharedInstanceResolution;
}();
var TransientInstanceResolution = /** @class */function () {
  function TransientInstanceResolution() {
    this.instances = new Set();
  }
  TransientInstanceResolution.prototype.shouldGenerate = function () {
    return true;
  };
  TransientInstanceResolution.prototype.getInstance = function () {
    return;
  };
  TransientInstanceResolution.prototype.saveInstance = function (options) {
    this.instances.add(options.instance);
  };
  TransientInstanceResolution.prototype.destroy = function () {
    this.instances.forEach(function (it) {
      if (!it) {
        return;
      }
      invokePreDestroy(it);
    });
    this.instances.clear();
  };
  TransientInstanceResolution.prototype.destroyThat = function (instance) {
    if (!this.instances.has(instance)) {
      return;
    }
    invokePreDestroy(instance);
    this.instances.delete(instance);
  };
  return TransientInstanceResolution;
}();
var LifecycleManager = /** @class */function () {
  function LifecycleManager(componentClass, container) {
    this.componentClass = componentClass;
    this.container = container;
    this.classMetadataReader = MetadataInstanceManager.getMetadata(this.componentClass, ClassMetadata).reader();
  }
  LifecycleManager.prototype.invokePreInjectMethod = function (instance) {
    var methods = this.classMetadataReader.getMethods(Lifecycle.PRE_INJECT);
    this.invokeLifecycleMethods(instance, methods);
  };
  LifecycleManager.prototype.invokePostInjectMethod = function (instance) {
    var methods = this.classMetadataReader.getMethods(Lifecycle.POST_INJECT);
    this.invokeLifecycleMethods(instance, methods);
  };
  LifecycleManager.prototype.invokePreDestroyInjectMethod = function (instance) {
    var methods = this.classMetadataReader.getMethods(Lifecycle.PRE_DESTROY);
    this.invokeLifecycleMethods(instance, methods);
  };
  LifecycleManager.prototype.invokeLifecycleMethods = function (instance, methodKeys) {
    var _this = this;
    methodKeys.forEach(function (key) {
      _this.container.invoke(instance[key], {
        context: instance
      });
    });
  };
  return LifecycleManager;
}();
var ComponentInstanceBuilder = /** @class */function () {
  function ComponentInstanceBuilder(componentClass, container, instAwareProcessorManager) {
    this.componentClass = componentClass;
    this.container = container;
    this.instAwareProcessorManager = instAwareProcessorManager;
    this.getConstructorArgs = function () {
      return [];
    };
    this.propertyFactories = new FactoryRecorder();
    this.lazyMode = true;
    this.lifecycleResolver = new LifecycleManager(componentClass, container);
    var reader = MetadataInstanceManager.getMetadata(componentClass, ClassMetadata).reader();
    this.classMetadataReader = reader;
    this.appendClassMetadata(reader);
  }
  ComponentInstanceBuilder.prototype.appendLazyMode = function (lazyMode) {
    this.lazyMode = lazyMode;
  };
  ComponentInstanceBuilder.prototype.appendClassMetadata = function (classMetadataReader) {
    var e_1, _a;
    var _this = this;
    var types = classMetadataReader.getConstructorParameterTypes();
    this.getConstructorArgs = function () {
      return types.map(function (it) {
        return _this.container.getInstance(it.isNewable ? it.clazz : it.identifier);
      });
    };
    var globalMetadataReader = GlobalMetadata.getReader();
    var propertyTypes = classMetadataReader.getPropertyTypeMap();
    var _loop_1 = function (propertyName, propertyType) {
      if (propertyType.isNewable) {
        this_1.propertyFactories.append(propertyName, function (container, owner) {
          return function () {
            return container.getInstance(propertyType.clazz, owner);
          };
        });
        return "continue";
      }
      var identifier = propertyType.identifier;
      var factoryDef = this_1.container.getFactory(identifier);
      if (factoryDef) {
        this_1.propertyFactories.set(propertyName, factoryDef);
        return "continue";
      }
      var propertyClassMetadata = globalMetadataReader.getClassMetadata(identifier);
      if (propertyClassMetadata) {
        this_1.propertyFactories.set(propertyName, ServiceFactoryDef.createFromClassMetadata(propertyClassMetadata));
        return "continue";
      }
      var propertyFactoryDef = globalMetadataReader.getComponentFactory(identifier);
      if (propertyFactoryDef) {
        this_1.propertyFactories.set(propertyName, propertyFactoryDef);
      }
    };
    var this_1 = this;
    try {
      for (var propertyTypes_1 = __values(propertyTypes), propertyTypes_1_1 = propertyTypes_1.next(); !propertyTypes_1_1.done; propertyTypes_1_1 = propertyTypes_1.next()) {
        var _b = __read(propertyTypes_1_1.value, 2),
          propertyName = _b[0],
          propertyType = _b[1];
        _loop_1(propertyName, propertyType);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (propertyTypes_1_1 && !propertyTypes_1_1.done && (_a = propertyTypes_1.return)) _a.call(propertyTypes_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };
  ComponentInstanceBuilder.prototype.build = function () {
    var _a, _b;
    var args = this.getConstructorArgs();
    var properties = this.createPropertiesGetterBuilder();
    var isCreatingInstAwareProcessor = this.instAwareProcessorManager.isInstAwareProcessorClass(this.componentClass);
    if (isCreatingInstAwareProcessor) {
      var instance = new ((_a = this.componentClass).bind.apply(_a, __spreadArray([void 0], __read(args), false)))();
      this.lifecycleResolver.invokePreInjectMethod(instance);
      defineProperties.call(this, instance);
      this.lifecycleResolver.invokePostInjectMethod(instance);
      return instance;
    } else {
      var instance = this.instAwareProcessorManager.beforeInstantiation(this.componentClass, args);
      if (!instance) {
        instance = new ((_b = this.componentClass).bind.apply(_b, __spreadArray([void 0], __read(args), false)))();
      }
      this.lifecycleResolver.invokePreInjectMethod(instance);
      defineProperties.call(this, instance);
      instance = this.instAwareProcessorManager.afterInstantiation(instance);
      this.lifecycleResolver.invokePostInjectMethod(instance);
      return instance;
    }
    function defineProperties(instance) {
      var _this = this;
      properties.forEach(function (value, key) {
        var getter = value(instance);
        _this.defineProperty(instance, typeof key === 'number' ? "".concat(key) : key, getter);
      });
    }
  };
  ComponentInstanceBuilder.prototype.defineProperty = function (instance, key, getter) {
    if (this.lazyMode) {
      lazy.lazyProp(instance, key, getter);
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      instance[key] = getter();
    }
  };
  ComponentInstanceBuilder.prototype.createPropertiesGetterBuilder = function () {
    var e_2, _a;
    var _this = this;
    var result = new Map();
    var propertyTypeMap = this.classMetadataReader.getPropertyTypeMap();
    var _loop_2 = function (key, factoryDef) {
      var injectionType = propertyTypeMap.get(key);
      var isArray = !injectionType.isNewable && injectionType.clazz === Array;
      if (!isArray) {
        if (factoryDef.factories.size > 1) {
          throw new Error("Multiple matching injectables found for property injection,\nbut property ".concat(key.toString(), " is not an array,\n                        It is ambiguous to determine which object should be injected!"));
        }
        var _e = __read(factoryDef.factories.entries().next().value, 2),
          factory_1 = _e[0],
          injections_1 = _e[1];
        result.set(key, function (instance) {
          var producer = factory_1(_this.container, instance);
          return function () {
            return _this.container.invoke(producer, {
              injections: injections_1
            });
          };
        });
      } else {
        result.set(key, function (instance) {
          var producerAndInjections = Array.from(factoryDef.factories).map(function (_a) {
            var _b = __read(_a, 2),
              factory = _b[0],
              injections = _b[1];
            return [factory(_this.container, instance), injections];
          });
          return function () {
            return producerAndInjections.map(function (_a) {
              var _b = __read(_a, 2),
                producer = _b[0],
                injections = _b[1];
              return _this.container.invoke(producer, {
                injections: injections
              });
            });
          };
        });
      }
    };
    try {
      for (var _b = __values(this.propertyFactories.iterator()), _c = _b.next(); !_c.done; _c = _b.next()) {
        var _d = __read(_c.value, 2),
          key = _d[0],
          factoryDef = _d[1];
        _loop_2(key, factoryDef);
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }
    return result;
  };
  return ComponentInstanceBuilder;
}();
var EventEmitter = /** @class */function () {
  function EventEmitter() {
    this.events = new Map();
  }
  EventEmitter.prototype.on = function (type, listener) {
    var listeners = this.events.get(type);
    if (listeners) {
      if (listeners.indexOf(listener) === -1) {
        listeners.push(listener);
      }
    } else {
      listeners = [listener];
      this.events.set(type, listeners);
    }
    return function () {
      var ls = listeners;
      var index = ls.indexOf(listener);
      if (index > -1) {
        ls.splice(index, 1);
      }
    };
  };
  EventEmitter.prototype.emit = function (type) {
    var _a;
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    (_a = this.events.get(type)) === null || _a === void 0 ? void 0 : _a.forEach(function (fn) {
      fn.apply(void 0, __spreadArray([], __read(args), false));
    });
  };
  return EventEmitter;
}();
var InstantiationAwareProcessorManager = /** @class */function () {
  function InstantiationAwareProcessorManager(container) {
    this.container = container;
    this.instAwareProcessorClasses = new Set();
  }
  InstantiationAwareProcessorManager.prototype.appendInstAwareProcessorClass = function (instAwareProcessorClass) {
    this.instAwareProcessorClasses.add(instAwareProcessorClass);
  };
  InstantiationAwareProcessorManager.prototype.appendInstAwareProcessorClasses = function (instAwareProcessorClasses) {
    var _this = this;
    instAwareProcessorClasses.forEach(function (it) {
      _this.instAwareProcessorClasses.add(it);
    });
  };
  InstantiationAwareProcessorManager.prototype.beforeInstantiation = function (componentClass, args) {
    var instAwareProcessors = this.instAwareProcessorInstances;
    var instance;
    instAwareProcessors.some(function (processor) {
      if (!processor.beforeInstantiation) {
        return false;
      }
      instance = processor.beforeInstantiation(componentClass, args);
      return !!instance;
    });
    return instance;
  };
  InstantiationAwareProcessorManager.prototype.afterInstantiation = function (instance) {
    return this.instAwareProcessorInstances.reduce(function (instance, processor) {
      if (processor.afterInstantiation) {
        var result = processor.afterInstantiation(instance);
        if (result) {
          return result;
        }
      }
      return instance;
    }, instance);
  };
  InstantiationAwareProcessorManager.prototype.isInstAwareProcessorClass = function (cls) {
    var classes = this.getInstAwareProcessorClasses();
    return classes.indexOf(cls) > -1;
  };
  InstantiationAwareProcessorManager.prototype.getInstAwareProcessorClasses = function () {
    var globalInstAwareProcessorClasses = GlobalMetadata.getInstance().reader().getInstAwareProcessorClasses();
    return globalInstAwareProcessorClasses.concat(Array.from(this.instAwareProcessorClasses));
  };
  __decorate([lazy.lazyMember({
    evaluate: function (instance) {
      var globalInstAwareProcessorClasses = GlobalMetadata.getReader().getInstAwareProcessorClasses();
      var instAwareProcessorClasses = globalInstAwareProcessorClasses.concat(Array.from(instance.instAwareProcessorClasses));
      return instAwareProcessorClasses.map(function (it) {
        return instance.container.getInstance(it);
      });
    },
    resetBy: [function (instance) {
      return instance.instAwareProcessorClasses.size;
    }, function () {
      var globalInstAwareProcessorClasses = GlobalMetadata.getReader().getInstAwareProcessorClasses();
      return globalInstAwareProcessorClasses.length;
    }]
  }), __metadata("design:type", Array)], InstantiationAwareProcessorManager.prototype, "instAwareProcessorInstances", void 0);
  return InstantiationAwareProcessorManager;
}();
function hasArgs(options) {
  return 'args' in options;
}
function hasInjections(options) {
  return 'injections' in options;
}
var PRE_DESTROY_EVENT_KEY = 'container:event:pre-destroy';
var PRE_DESTROY_THAT_EVENT_KEY = 'container:event:pre-destroy-that';
var INSTANCE_PRE_DESTROY_METHOD = Symbol('solidium:instance-pre-destroy');
var ApplicationContext = /** @class */function () {
  function ApplicationContext(options) {
    if (options === void 0) {
      options = {};
    }
    var _a;
    this.resolutions = new Map();
    this.factories = new FactoryRecorder();
    this.evaluatorClasses = new Map();
    this.eventEmitter = new EventEmitter();
    this.isDestroyed = false;
    this.defaultScope = options.defaultScope || InstanceScope.SINGLETON;
    this.lazyMode = (_a = options.lazyMode) !== null && _a !== void 0 ? _a : true;
    this.registerInstanceScopeResolution(InstanceScope.SINGLETON, SingletonInstanceResolution);
    this.registerInstanceScopeResolution(InstanceScope.GLOBAL_SHARED_SINGLETON, GlobalSharedInstanceResolution);
    this.registerInstanceScopeResolution(InstanceScope.TRANSIENT, TransientInstanceResolution);
    this.registerEvaluator(ExpressionType.JSON_PATH, JSONDataEvaluator);
    if (isNodeJs) {
      this.registerEvaluator(ExpressionType.ENV, EnvironmentEvaluator);
      this.registerEvaluator(ExpressionType.ARGV, ArgvEvaluator);
    }
    this.instAwareProcessorManager = new InstantiationAwareProcessorManager(this);
    this.registerInstAwareProcessor(AOPInstantiationAwareProcessor.create(this));
  }
  ApplicationContext.prototype.getInstance = function (symbol, owner) {
    if (typeof symbol === 'string' || typeof symbol === 'symbol') {
      return this.getInstanceBySymbol(symbol, owner);
    }
    return this.getInstanceByClass(symbol, owner);
  };
  ApplicationContext.prototype.getInstanceBySymbol = function (symbol, owner) {
    var _this = this;
    var factoryDef = this.getFactory(symbol);
    if (factoryDef) {
      var producer = factoryDef.produce(this, owner);
      var resolution_1 = this.getScropeResolutionInstance(factoryDef.scope);
      if (!resolution_1.shouldGenerate({
        identifier: symbol,
        owner: owner
      })) {
        return resolution_1.getInstance({
          identifier: symbol,
          owner: owner
        });
      }
      var instances = producer();
      var results = instances.map(function (it) {
        _this.attachPreDestroyHook(it);
        var constr = it === null || it === void 0 ? void 0 : it.constructor;
        if (typeof constr === 'function') {
          var componentClass = constr;
          var resolver = new LifecycleManager(componentClass, _this);
          var isInstAwareProcessor = _this.instAwareProcessorManager.isInstAwareProcessorClass(componentClass);
          resolver.invokePreInjectMethod(it);
          if (!isInstAwareProcessor) {
            it = _this.instAwareProcessorManager.afterInstantiation(it);
          }
          resolver.invokePostInjectMethod(it);
        }
        resolution_1.saveInstance({
          identifier: symbol,
          instance: it
        });
        return it;
      });
      return results.length === 1 ? results[0] : results;
    } else {
      var classMetadata = GlobalMetadata.getInstance().reader().getClassMetadata(symbol);
      if (!classMetadata) {
        throw new Error("Class alias not found: ".concat(symbol.toString()));
      } else {
        var clazz = classMetadata.reader().getClass();
        return this.getInstanceByClass(clazz, owner);
      }
    }
  };
  ApplicationContext.prototype.getInstanceByClass = function (componentClass, owner) {
    if (componentClass === ApplicationContext) {
      return this;
    }
    var reader = ClassMetadata.getInstance(componentClass).reader();
    var scope = reader.getScope();
    var resolution = this.resolutions.get(scope !== null && scope !== void 0 ? scope : this.defaultScope) || this.resolutions.get(this.defaultScope);
    var getInstanceOptions = {
      identifier: componentClass,
      owner: owner,
      ownerPropertyKey: undefined
    };
    if (resolution.shouldGenerate(getInstanceOptions)) {
      var builder = this.createComponentInstanceBuilder(componentClass);
      var instance = builder.build();
      var saveInstanceOptions = __assign(__assign({}, getInstanceOptions), {
        instance: instance
      });
      resolution.saveInstance(saveInstanceOptions);
      this.attachPreDestroyHook(instance);
      return instance;
    } else {
      return resolution.getInstance(getInstanceOptions);
    }
  };
  ApplicationContext.prototype.attachPreDestroyHook = function (instances) {
    var _this = this;
    var instancesArray = Array.isArray(instances) ? instances : [instances];
    instancesArray.forEach(function (it) {
      var instance = it;
      if (typeof instance !== 'object' || instance === null) {
        return;
      }
      if (Reflect.has(instance, INSTANCE_PRE_DESTROY_METHOD)) {
        return;
      }
      var clazz = instance.constructor;
      if (!clazz) {
        return;
      }
      var metadata = MetadataInstanceManager.getMetadata(instance.constructor, ClassMetadata);
      metadata.addLifecycleMethod(INSTANCE_PRE_DESTROY_METHOD, Lifecycle.PRE_DESTROY);
      Reflect.set(instance, INSTANCE_PRE_DESTROY_METHOD, function () {
        _this.eventEmitter.emit(PRE_DESTROY_EVENT_KEY, instance);
      });
    });
  };
  ApplicationContext.prototype.createComponentInstanceBuilder = function (componentClass) {
    var builder = new ComponentInstanceBuilder(componentClass, this, this.instAwareProcessorManager);
    builder.appendLazyMode(this.lazyMode);
    return builder;
  };
  ApplicationContext.prototype.getFactory = function (key) {
    var factory = GlobalMetadata.getInstance().reader().getComponentFactory(key);
    if (!factory) {
      return this.factories.get(key);
    }
    return factory;
  };
  ApplicationContext.prototype.bindFactory = function (symbol, factory, injections, scope) {
    if (scope === void 0) {
      scope = InstanceScope.SINGLETON;
    }
    this.factories.append(symbol, factory, injections, scope);
  };
  ApplicationContext.prototype.invoke = function (func, options) {
    var _this = this;
    if (options === void 0) {
      options = {};
    }
    var fn;
    if (arguments.length > 1) {
      fn = func.bind(options.context);
    } else {
      fn = func;
    }
    if (hasArgs(options)) {
      return options.args ? fn.apply(void 0, __spreadArray([], __read(options.args), false)) : fn();
    }
    var argsIndentifiers = [];
    if (hasInjections(options)) {
      argsIndentifiers = options.injections;
    } else {
      var metadata = MetadataInstanceManager.getMetadata(fn, FunctionMetadata).reader();
      argsIndentifiers = metadata.getParameters();
    }
    var args = argsIndentifiers.map(function (identifier, index) {
      var instance = _this.getInstance(identifier);
      if (Array.isArray(instance)) {
        var isArrayType = identifier === Array;
        if (isArrayType) {
          return instance;
        }
        if (instance.length > 1) {
          throw new Error("Multiple matching injectables found for parameter at ".concat(index, "."));
        }
        return instance[0];
      }
      return instance;
    });
    return args.length > 0 ? fn.apply(void 0, __spreadArray([], __read(args), false)) : fn();
  };
  ApplicationContext.prototype.destroy = function () {
    if (this.isDestroyed) {
      return;
    }
    this.isDestroyed = true;
    this.eventEmitter.emit(PRE_DESTROY_EVENT_KEY);
    this.resolutions.forEach(function (it) {
      it.destroy();
    });
  };
  ApplicationContext.prototype.evaluate = function (expression, options) {
    var evaluatorClass = this.evaluatorClasses.get(options.type);
    if (!evaluatorClass) {
      throw new TypeError("Unknown evaluator name: ".concat(options.type));
    }
    var evaluator = this.getInstance(evaluatorClass);
    return evaluator.eval(this, expression, options.externalArgs);
  };
  ApplicationContext.prototype.recordJSONData = function (namespace, data) {
    var evaluator = this.getInstance(JSONDataEvaluator);
    evaluator.recordData(namespace, data);
  };
  ApplicationContext.prototype.getJSONData = function (namespace) {
    var evaluator = this.getInstance(JSONDataEvaluator);
    return evaluator.getJSONData(namespace);
  };
  ApplicationContext.prototype.bindInstance = function (identifier, instance) {
    var resolution = this.resolutions.get(InstanceScope.SINGLETON);
    resolution === null || resolution === void 0 ? void 0 : resolution.saveInstance({
      identifier: identifier,
      instance: instance
    });
  };
  ApplicationContext.prototype.registerInstanceScopeResolution = function (scope, resolutionConstructor, constructorArgs) {
    this.resolutions.set(scope, new (resolutionConstructor.bind.apply(resolutionConstructor, __spreadArray([void 0], __read(constructorArgs !== null && constructorArgs !== void 0 ? constructorArgs : []), false)))());
  };
  ApplicationContext.prototype.getScropeResolutionInstance = function (scope) {
    var _a;
    return (_a = this.resolutions.get(scope)) !== null && _a !== void 0 ? _a : this.resolutions.get(this.defaultScope);
  };
  ApplicationContext.prototype.registerEvaluator = function (name, evaluatorClass) {
    var metadata = MetadataInstanceManager.getMetadata(evaluatorClass, ClassMetadata);
    metadata.setScope(InstanceScope.SINGLETON);
    this.evaluatorClasses.set(name, evaluatorClass);
  };
  /**
   * @description Registers an InstantiationAwareProcessor class to customize
   *      the instantiation process at various stages within the IoC
   * @deprecated Replaced with {@link registerBeforeInstantiationProcessor} and {@link registerAfterInstantiationProcessor}
   * @param {Newable<PartialInstAwareProcessor>} clazz
   * @see InstantiationAwareProcessor
   * @since 1.0.0
   */
  ApplicationContext.prototype.registerInstAwareProcessor = function (clazz) {
    this.instAwareProcessorManager.appendInstAwareProcessorClass(clazz);
  };
  ApplicationContext.prototype.registerBeforeInstantiationProcessor = function (processor) {
    this.instAwareProcessorManager.appendInstAwareProcessorClass(/** @class */function () {
      function InnerProcessor() {}
      InnerProcessor.prototype.beforeInstantiation = function (constructor, args) {
        return processor(constructor, args);
      };
      return InnerProcessor;
    }());
  };
  ApplicationContext.prototype.registerAfterInstantiationProcessor = function (processor) {
    this.instAwareProcessorManager.appendInstAwareProcessorClass(/** @class */function () {
      function InnerProcessor() {}
      InnerProcessor.prototype.afterInstantiation = function (instance) {
        return processor(instance);
      };
      return InnerProcessor;
    }());
  };
  ApplicationContext.prototype.onPreDestroy = function (listener) {
    return this.eventEmitter.on(PRE_DESTROY_EVENT_KEY, listener);
  };
  ApplicationContext.prototype.onPreDestroyThat = function (listener) {
    return this.eventEmitter.on(PRE_DESTROY_THAT_EVENT_KEY, listener);
  };
  ApplicationContext.prototype.getClassMetadata = function (ctor) {
    return ClassMetadata.getReader(ctor);
  };
  ApplicationContext.prototype.destroyTransientInstance = function (instance) {
    var _a;
    var resolution = this.resolutions.get(InstanceScope.TRANSIENT);
    (_a = resolution === null || resolution === void 0 ? void 0 : resolution.destroyThat) === null || _a === void 0 ? void 0 : _a.call(resolution, instance);
  };
  return ApplicationContext;
}();
function Mark(key, value) {
  if (value === void 0) {
    value = true;
  }
  return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      args[_i] = arguments[_i];
    }
    if (args.length === 1) {
      // class decorator
      var metadata = MetadataInstanceManager.getMetadata(args[0], ClassMetadata);
      metadata.marker().ctor(key, value);
    } else if (args.length === 2) {
      // property decorator
      var _a = __read(args, 2),
        prototype = _a[0],
        propertyKey = _a[1];
      var metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
      metadata.marker().member(propertyKey).mark(key, value);
    } else if (args.length === 3 && typeof args[2] === 'number') {
      // parameter decorator
      var _b = __read(args, 3),
        prototype = _b[0],
        propertyKey = _b[1],
        index = _b[2];
      var metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
      metadata.marker().parameter(propertyKey, index).mark(key, value);
    } else {
      // method decorator
      var _c = __read(args, 2),
        prototype = _c[0],
        propertyKey = _c[1];
      var metadata = MetadataInstanceManager.getMetadata(prototype.constructor, ClassMetadata);
      metadata.marker().member(propertyKey).mark(key, value);
    }
  };
}

function defineClassDecoratorProcessor(key, processor) {
  var _a;
  return Mark(key, __assign$1((_a = {}, _a[IS_CLASS_DECORATOR_PROCESSOR] = true, _a), processor));
}

function defineMemberDecoratorProcessor(key, processor) {
  var _a;
  return Mark(key, __assign$1((_a = {}, _a[IS_MEMBER_DECORATOR_PROCESSOR] = true, _a), processor));
}

var SOLIDIUM_SOLID_OWNER_PROPERTY_KEY = Symbol("solidium-solid-owner-property");
function runWithSolidiumOwner(instance, callback) {
  var owner = Reflect.get(instance, SOLIDIUM_SOLID_OWNER_PROPERTY_KEY);
  return solidJs.runWithOwner(owner, callback);
}
function setupOwner(instance, owner) {
  Reflect.set(instance, SOLIDIUM_SOLID_OWNER_PROPERTY_KEY, owner);
}

var COMPONENT_TREE_SCOPE = "solidium-component-tree-scope";

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
    var classMetadata = ClassMetadata.getInstance(instance.constructor);
    var preDestroyMethods = classMetadata.getMethods(Lifecycle.PRE_DESTROY);
    preDestroyMethods.forEach(function (methodName) {
      var method = instance[methodName];
      if (typeof method === "function") {
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

function hasOwn(object, propertyKey) {
  if (object === null || object === undefined) {
    return false;
  }
  return Object.hasOwn(object, propertyKey);
}

var SOLIDIUM_MEMBER_DECORATOR_PROCESSOR_KEY = Symbol("solidium-member-decorator-processors");
var SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY = Symbol("solidium-class-decorator-processors");
function initClassDecoratorProcessorsSet(constructor, container) {
  if (hasOwn(constructor, SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY)) {
    return;
  }
  var metadata = ClassMetadata.getInstance(constructor);
  var metadataReader = metadata.reader();
  var classMarkInfo = metadataReader.getCtorMarkInfo();
  var allClassDecoratorProcessor = new Set();
  if (classMarkInfo) {
    var classMarkInfoMembers = __spreadArray$1(__spreadArray$1([], __read$1(Object.getOwnPropertyNames(classMarkInfo)), false), __read$1(Object.getOwnPropertySymbols(classMarkInfo)), false);
    classMarkInfoMembers.forEach(function (markInfoKey) {
      var processor = classMarkInfo[markInfoKey];
      if (typeof processor !== "object" || !processor[IS_CLASS_DECORATOR_PROCESSOR]) {
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
  var metadata = ClassMetadata.getInstance(constructor);
  var metadataReader = metadata.reader();
  var instanceMembers = metadataReader.getAllMarkedMembers();
  var allMemberDecoratorProcessors = new Map();
  instanceMembers.forEach(function (member) {
    var markInfo = metadataReader.getMembersMarkInfo(member);
    if (!markInfo) {
      return;
    }
    var markInfoMembers = __spreadArray$1(__spreadArray$1([], __read$1(Object.getOwnPropertyNames(markInfo)), false), __read$1(Object.getOwnPropertySymbols(markInfo)), false);
    markInfoMembers.forEach(function (key) {
      var markData = markInfo[key];
      if (markData == null || typeof markData !== "object" || !markData[IS_MEMBER_DECORATOR_PROCESSOR]) {
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
  var metadata = ClassMetadata.getInstance(constructor);
  var allClassProcessors = constructor[SOLIDIUM_CLASS_DECORATOR_PROCESSOR_KEY];
  if (allClassProcessors) {
    allClassProcessors.forEach(function (processor) {
      var _a;
      var newInstance = (_a = processor.afterInstantiation) === null || _a === void 0 ? void 0 : _a.call(processor, instance, metadata, container);
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
  var appCtx = new ApplicationContext();
  var IS_MANAGED = Symbol("IS_MANAGED");
  var originGetInstance = appCtx.getInstance;
  appCtx.getInstance = function (id, instanceOwner) {
    var _this = this;
    var _a = __read$1(solidJs.createRoot(function (dispose) {
        return [dispose, originGetInstance.call(_this, id, instanceOwner)];
      }, owner), 2),
      dispose = _a[0],
      instance = _a[1];
    if (instance !== null && typeof instance === "object") {
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
    beforeInstantiation(constructor, appCtx);
    return undefined;
  });
  appCtx.registerAfterInstantiationProcessor(function (instance) {
    setupOwner(instance, owner);
    return instance;
  });
  appCtx.registerAfterInstantiationProcessor(function (instance) {
    return afterInstantiation(instance, appCtx);
  });
  appCtx.registerInstanceScopeResolution(COMPONENT_TREE_SCOPE, ComponentTreeScopeInstanceResolution);
  if (typeof props.init === "function") {
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

function combineSetterInterceptor(before, after) {
  if (typeof before !== "function") {
    return after;
  }
  return function (oldValue, newValue) {
    return after.call(this, oldValue, before.call(this, oldValue, newValue));
  };
}

var extraDatas = new WeakMap();
function extraDataOf(target, key) {
  if (!target || typeof target !== "object") {
    return undefined;
  }
  if (!extraDatas.has(target)) {
    extraDatas.set(target, new Map());
  }
  var metadata = extraDatas.get(target);
  if (!metadata) {
    throw new Error("Will never happen");
  }
  if (!metadata.has(key)) {
    metadata.set(key, new Map());
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return metadata.get(key);
}

var SETTER_INTERCEPTOR_MAP_KEY = Symbol("solidium-setter-interceptors-map");
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
var IS_SIGNAL_MEMBER_METADATA_KEY = "is_signal_member_metadata_key";
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
      var _a = __read$1(solidJs.runWithOwner(owner, function () {
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
      var _a = __read$1(solidJs.runWithOwner(owner, function () {
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

var SOLIDIUM_MARK_CLASS_AUTO = Symbol("solidium-mark-class-auto");
var Auto = defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_AUTO, {
  afterInstantiation: function (instance) {
    if (!instance || typeof instance !== "object") {
      return instance;
    }
    var prototype = Object.getPrototypeOf(instance);
    return new Proxy(instance, {
      get: function (target, p, receiver) {
        if (typeof prototype[p] === "function") {
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

var BATCH_METHOD_MARK_KEY = Symbol("solidium-batch-method-mark-key");
var Batch = defineMemberDecoratorProcessor(BATCH_METHOD_MARK_KEY, {
  afterInstantiation: function (instance, member) {
    var origin = instance[member];
    if (typeof origin !== "function") {
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

var NOT_CHANGED_SYMBOL = Symbol("solidium-not-change-symbol");
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
  var _a = __read$1(solidJs.createSignal(NOT_CHANGED_SYMBOL), 2),
    get = _a[0],
    emitChange = _a[1];
  var getter = solidJs.createMemo(function () {
    var v = get();
    if (v !== NOT_CHANGED_SYMBOL) {
      return fn();
    }
    return NOT_CHANGED_SYMBOL;
  });
  return function () {
    if (solidJs.untrack(get) === NOT_CHANGED_SYMBOL) {
      emitChange(null);
    }
    return getter();
  };
}

var COMPUTED_GETTER_MARK_KEY = Symbol("solidium_computed_getter");
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
    Object.defineProperty(instance, member, __assign$1(__assign$1({}, descriptor), {
      get: getter
    }));
    return instance;
  }
});

var OBSERVE_PROPERTY_MARK_KEY = Symbol("solidium_observed_property");
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
      if ("deps" in options) {
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

var SETTER_INTERCEPTOR_METHOD_MARK_KEY = Symbol("solidium_setter_interceptor_method");
var SetterInterceptor = function (options) {
  switch (typeof options) {
    case "string":
    case "symbol":
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

var SIGNAL_MARK_KEY = Symbol("solidium_mark_as_signal_property");
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

var SOLIDIUM_MARK_CLASS_STORE = Symbol("solidium-mark-class-store");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
var proxyCache = new WeakMap();
var Store = function () {
  return defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_STORE, {
    afterInstantiation: function (instance) {
      if (!instance || typeof instance !== "object") {
        return instance;
      }
      var _a = __read$1(store$1.createStore(instance), 2),
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
            if (!!value && typeof value === "object") {
              return createProxyForNestedObject(value, __spreadArray$1(__spreadArray$1([], __read$1(path), false), [p], false), setter);
            }
            return value;
          },
          set: function (_target, p, newValue) {
            if (path.length === 0) {
              setter(p, newValue);
            } else {
              setter.apply(void 0, __spreadArray$1(__spreadArray$1([], __read$1(path), false), [p, newValue], false));
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

var TRACK_METHOD_MARK_KEY = Symbol("solidium_track_method");
function Track(fn) {
  return Mark(TRACK_METHOD_MARK_KEY, fn);
}

var MissingSolidiumContextError = /** @class */function (_super) {
  __extends$1(MissingSolidiumContextError, _super);
  function MissingSolidiumContextError() {
    var _this = _super.call(this, "<Solidium> not found. Please ensure it is added to the parent node.") || this;
    _this.name = "MissingSolidiumContextError";
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
  var metadata = ClassMetadata.getInstance(cls).reader();
  var scope = metadata.getScope();
  if (scope === InstanceScope.TRANSIENT) {
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
//# sourceMappingURL=index.cjs.js.map
