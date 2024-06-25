'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var messagepack = require('messagepack');
var isPlainObject = require('is-plain-object');

var ObjectPath = /** @class */function () {
  function ObjectPath(path, parent) {
    this.path = path;
    this.children = {};
    this.str = path.join('.');
    this.parent = parent || this;
  }
  ObjectPath.prototype.child = function (key) {
    if (key in this.children) {
      return this.children[key];
    } else {
      var child = new ObjectPath(this.path.concat(key + ''), this);
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

var Tags;
(function (Tags) {
  Tags[Tags["Ref"] = 0] = "Ref";
  Tags[Tags["Blob"] = 1] = "Blob";
  Tags[Tags["File"] = 2] = "File";
  Tags[Tags["RegExp"] = 3] = "RegExp";
  Tags[Tags["Undefined"] = 4] = "Undefined";
  Tags[Tags["Set"] = 5] = "Set";
  Tags[Tags["Map"] = 6] = "Map";
  Tags[Tags["Uint8Array"] = 7] = "Uint8Array";
  Tags[Tags["Uint16Array"] = 8] = "Uint16Array";
  Tags[Tags["Uint32Array"] = 9] = "Uint32Array";
  Tags[Tags["Int8Array"] = 10] = "Int8Array";
  Tags[Tags["Int16Array"] = 11] = "Int16Array";
  Tags[Tags["Int32Array"] = 12] = "Int32Array";
  Tags[Tags["Float32Array"] = 13] = "Float32Array";
  Tags[Tags["Float64Array"] = 14] = "Float64Array";
  Tags[Tags["BigInt64Array"] = 15] = "BigInt64Array";
  Tags[Tags["BigUint64Array"] = 16] = "BigUint64Array";
  Tags[Tags["DataView"] = 17] = "DataView";
  Tags[Tags["Object"] = 18] = "Object";
  Tags[Tags["Array"] = 19] = "Array";
  Tags[Tags["Primary"] = 20] = "Primary";
})(Tags || (Tags = {}));
function isValidTag(num) {
  return Tags[num] in Tags;
}

var ReferenceTransformer = /** @class */function () {
  function ReferenceTransformer() {}
  ReferenceTransformer.prototype.getTag = function () {
    return Tags.Ref;
  };
  ReferenceTransformer.prototype.accept = function () {
    return false;
  };
  ReferenceTransformer.prototype.transform = function (object, context, path) {
    var referencePath = context.getReference(object);
    if (!referencePath) {
      throw new Error("Object is not reference: ".concat(path.path));
    }
    return {
      $: Tags.Ref,
      _: referencePath.path
    };
  };
  ReferenceTransformer.prototype.revive = function (data, context, path) {
    var root = path.root();
    var pathArray = data._;
    var targetPath = root.descendant(pathArray);
    return context.getObject(targetPath);
  };
  return ReferenceTransformer;
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var ObjectTransformer = /** @class */function () {
  function ObjectTransformer() {}
  ObjectTransformer.prototype.getTag = function () {
    return Tags.Object;
  };
  ObjectTransformer.prototype.accept = function (object) {
    return !!object && isPlainObject.isPlainObject(object);
  };
  ObjectTransformer.prototype.pretransform = function (object, context, path) {
    context.recording(object, path);
    for (var key in object) {
      var value = Reflect.get(object, key);
      if (context.isHandled(value)) {
        continue;
      }
      var childPath = path.child(key);
      var transformer = context.transformerOf(value);
      if (transformer.pretransform) {
        transformer.pretransform(value, context, childPath);
      } else {
        context.recording(value, childPath);
      }
    }
  };
  ObjectTransformer.prototype.transform = function (object, context, path) {
    return __awaiter(this, void 0, void 0, function () {
      var result, _a, _b, _c, _i, key, childPath, value, transformer, transformed;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            result = {};
            context.recording(result, path);
            _a = object;
            _b = [];
            for (_c in _a) _b.push(_c);
            _i = 0;
            _d.label = 1;
          case 1:
            if (!(_i < _b.length)) return [3 /*break*/, 4];
            _c = _b[_i];
            if (!(_c in _a)) return [3 /*break*/, 3];
            key = _c;
            childPath = path.child(key);
            value = object[key];
            transformer = context.transformerOf(value);
            return [4 /*yield*/, transformer.transform(value, context, childPath)];
          case 2:
            transformed = _d.sent();
            result[key] = transformed;
            _d.label = 3;
          case 3:
            _i++;
            return [3 /*break*/, 1];
          case 4:
            return [2 /*return*/, Promise.resolve(result)];
        }
      });
    });
  };
  ObjectTransformer.prototype.revive = function (data, context, path) {
    var result = {};
    context.recording(result, path);
    for (var key in data) {
      var value = data[key];
      var childPath = path.child(key);
      var reviver = context.reviverOf(value);
      if (!reviver) {
        result[key] = value;
        continue;
      }
      var revived = reviver.revive(value, context, childPath);
      context.recording(revived, childPath);
      result[key] = revived;
    }
    return result;
  };
  return ObjectTransformer;
}();

var BlobTransformer = /** @class */function () {
  function BlobTransformer() {}
  BlobTransformer.prototype.getTag = function () {
    return Tags.Blob;
  };
  BlobTransformer.prototype.accept = function (object) {
    if (typeof File === 'function' && object instanceof File) {
      return false;
    }
    return object instanceof Blob;
  };
  BlobTransformer.prototype.transform = function (object) {
    return object.arrayBuffer().then(function (buffer) {
      return {
        $: Tags.Blob,
        _: [buffer, {
          type: object.type
        }]
      };
    });
  };
  BlobTransformer.prototype.revive = function (data) {
    var blob = new Blob([data._[0]], data._[1]);
    return blob;
  };
  return BlobTransformer;
}();

var FileTransformer = /** @class */function () {
  function FileTransformer() {}
  FileTransformer.prototype.getTag = function () {
    return Tags.File;
  };
  FileTransformer.prototype.accept = function (object) {
    if (typeof File !== 'function') {
      return false;
    }
    return object instanceof File;
  };
  FileTransformer.prototype.transform = function (object) {
    return object.arrayBuffer().then(function (buffer) {
      return {
        $: Tags.File,
        _: [buffer, object.name, {
          type: object.type
        }]
      };
    });
  };
  FileTransformer.prototype.revive = function (data) {
    return new File([data._[0]], data._[1], data._[2]);
  };
  return FileTransformer;
}();

var PrimaryTransformer = /** @class */function () {
  function PrimaryTransformer() {}
  PrimaryTransformer.prototype.getTag = function () {
    return Tags.Primary;
  };
  PrimaryTransformer.prototype.accept = function (object) {
    switch (typeof object) {
      case 'string':
      case 'number':
      case 'boolean':
        return true;
    }
    if (object instanceof Date || object === null) {
      return true;
    }
    if (object instanceof ArrayBuffer) {
      return true;
    }
    return false;
  };
  PrimaryTransformer.prototype.transform = function (object) {
    return object;
  };
  PrimaryTransformer.prototype.revive = function (data) {
    return data;
  };
  return PrimaryTransformer;
}();

var ArrayTransformer = /** @class */function () {
  function ArrayTransformer() {}
  ArrayTransformer.prototype.getTag = function () {
    return Tags.Array;
  };
  ArrayTransformer.prototype.accept = function (object) {
    return Array.isArray(object);
  };
  ArrayTransformer.prototype.pretransform = function (object, context, path) {
    context.recording(object, path);
    object.forEach(function (it, index) {
      if (context.isHandled(it)) {
        return;
      }
      var childPath = path.child(index + '');
      var transformer = context.transformerOf(it);
      if (transformer.pretransform) {
        transformer.pretransform(it, context, childPath);
      } else {
        context.recording(it, childPath);
      }
    });
  };
  ArrayTransformer.prototype.transform = function (object, context, path) {
    return Promise.all(object.map(function (it, index) {
      var childPath = path.child(index);
      var transformer = context.transformerOf(it);
      return transformer.transform(it, context, childPath);
    }));
  };
  ArrayTransformer.prototype.revive = function (transformedData, context, path) {
    context.recording(transformedData, path);
    transformedData.forEach(function (value, index) {
      var transformer = context.reviverOf(value);
      if (!transformer) {
        return value;
      }
      var childPath = path.child(index);
      var revivedValue = transformer.revive(value, context, childPath);
      context.recording(revivedValue, childPath);
      transformedData[index] = revivedValue;
    });
    return transformedData;
  };
  return ArrayTransformer;
}();

var UndefinedTransformer = /** @class */function () {
  function UndefinedTransformer() {}
  UndefinedTransformer.prototype.getTag = function () {
    return Tags.Undefined;
  };
  UndefinedTransformer.prototype.accept = function (object) {
    return object === undefined;
  };
  UndefinedTransformer.prototype.transform = function () {
    return {
      $: Tags.Undefined,
      _: null
    };
  };
  UndefinedTransformer.prototype.revive = function () {
    return;
  };
  return UndefinedTransformer;
}();

var transformers = [];
function registerTransformer(transformer) {
  if (transformers.indexOf(transformer) > -1) {
    return;
  }
  transformers.push(transformer);
}
function transformerOfObject(object) {
  var transformer = transformers.find(function (it) {
    return it.accept(object);
  });
  return transformer;
}
function transformerOfTag(tag) {
  var transformer = transformers.find(function (it) {
    return it.getTag() === tag;
  });
  return transformer;
}
function isTransformedObject(obj) {
  return isPlainObject.isPlainObject(obj) && '$' in obj && '_' in obj;
}
registerTransformer(new ObjectTransformer());
registerTransformer(new ArrayTransformer());
registerTransformer(new UndefinedTransformer());
registerTransformer(new BlobTransformer());
registerTransformer(new FileTransformer());
registerTransformer(new PrimaryTransformer());
registerTransformer(new ReferenceTransformer());

var EncodeContext = /** @class */function () {
  function EncodeContext() {
    this.objectPathMap = new Map();
    this.pathObjectMap = new Map();
    this.transformerMap = new Map();
  }
  EncodeContext.prototype.isHandled = function (object) {
    return this.objectPathMap.has(object);
  };
  EncodeContext.prototype.recording = function (object, path) {
    if (object === null || object === undefined) {
      return;
    }
    switch (typeof object) {
      case 'boolean':
      case 'number':
      case 'string':
        return;
    }
    var paths = this.objectPathMap.get(object) || [];
    paths.push(path);
    this.objectPathMap.set(object, paths);
    this.pathObjectMap.set(path, object);
  };
  EncodeContext.prototype.getObject = function (path) {
    return this.pathObjectMap.get(path);
  };
  EncodeContext.prototype.getReference = function (object) {
    var paths = this.objectPathMap.get(object);
    if (!paths) {
      return;
    }
    return paths[0];
  };
  EncodeContext.prototype.isReference = function (object) {
    return this.getReference(object) !== undefined;
  };
  EncodeContext.prototype.transformerOf = function (object) {
    if (this.isReference(object)) {
      return new ReferenceTransformer();
    }
    var transformer = this.transformerMap.get(object);
    if (!transformer) {
      transformer = transformerOfObject(object);
    }
    if (!transformer) {
      throw new TypeError("Cannot serialize value: ".concat(object));
    }
    this.transformerMap.set(object, transformer);
    return transformer;
  };
  return EncodeContext;
}();

var ReviveContext = /** @class */function () {
  function ReviveContext() {
    this.pathObjectMap = new Map();
  }
  ReviveContext.prototype.recording = function (object, path) {
    this.pathObjectMap.set(path, object);
  };
  ReviveContext.prototype.getObject = function (path) {
    return this.pathObjectMap.get(path);
  };
  ReviveContext.prototype.reviverOf = function (object) {
    if (isTransformedObject(object) && isValidTag(object.$)) {
      return transformerOfTag(object.$);
    }
    return transformerOfObject(object);
  };
  return ReviveContext;
}();

function serialize(object, options) {
  if (options === void 0) {
    options = {
      circular: false
    };
  }
  var context = new EncodeContext();
  var path = new ObjectPath([]);
  var transformer = context.transformerOf(object);
  if (options.circular) {
    if (transformer.pretransform) {
      transformer.pretransform(object, context, path);
    }
  }
  return Promise.resolve(transformer.transform(object, context, path)).then(function (serializable) {
    return messagepack.encode(serializable);
  });
}
function deserialize(data) {
  var context = new ReviveContext();
  var object = messagepack.decode(data);
  var path = new ObjectPath([]);
  var reviver = context.reviverOf(object);
  if (!reviver) {
    return object;
  }
  return reviver.revive(object, context, path);
}

exports.deserialize = deserialize;
exports.serialize = serialize;
//# sourceMappingURL=index.cjs.js.map
