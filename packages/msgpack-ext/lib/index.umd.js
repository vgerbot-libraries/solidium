(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@msgpack/msgpack'), require('is-plain-object')) :
    typeof define === 'function' && define.amd ? define(['exports', '@msgpack/msgpack', 'is-plain-object'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MPext = {}, global.msgpack, global.isPlainObject));
})(this, (function (exports, msgpack, isPlainObject) { 'use strict';

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

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var Reference = /** @class */function () {
      function Reference(path) {
        this.path = path;
      }
      return Reference;
    }();

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

    var CodecContext = /** @class */function () {
      function CodecContext() {
        this.pathObjectMap = new Map();
        this.rootPath = new ObjectPath([]);
        this.objectMappers = [];
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
        this.objectMappers.push(objectMapper);
      };
      return CodecContext;
    }();

    var EncodeContext = /** @class */function (_super) {
      __extends(EncodeContext, _super);
      function EncodeContext() {
        var _this = _super.call(this) || this;
        _this.objectPathMap = new Map();
        return _this;
      }
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
        var handler = this.getObjectMapper(object);
        var path = this.getRootPath();
        return handler.transform(object, this, path);
      };
      EncodeContext.prototype.getObjectMapper = function (object) {
        return this.objectMappers.find(function (it) {
          return it.canTransform(object);
        }) || this.defaultObjectMapper;
      };
      return EncodeContext;
    }(CodecContext);

    var Types;
    (function (Types) {
      Types[Types["Reference"] = 0] = "Reference";
    })(Types || (Types = {}));

    var ReferenceCodec = /** @class */function () {
      function ReferenceCodec() {
        this.type = Types.Reference;
      }
      ReferenceCodec.prototype.encode = function (input, context) {
        if (input instanceof Reference) {
          return msgpack.encode(input.path);
        }
        return null;
      };
      ReferenceCodec.prototype.decode = function (data, extensionType, context) {
        var result = msgpack.decode(data);
        return new Reference(result);
      };
      return ReferenceCodec;
    }();

    var PlainObjectMapper = /** @class */function () {
      function PlainObjectMapper() {}
      PlainObjectMapper.prototype.canTransform = function (object) {
        return isPlainObject.isPlainObject(object);
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
        return isPlainObject.isPlainObject(object);
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

    var ArrayMapper = /** @class */function () {
      function ArrayMapper() {}
      ArrayMapper.prototype.canTransform = function (object) {
        return object.length >= 0;
      };
      ArrayMapper.prototype.transform = function (object, context, path) {
        context.recording(object, path);
        var referencePath = context.getReference(object, path);
        if (referencePath) {
          return new Reference(referencePath.path);
        }
        var result = Array(object.length);
        this.map(object, context, path, function (index, item, path, mapper) {
          result[index] = mapper.transform(item, context, path);
        });
        return result;
      };
      ArrayMapper.prototype.canRevive = function (object) {
        return this.canTransform(object);
      };
      ArrayMapper.prototype.revive = function (object, context, path) {
        var isReadonly = Reflect.set(object, 0, object[0]);
        var receiver = isReadonly ? [] : object;
        this.map(object, context, path, function (index, item, path, mapper) {
          receiver[index] = mapper.revive(item, context, path);
        });
        return receiver;
      };
      ArrayMapper.prototype.map = function (object, context, path, handle) {
        context.recording(object, path);
        for (var i = 0; i < object.length; i++) {
          var value = object[i];
          var childPath = path.child(i);
          context.recording(value, childPath);
          var mapper = context.getObjectMapper(value);
          handle(i, value, childPath, mapper);
        }
        return object;
      };
      return ArrayMapper;
    }();

    function encode(input) {
      var extensionCodec = new msgpack.ExtensionCodec();
      extensionCodec.register(new ReferenceCodec());
      var context = new EncodeContext();
      context.registerObjectMapper(new PlainObjectMapper());
      context.registerObjectMapper(new ArrayMapper());
      var transformed = context.transformObject(input);
      return msgpack.encode(transformed, {
        context: context,
        extensionCodec: extensionCodec
      });
    }

    var DecodeContext = /** @class */function (_super) {
      __extends(DecodeContext, _super);
      function DecodeContext() {
        return _super !== null && _super.apply(this, arguments) || this;
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

    var ReferenceMapper = /** @class */function () {
      function ReferenceMapper() {}
      ReferenceMapper.prototype.canTransform = function () {
        return false;
      };
      ReferenceMapper.prototype.transform = function () {
        throw new Error('Method not implemented.');
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

    function decode(buffer) {
      var extensionCodec = new msgpack.ExtensionCodec();
      extensionCodec.register(new ReferenceCodec());
      var context = new DecodeContext();
      context.registerObjectMapper(new PlainObjectMapper());
      context.registerObjectMapper(new ArrayMapper());
      context.registerObjectMapper(new ReferenceMapper());
      var decoded = msgpack.decode(buffer, {
        context: context,
        extensionCodec: extensionCodec
      });
      return context.revive(decoded);
    }

    exports.decode = decode;
    exports.encode = encode;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
