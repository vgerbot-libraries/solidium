(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@solid-primitives/scheduled'), require('solid-js'), require('reflect-metadata'), require('@vgerbot/lazy'), require('solid-js/web'), require('solid-js/store'), require('idb'), require('@msgpack/msgpack')) :
    typeof define === 'function' && define.amd ? define(['exports', '@solid-primitives/scheduled', 'solid-js', 'reflect-metadata', '@vgerbot/lazy', 'solid-js/web', 'solid-js/store', 'idb', '@msgpack/msgpack'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Persistence = {}, global.scheduled, global.solidJs, null, global.lazy, null, null, global.idb, global.MessagePack));
})(this, (function (exports, scheduled, solidJs, reflectMetadata, lazy, web, store, idb, msgpack) { 'use strict';

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

    var extendStatics$2 = function(d, b) {
        extendStatics$2 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics$2(d, b);
    };

    function __extends$2(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics$2(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign$2 = function() {
        __assign$2 = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign$2.apply(this, arguments);
    };

    function __decorate$2(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata$2(metadataKey, metadataValue) {
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

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
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

    function __read$2(o, n) {
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

    class SignalMap {
      constructor() {
        this.store = new WeakMap();
      }
      get(object, key, initValue) {
        if (object === null || typeof object !== "object") {
          throw new Error("");
        }
        let signalMap = this.store.get(object);
        if (!signalMap) {
          this.store.set(object, signalMap = new Map());
        }
        let signal = signalMap.get(key);
        if (!signal) {
          signalMap.set(key, signal = solidJs.createSignal(initValue));
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
    const IS_MEMBER_DECORATOR_PROCESSOR = Symbol("solidium-is-member-decorator-processor");
    const IS_CLASS_DECORATOR_PROCESSOR = Symbol("solidium-is-class-decorator-processor");
    var Advice$1;
    (function (Advice) {
      Advice[Advice["Before"] = 0] = "Before";
      Advice[Advice["After"] = 1] = "After";
      Advice[Advice["Around"] = 2] = "Around";
      Advice[Advice["AfterReturn"] = 3] = "AfterReturn";
      Advice[Advice["Thrown"] = 4] = "Thrown";
      Advice[Advice["Finally"] = 5] = "Finally";
    })(Advice$1 || (Advice$1 = {}));

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

    var extendStatics$1 = function (d, b) {
      extendStatics$1 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      };
      return extendStatics$1(d, b);
    };
    function __extends$1(d, b) {
      if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      extendStatics$1(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$1 = function () {
      __assign$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
      return __assign$1.apply(this, arguments);
    };
    function __decorate$1(decorators, target, key, desc) {
      var c = arguments.length,
        r = c < 3 ? target : desc,
        d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __metadata$1(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }
    function __read$1(o, n) {
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
    function __spreadArray$1(to, from, pack) {
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
    function createDefaultValueMap$1(factory) {
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
    function getMethodDescriptors$1(prototype) {
      if (typeof prototype !== 'object' || prototype === null || Object.prototype === prototype || Function.prototype === prototype) {
        return {};
      }
      var superPrototype = Object.getPrototypeOf(prototype);
      var superDescriptors = superPrototype === prototype ? {} : getMethodDescriptors$1(superPrototype);
      return Object.assign(superDescriptors, Object.getOwnPropertyDescriptors(prototype));
    }
    function getAllMethodMemberNames$1(cls) {
      var descriptors = getMethodDescriptors$1(cls.prototype);
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
    var metadataInstanceMap$1 = createDefaultValueMap$1(function () {
      return new Set();
    });
    var MetadataInstanceManager$1 = /** @class */function () {
      function MetadataInstanceManager() {}
      MetadataInstanceManager.getMetadata = function (target, metadataClass) {
        var key = metadataClass.getReflectKey();
        var metadata = Reflect.getMetadata(key, target);
        if (!metadata) {
          metadata = new metadataClass();
          metadata.init(target);
          Reflect.defineMetadata(key, metadata, target);
          var instanceSet = metadataInstanceMap$1.get(metadataClass);
          instanceSet.add(metadata);
        }
        return metadata;
      };
      MetadataInstanceManager.getAllInstanceof = function (metadataClass) {
        return Array.from(metadataInstanceMap$1.get(metadataClass));
      };
      return MetadataInstanceManager;
    }();

    // eslint-disable @typescript-eslint/no-explicit-any
    var CLASS_METADATA_KEY$1 = 'ioc:class-metadata';
    var MarkInfoContainer$1 = /** @class */function () {
      function MarkInfoContainer() {
        this.map = createDefaultValueMap$1(function () {
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
    var ParameterMarkInfoContainer$1 = /** @class */function () {
      function ParameterMarkInfoContainer() {
        this.map = createDefaultValueMap$1(function () {
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
    var ClassMetadata$1 = /** @class */function () {
      function ClassMetadata() {
        this.constructorParameterTypes = [];
        this.lifecycleMethodsMap = {};
        this.propertyTypesMap = new Map();
        this.marks = {
          ctor: {},
          members: new MarkInfoContainer$1(),
          params: new ParameterMarkInfoContainer$1()
        };
      }
      ClassMetadata.getReflectKey = function () {
        return CLASS_METADATA_KEY$1;
      };
      ClassMetadata.getInstance = function (ctor) {
        return MetadataInstanceManager$1.getMetadata(ctor, ClassMetadata);
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
            return __assign$1({}, _this.marks.ctor);
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
    var InstanceScope$1;
    (function (InstanceScope) {
      InstanceScope["SINGLETON"] = "ioc-resolution:container-singleton";
      InstanceScope["TRANSIENT"] = "ioc-resolution:transient";
      InstanceScope["GLOBAL_SHARED_SINGLETON"] = "ioc-resolution:global-shared-singleton";
    })(InstanceScope$1 || (InstanceScope$1 = {}));
    var ServiceFactoryDef$1 = /** @class */function () {
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
        var def = new ServiceFactoryDef(metadata.reader().getClass(), InstanceScope$1.SINGLETON);
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
        if (this.scope === InstanceScope$1.SINGLETON && this.factories.size === 1 && this.factories.has(factory)) {
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
          var _b = __read$1(_a, 2),
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
    var FactoryRecorder$1 = /** @class */function () {
      function FactoryRecorder() {
        this.factories = new Map();
      }
      FactoryRecorder.prototype.append = function (identifier, factory, injections, scope) {
        if (injections === void 0) {
          injections = [];
        }
        if (scope === void 0) {
          scope = InstanceScope$1.SINGLETON;
        }
        var def = this.factories.get(identifier);
        if (def) {
          def.append(factory, injections);
        } else {
          def = new ServiceFactoryDef$1(identifier, scope);
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
    var GlobalMetadata$1 = /** @class */function () {
      function GlobalMetadata() {
        this.classAliasMetadataMap = new Map();
        this.componentFactories = new FactoryRecorder$1();
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
          scope = InstanceScope$1.SINGLETON;
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
    var Pointcut$1 = /** @class */function () {
      function Pointcut() {}
      Pointcut.combine = function () {
        var pointcuts = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          pointcuts[_i] = arguments[_i];
        }
        return new OrPointcut$1(pointcuts);
      };
      Pointcut.of = function (cls) {
        var methodNames = [];
        for (var _i = 1; _i < arguments.length; _i++) {
          methodNames[_i - 1] = arguments[_i];
        }
        var entries = new Map();
        var methods = new Set(methodNames);
        if (arguments.length === 1) {
          getAllMethodMemberNames$1(cls).forEach(function (methodName) {
            methods.add(methodName);
          });
        }
        entries.set(cls, methods);
        return new PrecitePointcut$1(entries);
      };
      /**
       * @deprecated
       */
      Pointcut.testMatch = function (cls, regex) {
        return Pointcut.match(cls, regex);
      };
      Pointcut.match = function (cls, regex) {
        return new MemberMatchPointcut$1(cls, regex);
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
          return new OrPointcut$1(classes.map(function (cls) {
            return Pointcut.of.apply(Pointcut, __spreadArray$1([cls], __read$1(methodNames), false));
          }));
        };
        var match = function (regex) {
          return new OrPointcut$1(classes.map(function (cls) {
            return new MemberMatchPointcut$1(cls, regex);
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
        return new MarkedPointcut$1(type, value);
      };
      Pointcut.class = function (cls) {
        return new ClassPointcut$1(cls);
      };
      return Pointcut;
    }();
    var OrPointcut$1 = /** @class */function (_super) {
      __extends$1(OrPointcut, _super);
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
    }(Pointcut$1);
    var PrecitePointcut$1 = /** @class */function (_super) {
      __extends$1(PrecitePointcut, _super);
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
    }(Pointcut$1);
    var MarkedPointcut$1 = /** @class */function (_super) {
      __extends$1(MarkedPointcut, _super);
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
        var metadata = MetadataInstanceManager$1.getMetadata(jpIdentifier, ClassMetadata$1);
        var markInfo = metadata.reader().getMembersMarkInfo(jpMember);
        return markInfo[this.markedType] === this.markedValue;
      };
      return MarkedPointcut;
    }(Pointcut$1);
    var MemberMatchPointcut$1 = /** @class */function (_super) {
      __extends$1(MemberMatchPointcut, _super);
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
    }(Pointcut$1);
    var ClassPointcut$1 = /** @class */function (_super) {
      __extends$1(ClassPointcut, _super);
      function ClassPointcut(clazz) {
        var _this = _super.call(this) || this;
        _this.clazz = clazz;
        return _this;
      }
      ClassPointcut.prototype.test = function (jpIdentifier) {
        return jpIdentifier === this.clazz;
      };
      return ClassPointcut;
    }(Pointcut$1);
    var ExpressionType$1;
    (function (ExpressionType) {
      ExpressionType["ENV"] = "inject-environment-variables";
      ExpressionType["JSON_PATH"] = "inject-json-data";
      ExpressionType["ARGV"] = "inject-argv";
    })(ExpressionType$1 || (ExpressionType$1 = {}));
    (function () {
      try {
        return process.versions.node !== null;
      } catch (_e) {
        return false;
      }
    })();
    var Lifecycle$1;
    (function (Lifecycle) {
      Lifecycle["PRE_INJECT"] = "ioc-scope:pre-inject";
      Lifecycle["POST_INJECT"] = "ioc-scope:post-inject";
      Lifecycle["PRE_DESTROY"] = "ioc-scope:pre-destroy";
    })(Lifecycle$1 || (Lifecycle$1 = {}));
    /** @class */(function () {
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
        var globalInstAwareProcessorClasses = GlobalMetadata$1.getInstance().reader().getInstAwareProcessorClasses();
        return globalInstAwareProcessorClasses.concat(Array.from(this.instAwareProcessorClasses));
      };
      __decorate$1([lazy.lazyMember({
        evaluate: function (instance) {
          var globalInstAwareProcessorClasses = GlobalMetadata$1.getReader().getInstAwareProcessorClasses();
          var instAwareProcessorClasses = globalInstAwareProcessorClasses.concat(Array.from(instance.instAwareProcessorClasses));
          return instAwareProcessorClasses.map(function (it) {
            return instance.container.getInstance(it);
          });
        },
        resetBy: [function (instance) {
          return instance.instAwareProcessorClasses.size;
        }, function () {
          var globalInstAwareProcessorClasses = GlobalMetadata$1.getReader().getInstAwareProcessorClasses();
          return globalInstAwareProcessorClasses.length;
        }]
      }), __metadata$1("design:type", Array)], InstantiationAwareProcessorManager.prototype, "instAwareProcessorInstances", void 0);
      return InstantiationAwareProcessorManager;
    })();
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
          var metadata = MetadataInstanceManager$1.getMetadata(args[0], ClassMetadata$1);
          metadata.marker().ctor(key, value);
        } else if (args.length === 2) {
          // property decorator
          var _a = __read$1(args, 2),
            prototype = _a[0],
            propertyKey = _a[1];
          var metadata = MetadataInstanceManager$1.getMetadata(prototype.constructor, ClassMetadata$1);
          metadata.marker().member(propertyKey).mark(key, value);
        } else if (args.length === 3 && typeof args[2] === 'number') {
          // parameter decorator
          var _b = __read$1(args, 3),
            prototype = _b[0],
            propertyKey = _b[1],
            index = _b[2];
          var metadata = MetadataInstanceManager$1.getMetadata(prototype.constructor, ClassMetadata$1);
          metadata.marker().parameter(propertyKey, index).mark(key, value);
        } else {
          // method decorator
          var _c = __read$1(args, 2),
            prototype = _c[0],
            propertyKey = _c[1];
          var metadata = MetadataInstanceManager$1.getMetadata(prototype.constructor, ClassMetadata$1);
          metadata.marker().member(propertyKey).mark(key, value);
        }
      };
    }
    function defineClassDecoratorProcessor(key, processor) {
      return Mark(key, Object.assign({
        [IS_CLASS_DECORATOR_PROCESSOR]: true
      }, processor));
    }
    function defineMemberDecoratorProcessor(key, processor) {
      return Mark(key, Object.assign({
        [IS_MEMBER_DECORATOR_PROCESSOR]: true
      }, processor));
    }
    const SOLIDIUM_SOLID_OWNER_PROPERTY_KEY = Symbol("solidium-solid-owner-property");
    function runWithSolidiumOwner(instance, callback) {
      const owner = Reflect.get(instance, SOLIDIUM_SOLID_OWNER_PROPERTY_KEY);
      return solidJs.runWithOwner(owner, callback);
    }
    solidJs.createContext();
    const extraDatas = new WeakMap();
    function extraDataOf(target, key) {
      if (!target || typeof target !== "object") {
        return undefined;
      }
      if (!extraDatas.has(target)) {
        extraDatas.set(target, new Map());
      }
      const metadata = extraDatas.get(target);
      if (!metadata) {
        throw new Error("Will never happen");
      }
      if (!metadata.has(key)) {
        metadata.set(key, new Map());
      }
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return metadata.get(key);
    }
    const SETTER_INTERCEPTOR_MAP_KEY = Symbol("solidium-setter-interceptors-map");
    const signalMap = new SignalMap();
    const IS_SIGNAL_MEMBER_METADATA_KEY = "is_signal_member_metadata_key";
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
      const owner = solidJs.getOwner();
      Object.defineProperty(target, member, {
        get: function () {
          const [get] = solidJs.runWithOwner(owner, () => {
            return signalMap.get(this, member, defaultValue);
          });
          return get();
        },
        set: function (newValue) {
          const [get, set] = solidJs.runWithOwner(owner, () => {
            return signalMap.get(this, member);
          });
          const interceptorMap = target[SETTER_INTERCEPTOR_MAP_KEY];
          let interceptor;
          const setterInterceptor = interceptorMap === null || interceptorMap === void 0 ? void 0 : interceptorMap.get(member);
          {
            interceptor = setterInterceptor || (void 0 );
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
    const SOLIDIUM_MARK_CLASS_AUTO = Symbol("solidium-mark-class-auto");
    defineClassDecoratorProcessor(SOLIDIUM_MARK_CLASS_AUTO, {
      afterInstantiation(instance) {
        if (!instance || typeof instance !== "object") {
          return instance;
        }
        const prototype = Object.getPrototypeOf(instance);
        return new Proxy(instance, {
          get(target, p, receiver) {
            if (typeof prototype[p] === "function") {
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
    const BATCH_METHOD_MARK_KEY = Symbol("solidium-batch-method-mark-key");
    defineMemberDecoratorProcessor(BATCH_METHOD_MARK_KEY, {
      afterInstantiation(instance, member) {
        const origin = instance[member];
        if (typeof origin !== "function") {
          return;
        }
        const batchFn = solidJs.batch((...args) => {
          return origin.apply(instance, args);
        });
        Object.defineProperty(instance, member, {
          enumerable: false,
          writable: true,
          value: batchFn
        });
      }
    });
    const NOT_CHANGED_SYMBOL = Symbol("solidium-not-change-symbol");
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
      const [get, emitChange] = solidJs.createSignal(NOT_CHANGED_SYMBOL);
      const getter = solidJs.createMemo(() => {
        const v = get();
        if (v !== NOT_CHANGED_SYMBOL) {
          return fn();
        }
        return NOT_CHANGED_SYMBOL;
      });
      return () => {
        if (solidJs.untrack(get) === NOT_CHANGED_SYMBOL) {
          emitChange(null);
        }
        return getter();
      };
    }
    const COMPUTED_GETTER_MARK_KEY = Symbol("solidium_computed_getter");
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
    defineMemberDecoratorProcessor(COMPUTED_GETTER_MARK_KEY, {
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

    /**
     * Symbol identifier for the default bucket configuration in the IoC container.
     * Used internally to register and retrieve the default bucket configuration.
     *
     * @public
     */
    var DEFAULT_BUCKET_CONFIGURATION = Symbol("solidium-default-bucket-configuration");
    /**
     * Symbol identifier for the default bucket instance in the IoC container.
     * Used internally to register and retrieve the default bucket.
     *
     * @public
     */
    var DEFAULT_BUCKET = Symbol("solidium-default-bucket");

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
    var DEFAULT_STORAGE_OPTIONS = Symbol("solidium-default-storage-options");
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
    var DefaultStorage = function (options) {
      if (options === void 0) {
        options = {};
      }
      return defineClassDecoratorProcessor(DEFAULT_STORAGE_OPTIONS, {
        beforeInstantiation: function (_constructor, metadata) {
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
      var ctorMarkInfo = metadata.getCtorMarkInfo();
      return ctorMarkInfo === null || ctorMarkInfo === void 0 ? void 0 : ctorMarkInfo[DEFAULT_STORAGE_OPTIONS];
    }

    var STORAGE_CHANGE_EVENTS = Symbol("storage-change-events");
    /**
     * Internal function to notify all registered storage change listeners.
     * @internal
     */
    function notifyStorageChange(event) {
      var _a;
      var prototype = Object.getPrototypeOf(event.instance);
      var events = (_a = Reflect.getMetadata(STORAGE_CHANGE_EVENTS, prototype)) !== null && _a !== void 0 ? _a : [];
      events.forEach(function (handle) {
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
      return function (target, propertyKey) {
        var _a;
        var events = (_a = Reflect.getMetadata(STORAGE_CHANGE_EVENTS, target)) !== null && _a !== void 0 ? _a : [];
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
          var method = Reflect.get(this, propertyKey);
          method.call(this, event);
        });
      };
    }

    var STORAGE_LOAD_EVENTS = Symbol();
    function notifyStorageLoad(event) {
      var _a;
      var prototype = Object.getPrototypeOf(event.instance);
      var events = (_a = Reflect.getMetadata(STORAGE_LOAD_EVENTS, prototype)) !== null && _a !== void 0 ? _a : [];
      events.forEach(function (handle) {
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
      return function (target, propertyKey) {
        var _a;
        var events = (_a = Reflect.getMetadata(STORAGE_LOAD_EVENTS, target)) !== null && _a !== void 0 ? _a : [];
        Reflect.defineMetadata(STORAGE_LOAD_EVENTS, events, target);
        var loadedMembers = new Set();
        events.push(function listener(event) {
          loadedMembers.add(event.member);
          if ((options === null || options === void 0 ? void 0 : options.members) && !options.members.includes(event.member)) {
            return;
          }
          var method = Reflect.get(this, propertyKey);
          method.call(this, __assign$2(__assign$2({}, event), {
            loadedMembers: new Set(loadedMembers)
          }));
          if (options === null || options === void 0 ? void 0 : options.members) {
            var isAllHandled = loadedMembers.isSupersetOf(new Set(options.members));
            if (isAllHandled) {
              var index = events.indexOf(listener);
              if (index === -1) {
                return;
              }
              var newEvents = events.slice(0).splice(index, 1);
              Reflect.defineMetadata(STORAGE_LOAD_EVENTS, newEvents, target);
            }
          }
        });
      };
    }

    var BUILT_IN_MIGRATION_STRATEGIES = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      overwrite: function (newValue, _cachedValue) {
        return newValue;
      },
      keep: function (_newValue, cachedValue) {
        return cachedValue;
      }
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
    var Storage = function (options) {
      if (options === void 0) {
        options = {};
      }
      return defineMemberDecoratorProcessor("storage", {
        afterInstantiation: function (instance, member, metadata, container) {
          var _a, _b, _c;
          // Get default options from class decorator if they exist
          var defaultOptions = getDefaultStorageOptions(metadata.reader());
          // Merge options, with member-specific options taking precedence
          var mergedOptions = __assign$2(__assign$2({}, defaultOptions), typeof options === "string" ? {
            key: options
          } : options);
          var version = (_a = mergedOptions.version) !== null && _a !== void 0 ? _a : "";
          var descriptor = Object.getOwnPropertyDescriptor(instance, member);
          var writable = (_b = descriptor === null || descriptor === void 0 ? void 0 : descriptor.writable) !== null && _b !== void 0 ? _b : true;
          var isSignal = isSignalMember(instance, member);
          var key = (_c = mergedOptions.key) !== null && _c !== void 0 ? _c : member.toString();
          var bucketOrName = mergedOptions.bucket || DEFAULT_BUCKET;
          var bucket = typeof bucketOrName !== "object" ? container.getInstance(bucketOrName) : bucketOrName;
          var initialValue = instance[member];
          var _d = __read$2(function () {
              var _a;
              if (isSignal) {
                var _b = __read$2(getSignal(instance, member, initialValue), 2),
                  get_1 = _b[0],
                  set_1 = _b[1];
                return [get_1, set_1];
              } else {
                var storageSymbol_1 = Symbol("__storage_".concat(String(member)));
                instance[storageSymbol_1] = initialValue;
                var baseGetter = function () {
                  return instance[storageSymbol_1];
                };
                var baseSetter = function (newValue) {
                  instance[storageSymbol_1] = newValue;
                };
                Object.defineProperty(instance, member, {
                  get: baseGetter,
                  set: baseSetter,
                  configurable: true,
                  enumerable: (_a = descriptor === null || descriptor === void 0 ? void 0 : descriptor.enumerable) !== null && _a !== void 0 ? _a : true
                });
                return [baseGetter, baseSetter];
              }
            }(), 2),
            get = _d[0],
            set = _d[1];
          var observe = function () {
            return bucket.observe(key, function (event) {
              if (bucket.debug) {
                console.debug("[Storage] ".concat(ActionType[event.action], " ").concat(JSON.stringify({
                  action: ActionType[event.action],
                  changeBy: ChangeBy[event.changeBy],
                  key: event.key,
                  bucketName: event.target.name,
                  newValue: event.newValue,
                  originValue: event.originValue
                })));
              }
              set(event.newValue);
              notifyStorageChange(__assign$2({
                instance: instance,
                member: key
              }, event));
            });
          };
          if (bucket.debug) {
            console.debug("[Storage] ".concat(key, " is loaded from ").concat(bucket.name));
          }
          var owner = solidJs.getOwner();
          bucket.getItem(key).then(function (storageValue) {
            if (bucket.debug) {
              console.debug("[Storage] ".concat(key, " is loaded, value: ").concat(storageValue === null || storageValue === void 0 ? void 0 : storageValue.$d));
            }
            if (!isValidStorageValue(storageValue)) {
              return;
            }
            var dataVersion = storageValue.$v;
            if (dataVersion !== version) {
              var mergeStrategy = mergedOptions.migrationStrategy;
              if (typeof mergeStrategy === "string" && BUILT_IN_MIGRATION_STRATEGIES[mergeStrategy]) {
                set(BUILT_IN_MIGRATION_STRATEGIES[mergeStrategy](storageValue.$d, storageValue.$d));
              } else if (typeof mergeStrategy === "function") {
                set(mergeStrategy(storageValue.$d, storageValue.$d));
              }
            } else {
              set(storageValue.$d);
            }
            notifyStorageLoad({
              instance: instance,
              member: member,
              value: storageValue.$d,
              timestamp: Date.now()
            });
          }).then(function () {
            solidJs.runWithOwner(owner, function () {
              var unobserve = observe();
              if (!writable) {
                solidJs.onCleanup(function () {
                  unobserve();
                });
                return;
              }
              var storageOnPropertyChange = createSaveTrigger(function () {
                unobserve();
              }, function () {
                unobserve = observe();
              }, bucket, key, version, instance, member);
              observePropertyChange(isSignal, instance, member, storageOnPropertyChange, get, set);
              solidJs.onCleanup(function () {
                unobserve();
              });
            });
          });
        }
      });
    };
    function createSaveTrigger(unobserve, reobserve, bucket, key, version, instance, member) {
      var _this = this;
      return scheduled.leadingAndTrailing(scheduled.debounce, function (newValue) {
        return __awaiter(_this, void 0, void 0, function () {
          var _a;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                return [4 /*yield*/, unobserve()];
              case 1:
                _b.sent();
                if (bucket.debug) {
                  console.debug("[Storage] ".concat((_a = instance.constructor) === null || _a === void 0 ? void 0 : _a.name, ".").concat(member.toString(), "\n                    changed to ").concat(newValue).replace(/\s+/g, " "));
                }
                bucket.setItem(key, {
                  $d: newValue,
                  $v: version
                }).finally(function () {
                  reobserve();
                });
                return [2 /*return*/];
            }
          });
        });
      }, 300);
    }
    function observePropertyChange(isSignal, instance, member, trigger, getValue, setValue) {
      var _a, _b;
      if (isSignal) {
        solidJs.createEffect(solidJs.on(function () {
          return getValue();
        }, trigger));
      } else {
        var currentDescriptor = Object.getOwnPropertyDescriptor(instance, member);
        if (currentDescriptor) {
          Object.defineProperty(instance, member, {
            get: getValue,
            set: function (newValue) {
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
      return typeof value === "object" && value !== null && "$d" in value && "$v" in value;
    }

    /**
     * Enumeration of built-in storage drivers available in the persistence library.
     *
     * @public
     */
    exports.DefaultDrivers = void 0;
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
    })(exports.DefaultDrivers || (exports.DefaultDrivers = {}));

    function createBlob(parts, options) {
      return new Blob(parts, options);
    }
    function createPlainTextBlob() {
      var parts = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
      }
      return createBlob(parts, {
        type: "text/plain"
      });
    }

    var Defer = /** @class */function () {
      function Defer() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
          _this.resolve = resolve;
          _this.reject = reject;
        });
      }
      return Defer;
    }();

    var STORE_NAME = "keyval";
    /**
     * Storage driver implementation that uses the browser's IndexedDB API.
     * Provides larger storage capacity and more advanced features compared to Web Storage.
     * Data persists across browser sessions and supports versioning for schema migrations.
     *
     * @public
     */
    var IndexedDBStorageDriver = /** @class */function () {
      /**
       * Creates a new IndexedDBStorageDriver instance.
       *
       * @param options - Configuration options including bucket name and version
       */
      function IndexedDBStorageDriver(options) {
        /**
         * The name identifier for this driver.
         */
        this.name = "IndexedDBStorageDriver";
        this.observers = new Map();
        this.idbDefer = new Defer();
        this.bucketName = options.bucketName;
        this.version = options.version;
      }
      Object.defineProperty(IndexedDBStorageDriver.prototype, "idbPromise", {
        get: function () {
          return this.idbDefer.promise;
        },
        enumerable: false,
        configurable: true
      });
      /**
       * Prepares the driver by opening the IndexedDB database and creating the object store.
       *
       * @returns A promise that resolves when the database is ready
       */
      IndexedDBStorageDriver.prototype.prepare = function () {
        return __awaiter(this, void 0, void 0, function () {
          var idb$1;
          var _this = this;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, idb.openDB(this.bucketName, this.version, {
                  blocked: function (currentVersion, blockedVersion, event) {
                    console.log("blocked", currentVersion, blockedVersion, event);
                  },
                  blocking: function (currentVersion, blockedVersion, event) {
                    console.log("blocking", currentVersion, blockedVersion, event);
                  },
                  upgrade: function (db) {
                    db.createObjectStore(STORE_NAME);
                  },
                  terminated: function () {
                    console.log("bucket terminated: ", _this.bucketName);
                  }
                })];
              case 1:
                idb$1 = _a.sent();
                this.idbDefer.resolve(idb$1);
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Checks if IndexedDB is supported in the current environment.
       *
       * @returns A promise that resolves to true if IndexedDB is supported, false otherwise
       */
      IndexedDBStorageDriver.prototype.supports = function () {
        return __awaiter(this, void 0, void 0, function () {
          var checkDBName, db;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                _b.trys.push([0, 4,, 5]);
                if (typeof indexedDB === "undefined") {
                  return [2 /*return*/, false];
                }
                checkDBName = "_vgerbot_check_idb";
                return [4 /*yield*/, idb.openDB(checkDBName)];
              case 1:
                db = _b.sent();
                return [4 /*yield*/, db.close()];
              case 2:
                _b.sent();
                return [4 /*yield*/, idb.deleteDB(checkDBName)];
              case 3:
                _b.sent();
                return [2 /*return*/, true];
              case 4:
                _b.sent();
                return [2 /*return*/, false];
              case 5:
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Retrieves an item from IndexedDB by key.
       *
       * @param key - The key of the item to retrieve
       * @returns A promise that resolves to the stored Blob, or undefined if not found
       */
      IndexedDBStorageDriver.prototype.getItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
          var db, value;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.idbPromise];
              case 1:
                db = _a.sent();
                return [4 /*yield*/, db.get(STORE_NAME, IDBKeyRange.only(key))];
              case 2:
                value = _a.sent();
                if (!value) {
                  return [2 /*return*/];
                }
                return [2 /*return*/, createBlob([value], {})];
            }
          });
        });
      };
      /**
       * Removes an item from IndexedDB by key.
       *
       * @param key - The key of the item to remove
       * @returns A promise that resolves when the item is removed
       */
      IndexedDBStorageDriver.prototype.removeItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
          var db, needDispatch, oldValue, _a;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                return [4 /*yield*/, this.idbPromise];
              case 1:
                db = _b.sent();
                needDispatch = this.needDispatch(key);
                if (!needDispatch) return [3 /*break*/, 3];
                return [4 /*yield*/, this.getItem(key)];
              case 2:
                _a = _b.sent();
                return [3 /*break*/, 4];
              case 3:
                _a = undefined;
                _b.label = 4;
              case 4:
                oldValue = _a;
                return [4 /*yield*/, db.delete(STORE_NAME, IDBKeyRange.only(key))];
              case 5:
                _b.sent();
                if (needDispatch) {
                  this.dispatchChangeEvent(key, ActionType.REMOVE, undefined, oldValue);
                }
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Stores an item in IndexedDB.
       *
       * @param key - The key to store the item under
       * @param value - The Blob value to store
       * @returns A promise that resolves when the item is stored
       */
      IndexedDBStorageDriver.prototype.setItem = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
          var db, buffer, needDispatch, oldValue, _a;
          return __generator(this, function (_b) {
            switch (_b.label) {
              case 0:
                return [4 /*yield*/, this.idbPromise];
              case 1:
                db = _b.sent();
                return [4 /*yield*/, value.arrayBuffer()];
              case 2:
                buffer = _b.sent();
                needDispatch = this.needDispatch(key);
                if (!needDispatch) return [3 /*break*/, 4];
                return [4 /*yield*/, this.getItem(key)];
              case 3:
                _a = _b.sent();
                return [3 /*break*/, 5];
              case 4:
                _a = undefined;
                _b.label = 5;
              case 5:
                oldValue = _a;
                return [4 /*yield*/, db.put(STORE_NAME, buffer, key)];
              case 6:
                _b.sent();
                if (needDispatch) {
                  this.dispatchChangeEvent(key, ActionType.UPDATE, value, oldValue);
                }
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Clears all items from the IndexedDB object store.
       *
       * @returns A promise that resolves when all items are cleared
       */
      IndexedDBStorageDriver.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
          var db;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.idbPromise];
              case 1:
                db = _a.sent();
                return [4 /*yield*/, db.clear(STORE_NAME)];
              case 2:
                _a.sent();
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Observes changes to a specific storage key.
       * Note: IndexedDB doesn't support cross-tab observation natively.
       *
       * @param key - The key to observe
       * @param onChange - Callback function invoked when the key changes
       * @returns A function that can be called to stop observing
       */
      IndexedDBStorageDriver.prototype.observe = function (key, onChange) {
        var changeListener = onChange.bind(this);
        var listeners = this.observers.get(key) || [];
        listeners.push(changeListener);
        this.observers.set(key, listeners);
        return function () {
          var index = listeners.indexOf(changeListener);
          if (index === -1) {
            return;
          }
          listeners.splice(index, 1);
        };
      };
      IndexedDBStorageDriver.prototype.dispatchChangeEvent = function (key, action, newValue, originValue) {
        var _this = this;
        var listeners = this.observers.get(key);
        if (!listeners || listeners.length === 0) {
          return;
        }
        listeners.forEach(function (listener) {
          listener({
            target: _this,
            key: key,
            action: action,
            newValue: newValue,
            originValue: originValue,
            changeBy: ChangeBy.SELF
          });
        });
      };
      IndexedDBStorageDriver.prototype.needDispatch = function (key) {
        var _a;
        return !!((_a = this.observers.get(key)) === null || _a === void 0 ? void 0 : _a.length);
      };
      return IndexedDBStorageDriver;
    }();

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
    var BrowserStorageDriver = /** @class */function () {
      /**
       * Creates a new BrowserStorageDriver instance.
       *
       * @param options - Configuration options for the driver
       * @param storage - The Web Storage API object (localStorage or sessionStorage)
       */
      function BrowserStorageDriver(options, storage) {
        this.options = options;
        this.storage = storage;
        this.observers = new Map();
      }
      BrowserStorageDriver.prototype.getKeyPrefix = function () {
        return this.options.bucketName;
      };
      BrowserStorageDriver.prototype.normalizeKey = function (key) {
        return "".concat(this.getKeyPrefix(), ".").concat(key.replace(/\./g, "_"));
      };
      /**
       * Prepares the driver for use by setting up storage event listeners.
       * This enables cross-tab synchronization.
       *
       * @returns A promise that resolves when preparation is complete
       */
      BrowserStorageDriver.prototype.prepare = function () {
        var _this = this;
        var storageEventListener = function (event) {
          var key = event.key,
            newValue = event.newValue,
            oldValue = event.oldValue;
          if (key === null) {
            return;
          }
          var newValueBlob = newValue ? createPlainTextBlob(newValue) : undefined;
          var oldValueBlob = oldValue ? createPlainTextBlob(oldValue) : undefined;
          _this.dispatchChangeEvent(ChangeBy.OTHER, ActionType.UPDATE, key, newValueBlob, oldValueBlob);
        };
        window.addEventListener("storage", storageEventListener);
        return Promise.resolve();
      };
      /**
       * Checks if the storage API is supported in the current environment.
       *
       * @returns A promise that resolves to true if supported, false otherwise
       */
      BrowserStorageDriver.prototype.supports = function () {
        return Promise.resolve(typeof this.storage !== "undefined");
      };
      /**
       * Iterates over all key-value pairs in this bucket.
       *
       * @yields Objects containing key and value (as Blob)
       */
      BrowserStorageDriver.prototype.iterate = function () {
        return __asyncGenerator(this, arguments, function iterate_1() {
          var len, prefix, regex, i, key, value;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                len = this.storage.length;
                prefix = this.getKeyPrefix();
                regex = new RegExp("^".concat(prefix, "."));
                i = 0;
                _a.label = 1;
              case 1:
                if (!(i < len)) return [3 /*break*/, 5];
                key = this.storage.key(i);
                if (!(key === null || key === void 0 ? void 0 : key.match(regex))) {
                  return [3 /*break*/, 4];
                }
                value = this.storage.getItem(key);
                if (!value) {
                  return [3 /*break*/, 4];
                }
                return [4 /*yield*/, __await({
                  key: key,
                  value: createBlob([value], {})
                })];
              case 2:
                return [4 /*yield*/, _a.sent()];
              case 3:
                _a.sent();
                _a.label = 4;
              case 4:
                i++;
                return [3 /*break*/, 1];
              case 5:
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Retrieves an item from storage by key.
       *
       * @param key - The key of the item to retrieve
       * @returns A promise that resolves to the stored Blob, or undefined if not found
       */
      BrowserStorageDriver.prototype.getItem = function (key) {
        var normalizedKey = this.normalizeKey(key);
        return Promise.resolve(this.getItemByNormalizedKey(normalizedKey));
      };
      BrowserStorageDriver.prototype.getItemByNormalizedKey = function (key) {
        var value = this.storage.getItem(key);
        if (!value) {
          return;
        }
        return this.deserialize(value);
      };
      /**
       * Removes an item from storage by key.
       *
       * @param key - The key of the item to remove
       * @returns A promise that resolves when the item is removed
       */
      BrowserStorageDriver.prototype.removeItem = function (key) {
        var normalizedKey = this.normalizeKey(key);
        var oldValue;
        var needDispatch = this.needDispatch(key);
        if (needDispatch) {
          oldValue = this.getItemByNormalizedKey(normalizedKey);
        }
        this.storage.removeItem(normalizedKey);
        if (needDispatch) {
          this.dispatchChangeEvent(ChangeBy.SELF, ActionType.REMOVE, key, undefined, oldValue);
        }
        return Promise.resolve();
      };
      /**
       * Stores an item in storage.
       *
       * @param key - The key to store the item under
       * @param value - The Blob value to store
       * @returns A promise that resolves when the item is stored
       */
      BrowserStorageDriver.prototype.setItem = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
          var normalizeKey, needDispatch, oldValue, serialized;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                normalizeKey = this.normalizeKey(key);
                needDispatch = this.needDispatch(key);
                if (needDispatch) {
                  oldValue = this.getItemByNormalizedKey(normalizeKey);
                }
                return [4 /*yield*/, this.serialize(value)];
              case 1:
                serialized = _a.sent();
                this.storage.setItem(normalizeKey, serialized);
                if (needDispatch) {
                  this.dispatchChangeEvent(ChangeBy.SELF, ActionType.UPDATE, key, value, oldValue);
                }
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Returns the number of items in this bucket.
       *
       * @returns A promise that resolves to the item count
       */
      BrowserStorageDriver.prototype.length = function () {
        return __awaiter(this, void 0, void 0, function () {
          var len, _a, _b, _c, e_1_1;
          var _d, e_1, _e;
          return __generator(this, function (_g) {
            switch (_g.label) {
              case 0:
                len = 0;
                _g.label = 1;
              case 1:
                _g.trys.push([1, 6, 7, 12]);
                _a = true, _b = __asyncValues(this.keys());
                _g.label = 2;
              case 2:
                return [4 /*yield*/, _b.next()];
              case 3:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                _c.value;
                _a = false;
                len++;
                _g.label = 4;
              case 4:
                _a = true;
                return [3 /*break*/, 2];
              case 5:
                return [3 /*break*/, 12];
              case 6:
                e_1_1 = _g.sent();
                e_1 = {
                  error: e_1_1
                };
                return [3 /*break*/, 12];
              case 7:
                _g.trys.push([7,, 10, 11]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                return [4 /*yield*/, _e.call(_b)];
              case 8:
                _g.sent();
                _g.label = 9;
              case 9:
                return [3 /*break*/, 11];
              case 10:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
              case 11:
                return [7 /*endfinally*/];
              case 12:
                return [2 /*return*/, len];
            }
          });
        });
      };
      /**
       * Returns the key at the specified index.
       *
       * @param index - The index of the key to retrieve
       * @returns A promise that resolves to the key, or undefined if index is out of bounds
       */
      BrowserStorageDriver.prototype.keyAt = function (index) {
        return __awaiter(this, void 0, void 0, function () {
          var i, _a, _b, _c, key, e_2_1;
          var _d, e_2, _e, _f;
          return __generator(this, function (_g) {
            switch (_g.label) {
              case 0:
                i = 0;
                _g.label = 1;
              case 1:
                _g.trys.push([1, 6, 7, 12]);
                _a = true, _b = __asyncValues(this.keys());
                _g.label = 2;
              case 2:
                return [4 /*yield*/, _b.next()];
              case 3:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 5];
                _f = _c.value;
                _a = false;
                key = _f;
                if (i === index) {
                  return [2 /*return*/, key];
                }
                i++;
                _g.label = 4;
              case 4:
                _a = true;
                return [3 /*break*/, 2];
              case 5:
                return [3 /*break*/, 12];
              case 6:
                e_2_1 = _g.sent();
                e_2 = {
                  error: e_2_1
                };
                return [3 /*break*/, 12];
              case 7:
                _g.trys.push([7,, 10, 11]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 9];
                return [4 /*yield*/, _e.call(_b)];
              case 8:
                _g.sent();
                _g.label = 9;
              case 9:
                return [3 /*break*/, 11];
              case 10:
                if (e_2) throw e_2.error;
                return [7 /*endfinally*/];
              case 11:
                return [7 /*endfinally*/];
              case 12:
                return [2 /*return*/];
            }
          });
        });
      };
      BrowserStorageDriver.prototype.deserialize = function (str) {
        var _a = JSON.parse(str),
          type = _a.type,
          text = _a.text,
          hexData = _a.hex;
        if (text) {
          return createBlob([text], {
            type: type
          });
        }
        var u8a = new Uint8Array(hexData.length / 2);
        var view = new DataView(u8a.buffer);
        for (var i = 0; i < hexData.length; i += 2) {
          var hex = hexData.substring(i, i + 2);
          view.setUint8(i / 2, parseInt(hex, 16));
        }
        return createBlob([u8a], {
          type: type
        });
      };
      BrowserStorageDriver.prototype.serialize = function (blob) {
        return __awaiter(this, void 0, void 0, function () {
          var text, buffer, u8a, hexArray, i, hex;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                if (!(blob.type.indexOf("text/") > -1)) return [3 /*break*/, 2];
                return [4 /*yield*/, blob.text()];
              case 1:
                text = _a.sent();
                return [2 /*return*/, JSON.stringify({
                  type: blob.type,
                  text: text
                })];
              case 2:
                return [4 /*yield*/, blob.arrayBuffer()];
              case 3:
                buffer = _a.sent();
                u8a = new Uint8Array(buffer);
                hexArray = new Array(u8a.length);
                for (i = 0; i < u8a.length; i++) {
                  hexArray[i] = u8a[i].toString(16).padStart(2, "0");
                }
                hex = hexArray.join("");
                return [2 /*return*/, JSON.stringify({
                  type: blob.type,
                  hex: hex
                })];
            }
          });
        });
      };
      BrowserStorageDriver.prototype.needDispatch = function (key) {
        var _a;
        return !!((_a = this.observers.get(key)) === null || _a === void 0 ? void 0 : _a.length);
      };
      BrowserStorageDriver.prototype.dispatchChangeEvent = function (changeBy, actionType, key, newValue, oldValue) {
        var _this = this;
        var listeners = this.observers.get(key);
        listeners === null || listeners === void 0 ? void 0 : listeners.forEach(function (listener) {
          listener({
            target: _this,
            key: key,
            changeBy: changeBy,
            action: actionType,
            newValue: newValue,
            originValue: oldValue
          });
        });
      };
      /**
       * Iterates over all keys in this bucket.
       *
       * @yields Storage keys belonging to this bucket
       */
      BrowserStorageDriver.prototype.keys = function () {
        return __asyncGenerator(this, arguments, function keys_1() {
          var len, prefix, i, key;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                len = this.storage.length;
                prefix = this.getKeyPrefix();
                i = 0;
                _a.label = 1;
              case 1:
                if (!(i < len)) return [3 /*break*/, 5];
                key = this.storage.key(i);
                if (!((key === null || key === void 0 ? void 0 : key.indexOf(prefix)) === 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, __await(key)];
              case 2:
                return [4 /*yield*/, _a.sent()];
              case 3:
                _a.sent();
                _a.label = 4;
              case 4:
                i++;
                return [3 /*break*/, 1];
              case 5:
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Clears all items from this bucket.
       *
       * @returns A promise that resolves when all items are cleared
       */
      BrowserStorageDriver.prototype.clear = function () {
        return __awaiter(this, void 0, void 0, function () {
          var _a, _b, _c, key, e_3_1;
          var _d, e_3, _e, _f;
          return __generator(this, function (_g) {
            switch (_g.label) {
              case 0:
                _g.trys.push([0, 5, 6, 11]);
                _a = true, _b = __asyncValues(this.keys());
                _g.label = 1;
              case 1:
                return [4 /*yield*/, _b.next()];
              case 2:
                if (!(_c = _g.sent(), _d = _c.done, !_d)) return [3 /*break*/, 4];
                _f = _c.value;
                _a = false;
                key = _f;
                this.storage.removeItem(key);
                _g.label = 3;
              case 3:
                _a = true;
                return [3 /*break*/, 1];
              case 4:
                return [3 /*break*/, 11];
              case 5:
                e_3_1 = _g.sent();
                e_3 = {
                  error: e_3_1
                };
                return [3 /*break*/, 11];
              case 6:
                _g.trys.push([6,, 9, 10]);
                if (!(!_a && !_d && (_e = _b.return))) return [3 /*break*/, 8];
                return [4 /*yield*/, _e.call(_b)];
              case 7:
                _g.sent();
                _g.label = 8;
              case 8:
                return [3 /*break*/, 10];
              case 9:
                if (e_3) throw e_3.error;
                return [7 /*endfinally*/];
              case 10:
                return [7 /*endfinally*/];
              case 11:
                return [2 /*return*/];
            }
          });
        });
      };
      /**
       * Observes changes to a specific storage key.
       *
       * @param key - The key to observe
       * @param onChange - Callback function invoked when the key changes
       * @returns A function that can be called to stop observing
       */
      BrowserStorageDriver.prototype.observe = function (key, onChange) {
        var changeListener = onChange.bind(this);
        var listeners = this.observers.get(key) || [];
        listeners.push(changeListener);
        this.observers.set(key, listeners);
        return function () {
          var index = listeners.indexOf(changeListener);
          if (index === -1) {
            return;
          }
          listeners.splice(index, 1);
        };
      };
      return BrowserStorageDriver;
    }();

    /**
     * Storage driver implementation that uses the browser's localStorage API.
     * Data persists across browser sessions and tabs.
     *
     * @public
     */
    var LocalStorageDriver = /** @class */function (_super) {
      __extends$2(LocalStorageDriver, _super);
      /**
       * Creates a new LocalStorageDriver instance.
       *
       * @param options - Configuration options for the driver
       */
      function LocalStorageDriver(options) {
        var _this = _super.call(this, options, window.localStorage) || this;
        /**
         * The name identifier for this driver.
         */
        _this.name = "LocalStorageDriver";
        return _this;
      }
      /**
       * Creates a new LocalStorageDriver instance with the specified bucket name.
       *
       * @param bucketName - The name of the storage bucket
       * @returns A new LocalStorageDriver instance
       */
      LocalStorageDriver.createInstance = function (bucketName) {
        return new LocalStorageDriver({
          bucketName: bucketName
        });
      };
      return LocalStorageDriver;
    }(BrowserStorageDriver);

    /**
     * Storage driver implementation that uses the browser's sessionStorage API.
     * Data persists only for the duration of the browser session and is not shared across tabs.
     *
     * @public
     */
    var SessionStorageDriver = /** @class */function (_super) {
      __extends$2(SessionStorageDriver, _super);
      /**
       * Creates a new SessionStorageDriver instance.
       *
       * @param options - Configuration options for the driver
       */
      function SessionStorageDriver(options) {
        var _this = _super.call(this, options, window.sessionStorage) || this;
        /**
         * The name identifier for this driver.
         */
        _this.name = "SessionStorageDriver";
        return _this;
      }
      /**
       * Creates a new SessionStorageDriver instance with the specified bucket name.
       *
       * @param bucketName - The name of the storage bucket
       * @returns A new SessionStorageDriver instance
       */
      SessionStorageDriver.createInstance = function (bucketName) {
        return new SessionStorageDriver({
          bucketName: bucketName
        });
      };
      return SessionStorageDriver;
    }(BrowserStorageDriver);

    var Types;
    (function (Types) {
      Types[Types["Reference"] = 0] = "Reference";
    })(Types || (Types = {}));
    class Reference {
      constructor(path) {
        this.path = path;
      }
    }
    class ReferenceCodec {
      constructor() {
        this.type = Types.Reference;
      }
      encode(input) {
        if (input instanceof Reference) {
          return msgpack.encode(input.path);
        }
        return null;
      }
      decode(data) {
        const result = msgpack.decode(data);
        return new Reference(result);
      }
    }
    class IterableMapper {
      transform(object, context, path) {
        context.recording(object, path);
        const referencePath = context.getReference(object, path);
        if (referencePath) {
          return new Reference(referencePath.path);
        }
        const result = [];
        context.recording(object, path);
        let i = 0;
        for (const value of object) {
          const childPath = path.child(i);
          context.recording(value, childPath);
          const mapper = context.getObjectMapper(value);
          const newValue = mapper.transform(value, context, childPath);
          result.push(newValue);
          i++;
        }
        return this.createTransformedResult(result);
      }
      revive(object, context, path) {
        const receiver = this.createNewInstance();
        context.recording(receiver, path);
        this.forEachTransformedResult(object, path, (item, path) => {
          const mapper = context.getObjectMapper(item);
          const reviveValue = mapper.revive(item, context, path);
          context.recording(reviveValue, path);
          this.append(receiver, reviveValue);
        });
        return receiver;
      }
    }
    class ArrayMapper extends IterableMapper {
      createTransformedResult(resultArray) {
        return resultArray;
      }
      forEachTransformedResult(target, path, callback) {
        target.forEach((item, index) => {
          callback(item, path.child(index));
        });
      }
      canRevive(object) {
        return Array.isArray(object);
      }
      canTransform(object) {
        return Array.isArray(object);
      }
      createNewInstance() {
        return [];
      }
      append(target, value) {
        target.push(value);
      }
    }
    function isObject(o) {
      return Object.prototype.toString.call(o) === "[object Object]";
    }
    function isPlainObject(o) {
      if (isObject(o) === false) return false;
      // If has modified constructor
      const ctor = o.constructor;
      if (ctor === undefined) return true;
      // If has modified prototype
      const prot = ctor.prototype;
      if (isObject(prot) === false) return false;
      if (Object.hasOwn(prot, "isPrototypeOf") === false) {
        return false;
      }
      // Most likely a plain Object
      return true;
    }
    class MapMapper extends IterableMapper {
      canTransform(object) {
        return object instanceof Map;
      }
      createNewInstance() {
        return new Map();
      }
      append(target, value) {
        target.set(value[0], value[1]);
      }
      createTransformedResult(resultArray) {
        return {
          $: 2,
          _: resultArray
        };
      }
      forEachTransformedResult(target, path, callback) {
        target._.forEach((item, i) => {
          const childPath = path.child(i);
          callback(item, childPath);
        });
      }
      canRevive(object) {
        return isPlainObject(object) && "$" in object && "_" in object && object.$ === 2 && Array.isArray(object._);
      }
    }
    class PlainObjectMapper {
      canTransform(object) {
        return isPlainObject(object);
      }
      transform(object, context, path) {
        context.recording(object, path);
        const referencePath = context.getReference(object, path);
        if (referencePath) {
          return new Reference(referencePath.path);
        }
        const result = {};
        this.map(object, context, path, (key, value, path, mapper) => {
          result[key] = mapper.transform(value, context, path);
        });
        return result;
      }
      canRevive(object) {
        return isPlainObject(object);
      }
      revive(object, context, path) {
        this.map(object, context, path, (key, value, path, mapper) => {
          object[key] = mapper.revive(value, context, path);
        });
        return object;
      }
      map(object, context, path, handle) {
        context.recording(object, path);
        for (const key in object) {
          const value = object[key];
          const childPath = path.child(key);
          context.recording(value, childPath);
          const mapper = context.getObjectMapper(value);
          handle(key, value, childPath, mapper);
        }
      }
    }
    class SetMapper extends IterableMapper {
      createTransformedResult(resultArray) {
        return {
          $: 1,
          _: resultArray
        };
      }
      forEachTransformedResult(target, path, callback) {
        target._.forEach((item, i) => {
          callback(item, path.child(i));
        });
      }
      canRevive(object) {
        return isPlainObject(object) && "$" in object && "_" in object && object.$ === 1 && Array.isArray(object._);
      }
      append(target, value) {
        target.add(value);
      }
      canTransform(object) {
        return object instanceof Set;
      }
      createNewInstance() {
        return new Set();
      }
    }
    class ObjectPath {
      constructor(path, parent) {
        this.path = path;
        this.children = {};
        this.str = path.join(".");
        this.parent = parent || this;
      }
      child(key) {
        if (key in this.children) {
          return this.children[key];
        } else {
          const child = new ObjectPath(this.path.concat(`${key}`), this);
          this.children[key] = child;
          return child;
        }
      }
      equals(other) {
        if (this === other) {
          return true;
        }
        if (this.path.length !== other.path.length) {
          return false;
        }
        return !this.path.some((it, idx) => other.path[idx] !== it);
      }
      toString() {
        return this.str;
      }
      root() {
        return this.parent === this ? this : this.parent.root();
      }
      descendant(path) {
        return path.reduce((parent, key) => parent.child(key), this);
      }
    }
    class CodecContext {
      constructor() {
        this.pathObjectMap = new Map();
        this.rootPath = new ObjectPath([]);
        this.objectMappers = [new SetMapper(), new MapMapper(), new ArrayMapper(), new PlainObjectMapper()];
        this.defaultObjectMapper = {
          canTransform() {
            return true;
          },
          transform(object, context, path) {
            context.recording(object, path);
            const referencePath = context.getReference(object, path);
            if (referencePath) {
              return new Reference(path.path);
            }
            return object;
          },
          canRevive() {
            return true;
          },
          revive(object) {
            return object;
          }
        };
      }
      recording(object, path) {
        this.pathObjectMap.set(path, object);
      }
      getObject(path) {
        return this.pathObjectMap.get(path);
      }
      getRootPath() {
        return this.rootPath;
      }
      registerObjectMapper(objectMapper) {
        this.objectMappers.unshift(objectMapper);
      }
    }
    class ReferenceMapper {
      canTransform() {
        return false;
      }
      transform() {
        throw new Error("Method not implemented.");
      }
      canRevive(object) {
        return object instanceof Reference;
      }
      revive(object, context) {
        const root = context.getRootPath();
        const referenceToPath = root.descendant(object.path);
        return context.getObject(referenceToPath);
      }
    }
    class DecodeContext extends CodecContext {
      constructor() {
        super();
        this.registerObjectMapper(new ReferenceMapper());
      }
      revive(decoded) {
        const mapper = this.getObjectMapper(decoded);
        return mapper.revive(decoded, this, this.getRootPath());
      }
      getObjectMapper(object) {
        return this.objectMappers.find(it => it.canRevive(object)) || this.defaultObjectMapper;
      }
    }
    function decode(buffer) {
      const extensionCodec = new msgpack.ExtensionCodec();
      extensionCodec.register(new ReferenceCodec());
      const context = new DecodeContext();
      const decoded = msgpack.decode(buffer, {
        context,
        extensionCodec
      });
      return context.revive(decoded);
    }
    class EncodeContext extends CodecContext {
      constructor() {
        super(...arguments);
        this.objectPathMap = new Map();
      }
      recording(object, path) {
        if (object === null || object === undefined) {
          return;
        }
        switch (typeof object) {
          case "boolean":
          case "number":
          case "string":
            return;
        }
        super.recording(object, path);
        const paths = this.objectPathMap.get(object) || [];
        paths.push(path);
        this.objectPathMap.set(object, paths);
      }
      isHandled(object) {
        return this.objectPathMap.has(object);
      }
      getReference(object, path) {
        const paths = this.objectPathMap.get(object);
        if (!paths) {
          return;
        }
        return paths[0] !== path ? paths[0] : undefined;
      }
      transformObject(object) {
        const mapper = this.getObjectMapper(object);
        const path = this.getRootPath();
        return mapper.transform(object, this, path);
      }
      getObjectMapper(object) {
        return this.objectMappers.find(it => it.canTransform(object)) || this.defaultObjectMapper;
      }
    }
    function encode(input) {
      const extensionCodec = new msgpack.ExtensionCodec();
      extensionCodec.register(new ReferenceCodec());
      const context = new EncodeContext();
      const transformed = context.transformObject(input);
      return msgpack.encode(transformed, {
        context,
        extensionCodec
      });
    }

    /**
     * Default serializer implementation using MessagePack format.
     * Provides efficient binary serialization for JavaScript values.
     *
     * @public
     */
    var DefaultSerializer = /** @class */function () {
      function DefaultSerializer() {}
      /**
       * Serializes a value into a Blob using MessagePack encoding.
       * @param value - The value to serialize
       * @returns A promise that resolves to a Blob containing the MessagePack encoded data
       */
      DefaultSerializer.prototype.serialize = function (value) {
        var u8a = encode(value);
        return Promise.resolve(new Blob([u8a]));
      };
      /**
       * Deserializes a Blob back into its original value using MessagePack decoding.
       * @param data - The Blob containing MessagePack encoded data
       * @returns A promise that resolves to the deserialized value
       * @typeParam T - The expected type of the deserialized value
       */
      DefaultSerializer.prototype.deserialize = function (data) {
        return __awaiter(this, void 0, void 0, function () {
          var buffer;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, data.arrayBuffer()];
              case 1:
                buffer = _a.sent();
                return [2 /*return*/, decode(buffer)];
            }
          });
        });
      };
      return DefaultSerializer;
    }();

    var PREPARE = Symbol("prepare");
    function Prepared() {
      return function (target, propertyKey, descriptor) {
        var origin = descriptor.value;
        if (!origin) {
          return;
        }
        descriptor.value = function () {
          var args = [];
          for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
          }
          return __awaiter(this, void 0, void 0, function () {
            var prepare_promise;
            var _this = this;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  prepare_promise = Reflect.getMetadata(PREPARE, this);
                  if (!prepare_promise) {
                    prepare_promise = this[PREPARE]().finally(function () {
                      descriptor.value = origin;
                      Object.defineProperty(_this, propertyKey, descriptor);
                    });
                    Reflect.defineMetadata(PREPARE, prepare_promise, this);
                  }
                  return [4 /*yield*/, prepare_promise];
                case 1:
                  _a.sent();
                  return [2 /*return*/, origin.apply(this, args)];
              }
            });
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
    var Bucket = /** @class */function () {
      /**
       * Creates a new Bucket instance.
       * @param config - Configuration options for the bucket
       */
      function Bucket(config) {
        var _a, _b;
        this.name = (_a = config.name) !== null && _a !== void 0 ? _a : "";
        this.serializer = config.serializer || new DefaultSerializer();
        this.debug = (_b = config.debug) !== null && _b !== void 0 ? _b : false;
        var driver = config.driver;
        if (driver === exports.DefaultDrivers.LOCAL_STORAGE) {
          this.driver = LocalStorageDriver.createInstance(this.name);
        } else if (driver === exports.DefaultDrivers.INDEXED_DB) {
          this.driver = new IndexedDBStorageDriver({
            bucketName: this.name,
            version: config.version
          });
        } else if (driver === exports.DefaultDrivers.SESSION_STORAGE) {
          this.driver = SessionStorageDriver.createInstance(this.name);
        } else {
          this.driver = driver || LocalStorageDriver.createInstance(this.name);
        }
      }
      Bucket.prototype[PREPARE] = function () {
        return __awaiter(this, void 0, void 0, function () {
          var supports;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.driver.supports()];
              case 1:
                supports = _a.sent();
                if (!supports) {
                  throw new Error("Your current browser does not support this storage driver: ".concat(this.driver.name, "!"));
                }
                return [2 /*return*/, this.driver.prepare()];
            }
          });
        });
      };
      Bucket.prototype.prepared = function () {
        return __awaiter(this, void 0, void 0, function () {
          return __generator(this, function (_a) {
            return [2 /*return*/, void 0];
          });
        });
      };
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
      Bucket.prototype.observe = function (key, onChange) {
        var _this = this;
        var preparePromise = this.prepared();
        var unobserve = this.driver.observe(key, function (event) {
          return onChange(__assign$2(__assign$2({}, event), {
            target: _this
          }));
        });
        return function () {
          return preparePromise.then(unobserve);
        };
      };
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
      Bucket.prototype.setItem = function (key, value) {
        return __awaiter(this, void 0, void 0, function () {
          var blob;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.serializer.serialize(value)];
              case 1:
                blob = _a.sent();
                return [2 /*return*/, this.driver.setItem(key, blob)];
            }
          });
        });
      };
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
      Bucket.prototype.getItem = function (key) {
        return __awaiter(this, void 0, void 0, function () {
          var blob;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                return [4 /*yield*/, this.driver.getItem(key)];
              case 1:
                blob = _a.sent();
                if (!blob) {
                  return [2 /*return*/];
                }
                return [2 /*return*/, this.serializer.deserialize(blob)];
            }
          });
        });
      };
      /**
       * Clears all items from the bucket.
       *
       * @returns A promise that resolves when the bucket is cleared
       */
      Bucket.prototype.clear = function () {
        return this.driver.clear();
      };
      /**
       * Removes an item from the bucket by key.
       *
       * @param key - The key of the item to remove
       * @returns A promise that resolves when the item is removed
       */
      Bucket.prototype.removeItem = function (key) {
        return this.driver.removeItem(key);
      };
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
      Bucket.prototype.value = function (key) {
        return Storage({
          bucket: this,
          key: key
        });
      };
      __decorate$2([Prepared(), __metadata$2("design:type", Function), __metadata$2("design:paramtypes", []), __metadata$2("design:returntype", Promise)], Bucket.prototype, "prepared", null);
      __decorate$2([Prepared(), __metadata$2("design:type", Function), __metadata$2("design:paramtypes", [String, Object]), __metadata$2("design:returntype", Promise)], Bucket.prototype, "setItem", null);
      __decorate$2([Prepared(), __metadata$2("design:type", Function), __metadata$2("design:paramtypes", [String]), __metadata$2("design:returntype", Promise)], Bucket.prototype, "getItem", null);
      __decorate$2([Prepared(), __metadata$2("design:type", Function), __metadata$2("design:paramtypes", []), __metadata$2("design:returntype", void 0)], Bucket.prototype, "clear", null);
      return Bucket;
    }();

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
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
      if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
      return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __metadata(metadataKey, metadataValue) {
      if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
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
    (function () {
      try {
        return process.versions.node !== null;
      } catch (_e) {
        return false;
      }
    })();
    var InjectionType = /** @class */function () {
      function InjectionType(clazz, identifier) {
        if (identifier === void 0) {
          identifier = clazz;
        }
        this.clazz = clazz;
        this.identifier = identifier;
      }
      InjectionType.ofClazz = function (clazz) {
        return new InjectionType(clazz);
      };
      InjectionType.ofIdentifier = function (identifier) {
        return new InjectionType(Object, identifier);
      };
      InjectionType.of = function (clazz, identifier) {
        if (identifier === void 0) {
          identifier = clazz;
        }
        return new InjectionType(clazz, identifier);
      };
      Object.defineProperty(InjectionType.prototype, "isNewable", {
        get: function () {
          return this.identifier === this.clazz;
        },
        enumerable: false,
        configurable: true
      });
      return InjectionType;
    }();
    function isNull(value) {
      return value === null;
    }
    function isUndefined(value) {
      return value === undefined;
    }
    function isNotDefined(value) {
      return isNull(value) || isUndefined(value);
    }
    var Lifecycle;
    (function (Lifecycle) {
      Lifecycle["PRE_INJECT"] = "ioc-scope:pre-inject";
      Lifecycle["POST_INJECT"] = "ioc-scope:post-inject";
      Lifecycle["PRE_DESTROY"] = "ioc-scope:pre-destroy";
    })(Lifecycle || (Lifecycle = {}));
    /** @class */(function () {
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
    })();
    function Factory(produceIdentifier, scope) {
      if (scope === void 0) {
        scope = InstanceScope.SINGLETON;
      }
      return function (target, propertyKey) {
        var metadata = GlobalMetadata.getInstance();
        var clazz = target.constructor;
        if (isNotDefined(produceIdentifier)) {
          produceIdentifier = Reflect.getMetadata('design:returntype', target, propertyKey);
        }
        if (isNotDefined(produceIdentifier)) {
          throw new Error('The return type not recognized, cannot perform instance creation!');
        }
        var injections = Reflect.getMetadata('design:paramtypes', target, propertyKey);
        metadata.recordFactory(produceIdentifier, function (container, owner) {
          var instance = container.getInstance(clazz, owner);
          var func = instance[propertyKey];
          if (typeof func === 'function') {
            return function () {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
              }
              var instance = container.getInstance(clazz);
              return func.apply(instance, args);
            };
          } else {
            return function () {
              return func;
            };
          }
        }, injections, scope);
      };
    }
    function Inject(identifier) {
      return function (target, propertyKey, parameterIndex) {
        var injectClass;
        if (typeof target === 'function' && typeof parameterIndex === 'number') {
          // constructor parameter
          var targetConstr = target;
          if (typeof identifier === 'function') {
            injectClass = identifier;
          } else {
            injectClass = Reflect.getMetadata('design:paramtypes', target, propertyKey)[parameterIndex];
          }
          if (isNotDefined(injectClass)) {
            throw new Error('Type not recognized, injection cannot be performed');
          }
          var classMetadata = MetadataInstanceManager.getMetadata(targetConstr, ClassMetadata);
          classMetadata.setConstructorParameterType(parameterIndex, InjectionType.of(injectClass, identifier));
        } else if (typeof target === 'object' && target !== null && propertyKey !== undefined) {
          var injectClass_1;
          if (typeof identifier === 'function') {
            injectClass_1 = identifier;
          } else {
            injectClass_1 = Reflect.getMetadata('design:type', target, propertyKey);
          }
          var metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
          if (isNotDefined(injectClass_1)) {
            if (identifier && typeof identifier !== 'function') {
              var factoryDef = GlobalMetadata.getInstance().reader().getComponentFactory(identifier);
              if (factoryDef) {
                metadata.recordPropertyType(propertyKey, InjectionType.ofIdentifier(identifier));
                return;
              }
            }
            throw new Error('Type not recognized, injection cannot be performed');
          } else {
            metadata.recordPropertyType(propertyKey, InjectionType.of(injectClass_1, identifier));
          }
        }
      };
    }

    /**
     * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
     * @annotation
     */
    var LifecycleDecorator = function (lifecycle) {
      return function (target, propertyKey) {
        var metadata = MetadataInstanceManager.getMetadata(target.constructor, ClassMetadata);
        metadata.addLifecycleMethod(propertyKey, lifecycle);
      };
    };

    /**
     * Urn calls the methods annotated with @PostInject only once, just after the injection of properties.
     * @annotation
     */
    var PostInject = function () {
      return LifecycleDecorator(Lifecycle.POST_INJECT);
    };
    function createFactoryWrapper(produceIdentifier, produce, owner) {
      var TheFactory = /** @class */function () {
        function TheFactory() {}
        TheFactory.prototype.produce = function () {
          return produce;
        };
        TheFactory.preventTreeShaking = function () {
          return owner;
        };
        __decorate([Factory(produceIdentifier), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], TheFactory.prototype, "produce", null);
        return TheFactory;
      }();
      return TheFactory.preventTreeShaking();
    }

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
    var Persistence = /** @class */function () {
      function Persistence() {
        this.configuration = {
          name: "solidium-persistence",
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
      Persistence.default = function (configuration) {
        return createFactoryWrapper(DEFAULT_BUCKET_CONFIGURATION, configuration, Persistence);
      };
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
      Persistence.bucket = function (name, configuration) {
        return createFactoryWrapper(name, new Bucket(configuration), Persistence);
      };
      /**
       * Factory method that creates and returns the default bucket instance.
       * @internal
       */
      Persistence.prototype.getDefaultBucket = function () {
        return new Bucket(this.configuration);
      };
      /**
       * Initialization hook called after dependency injection.
       * @internal
       */
      Persistence.prototype.init = function () {
        //
      };
      __decorate$2([Inject(DEFAULT_BUCKET_CONFIGURATION), __metadata$2("design:type", Object)], Persistence.prototype, "configuration", void 0);
      __decorate$2([Factory(DEFAULT_BUCKET), __metadata$2("design:type", Function), __metadata$2("design:paramtypes", []), __metadata$2("design:returntype", void 0)], Persistence.prototype, "getDefaultBucket", null);
      __decorate$2([PostInject(), __metadata$2("design:type", Function), __metadata$2("design:paramtypes", []), __metadata$2("design:returntype", void 0)], Persistence.prototype, "init", null);
      return Persistence;
    }();

    exports.Bucket = Bucket;
    exports.DEFAULT_BUCKET = DEFAULT_BUCKET;
    exports.DEFAULT_BUCKET_CONFIGURATION = DEFAULT_BUCKET_CONFIGURATION;
    exports.DEFAULT_STORAGE_OPTIONS = DEFAULT_STORAGE_OPTIONS;
    exports.DefaultSerializer = DefaultSerializer;
    exports.DefaultStorage = DefaultStorage;
    exports.OnStorageChange = OnStorageChange;
    exports.OnStorageLoad = OnStorageLoad;
    exports.Persistence = Persistence;
    exports.Storage = Storage;
    exports.getDefaultStorageOptions = getDefaultStorageOptions;
    exports.notifyStorageChange = notifyStorageChange;
    exports.notifyStorageLoad = notifyStorageLoad;

}));
//# sourceMappingURL=index.umd.js.map
