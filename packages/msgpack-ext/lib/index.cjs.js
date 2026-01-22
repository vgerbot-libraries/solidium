'use strict';

var msgpack = require('@msgpack/msgpack');

var Types;
(function (Types) {
  Types[Types["Reference"] = 0] = "Reference";
})(Types || (Types = {}));

var Reference = /** @class */function () {
  function Reference(path) {
    this.path = path;
  }
  return Reference;
}();

var ReferenceCodec = /** @class */function () {
  function ReferenceCodec() {
    this.type = Types.Reference;
  }
  ReferenceCodec.prototype.encode = function (input) {
    if (input instanceof Reference) {
      return msgpack.encode(input.path);
    }
    return null;
  };
  ReferenceCodec.prototype.decode = function (data) {
    var result = msgpack.decode(data);
    return new Reference(result);
  };
  return ReferenceCodec;
}();

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

var IterableMapper = /** @class */function () {
  function IterableMapper() {}
  IterableMapper.prototype.transform = function (object, context, path) {
    var e_1, _a;
    context.recording(object, path);
    var referencePath = context.getReference(object, path);
    if (referencePath) {
      return new Reference(referencePath.path);
    }
    var result = [];
    context.recording(object, path);
    var i = 0;
    try {
      for (var object_1 = __values(object), object_1_1 = object_1.next(); !object_1_1.done; object_1_1 = object_1.next()) {
        var value = object_1_1.value;
        var childPath = path.child(i);
        context.recording(value, childPath);
        var mapper = context.getObjectMapper(value);
        var newValue = mapper.transform(value, context, childPath);
        result.push(newValue);
        i++;
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (object_1_1 && !object_1_1.done && (_a = object_1.return)) _a.call(object_1);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
    return this.createTransformedResult(result);
  };
  IterableMapper.prototype.revive = function (object, context, path) {
    var _this = this;
    var receiver = this.createNewInstance();
    context.recording(receiver, path);
    this.forEachTransformedResult(object, path, function (item, path) {
      var mapper = context.getObjectMapper(item);
      var reviveValue = mapper.revive(item, context, path);
      context.recording(reviveValue, path);
      _this.append(receiver, reviveValue);
    });
    return receiver;
  };
  return IterableMapper;
}();

var ArrayMapper = /** @class */function (_super) {
  __extends(ArrayMapper, _super);
  function ArrayMapper() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  ArrayMapper.prototype.createTransformedResult = function (resultArray) {
    return resultArray;
  };
  ArrayMapper.prototype.forEachTransformedResult = function (target, path, callback) {
    target.forEach(function (item, index) {
      callback(item, path.child(index));
    });
  };
  ArrayMapper.prototype.canRevive = function (object) {
    return Array.isArray(object);
  };
  ArrayMapper.prototype.canTransform = function (object) {
    return Array.isArray(object);
  };
  ArrayMapper.prototype.createNewInstance = function () {
    return [];
  };
  ArrayMapper.prototype.append = function (target, value) {
    target.push(value);
  };
  return ArrayMapper;
}(IterableMapper);

function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function isPlainObject(o) {
  if (isObject(o) === false) return false;
  // If has modified constructor
  var ctor = o.constructor;
  if (ctor === undefined) return true;
  // If has modified prototype
  var prot = ctor.prototype;
  if (isObject(prot) === false) return false;
  if (Object.hasOwn(prot, "isPrototypeOf") === false) {
    return false;
  }
  // Most likely a plain Object
  return true;
}

var MapMapper = /** @class */function (_super) {
  __extends(MapMapper, _super);
  function MapMapper() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  MapMapper.prototype.canTransform = function (object) {
    return object instanceof Map;
  };
  MapMapper.prototype.createNewInstance = function () {
    return new Map();
  };
  MapMapper.prototype.append = function (target, value) {
    target.set(value[0], value[1]);
  };
  MapMapper.prototype.createTransformedResult = function (resultArray) {
    return {
      $: 2,
      _: resultArray
    };
  };
  MapMapper.prototype.forEachTransformedResult = function (target, path, callback) {
    target._.forEach(function (item, i) {
      var childPath = path.child(i);
      callback(item, childPath);
    });
  };
  MapMapper.prototype.canRevive = function (object) {
    return isPlainObject(object) && "$" in object && "_" in object && object.$ === 2 && Array.isArray(object._);
  };
  return MapMapper;
}(IterableMapper);

var PlainObjectMapper = /** @class */function () {
  function PlainObjectMapper() {}
  PlainObjectMapper.prototype.canTransform = function (object) {
    return isPlainObject(object);
  };
  PlainObjectMapper.prototype.transform = function (object, context, path) {
    context.recording(object, path);
    var referencePath = context.getReference(object, path);
    if (referencePath) {
      return new Reference(referencePath.path);
    }
    var result = {};
    this.map(object, context, path, function (key, value, path, mapper) {
      result[key] = mapper.transform(value, context, path);
    });
    return result;
  };
  PlainObjectMapper.prototype.canRevive = function (object) {
    return isPlainObject(object);
  };
  PlainObjectMapper.prototype.revive = function (object, context, path) {
    this.map(object, context, path, function (key, value, path, mapper) {
      object[key] = mapper.revive(value, context, path);
    });
    return object;
  };
  PlainObjectMapper.prototype.map = function (object, context, path, handle) {
    context.recording(object, path);
    for (var key in object) {
      var value = object[key];
      var childPath = path.child(key);
      context.recording(value, childPath);
      var mapper = context.getObjectMapper(value);
      handle(key, value, childPath, mapper);
    }
  };
  return PlainObjectMapper;
}();

var SetMapper = /** @class */function (_super) {
  __extends(SetMapper, _super);
  function SetMapper() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  SetMapper.prototype.createTransformedResult = function (resultArray) {
    return {
      $: 1,
      _: resultArray
    };
  };
  SetMapper.prototype.forEachTransformedResult = function (target, path, callback) {
    target._.forEach(function (item, i) {
      callback(item, path.child(i));
    });
  };
  SetMapper.prototype.canRevive = function (object) {
    return isPlainObject(object) && "$" in object && "_" in object && object.$ === 1 && Array.isArray(object._);
  };
  SetMapper.prototype.append = function (target, value) {
    target.add(value);
  };
  SetMapper.prototype.canTransform = function (object) {
    return object instanceof Set;
  };
  SetMapper.prototype.createNewInstance = function () {
    return new Set();
  };
  return SetMapper;
}(IterableMapper);

var ObjectPath = /** @class */function () {
  function ObjectPath(path, parent) {
    this.path = path;
    this.children = {};
    this.str = path.join(".");
    this.parent = parent || this;
  }
  ObjectPath.prototype.child = function (key) {
    if (key in this.children) {
      return this.children[key];
    } else {
      var child = new ObjectPath(this.path.concat("".concat(key)), this);
      this.children[key] = child;
      return child;
    }
  };
  ObjectPath.prototype.equals = function (other) {
    if (this === other) {
      return true;
    }
    if (this.path.length !== other.path.length) {
      return false;
    }
    return !this.path.some(function (it, idx) {
      return other.path[idx] !== it;
    });
  };
  ObjectPath.prototype.toString = function () {
    return this.str;
  };
  ObjectPath.prototype.root = function () {
    return this.parent === this ? this : this.parent.root();
  };
  ObjectPath.prototype.descendant = function (path) {
    return path.reduce(function (parent, key) {
      return parent.child(key);
    }, this);
  };
  return ObjectPath;
}();

var CodecContext = /** @class */function () {
  function CodecContext() {
    this.pathObjectMap = new Map();
    this.rootPath = new ObjectPath([]);
    this.objectMappers = [new SetMapper(), new MapMapper(), new ArrayMapper(), new PlainObjectMapper()];
    this.defaultObjectMapper = {
      canTransform: function () {
        return true;
      },
      transform: function (object, context, path) {
        context.recording(object, path);
        var referencePath = context.getReference(object, path);
        if (referencePath) {
          return new Reference(path.path);
        }
        return object;
      },
      canRevive: function () {
        return true;
      },
      revive: function (object) {
        return object;
      }
    };
  }
  CodecContext.prototype.recording = function (object, path) {
    this.pathObjectMap.set(path, object);
  };
  CodecContext.prototype.getObject = function (path) {
    return this.pathObjectMap.get(path);
  };
  CodecContext.prototype.getRootPath = function () {
    return this.rootPath;
  };
  CodecContext.prototype.registerObjectMapper = function (objectMapper) {
    this.objectMappers.unshift(objectMapper);
  };
  return CodecContext;
}();

var ReferenceMapper = /** @class */function () {
  function ReferenceMapper() {}
  ReferenceMapper.prototype.canTransform = function () {
    return false;
  };
  ReferenceMapper.prototype.transform = function () {
    throw new Error("Method not implemented.");
  };
  ReferenceMapper.prototype.canRevive = function (object) {
    return object instanceof Reference;
  };
  ReferenceMapper.prototype.revive = function (object, context) {
    var root = context.getRootPath();
    var referenceToPath = root.descendant(object.path);
    return context.getObject(referenceToPath);
  };
  return ReferenceMapper;
}();

var DecodeContext = /** @class */function (_super) {
  __extends(DecodeContext, _super);
  function DecodeContext() {
    var _this = _super.call(this) || this;
    _this.registerObjectMapper(new ReferenceMapper());
    return _this;
  }
  DecodeContext.prototype.revive = function (decoded) {
    var mapper = this.getObjectMapper(decoded);
    return mapper.revive(decoded, this, this.getRootPath());
  };
  DecodeContext.prototype.getObjectMapper = function (object) {
    return this.objectMappers.find(function (it) {
      return it.canRevive(object);
    }) || this.defaultObjectMapper;
  };
  return DecodeContext;
}(CodecContext);

function decode(buffer) {
  var extensionCodec = new msgpack.ExtensionCodec();
  extensionCodec.register(new ReferenceCodec());
  var context = new DecodeContext();
  var decoded = msgpack.decode(buffer, {
    context: context,
    extensionCodec: extensionCodec
  });
  return context.revive(decoded);
}

var EncodeContext = /** @class */function (_super) {
  __extends(EncodeContext, _super);
  function EncodeContext() {
    var _this = _super.apply(this, __spreadArray([], __read(arguments), false)) || this;
    _this.objectPathMap = new Map();
    return _this;
  }
  EncodeContext.prototype.recording = function (object, path) {
    if (object === null || object === undefined) {
      return;
    }
    switch (typeof object) {
      case "boolean":
      case "number":
      case "string":
        return;
    }
    _super.prototype.recording.call(this, object, path);
    var paths = this.objectPathMap.get(object) || [];
    paths.push(path);
    this.objectPathMap.set(object, paths);
  };
  EncodeContext.prototype.isHandled = function (object) {
    return this.objectPathMap.has(object);
  };
  EncodeContext.prototype.getReference = function (object, path) {
    var paths = this.objectPathMap.get(object);
    if (!paths) {
      return;
    }
    return paths[0] !== path ? paths[0] : undefined;
  };
  EncodeContext.prototype.transformObject = function (object) {
    var mapper = this.getObjectMapper(object);
    var path = this.getRootPath();
    return mapper.transform(object, this, path);
  };
  EncodeContext.prototype.getObjectMapper = function (object) {
    return this.objectMappers.find(function (it) {
      return it.canTransform(object);
    }) || this.defaultObjectMapper;
  };
  return EncodeContext;
}(CodecContext);

function encode(input) {
  var extensionCodec = new msgpack.ExtensionCodec();
  extensionCodec.register(new ReferenceCodec());
  var context = new EncodeContext();
  var transformed = context.transformObject(input);
  return msgpack.encode(transformed, {
    context: context,
    extensionCodec: extensionCodec
  });
}

exports.decode = decode;
exports.encode = encode;
//# sourceMappingURL=index.cjs.js.map
