'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var msgpack = require('@msgpack/msgpack');
var isPlainObject = require('is-plain-object');

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
  return CodecContext;
}();

var Reference = /** @class */function () {
  function Reference(path) {
    this.path = path;
  }
  return Reference;
}();

var EncodeContext = /** @class */function (_super) {
  __extends(EncodeContext, _super);
  function EncodeContext() {
    var _this = _super.call(this) || this;
    _this.objectPathMap = new Map();
    _this.referenceHandlers = [];
    _this.defaultReferenceHandler = {
      accept: function () {
        return true;
      },
      traverse: function (object, context, path) {
        context.recording(object, path);
      },
      transform: function (object, context, path) {
        var referencePath = context.getReference(object, path);
        if (referencePath) {
          return new Reference(path.path);
        }
        return object;
      }
    };
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
  EncodeContext.prototype.handleReference = function (object) {
    var handler = this.getReferenceHandler(object);
    var path = this.getRootPath();
    handler.traverse(object, this, path);
    return handler.transform(object, this, path);
  };
  EncodeContext.prototype.getReferenceHandler = function (object) {
    return this.referenceHandlers.find(function (it) {
      return it.accept(object);
    }) || this.defaultReferenceHandler;
  };
  EncodeContext.prototype.registerReferenceHandler = function (referenceHandler) {
    this.referenceHandlers.push(referenceHandler);
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

var ObjectReferenceHandler = /** @class */function () {
  function ObjectReferenceHandler() {}
  ObjectReferenceHandler.prototype.accept = function (object) {
    return isPlainObject.isPlainObject(object);
  };
  ObjectReferenceHandler.prototype.traverse = function (object, context, path) {
    context.recording(object, path);
    for (var key in object) {
      var value = object[key];
      var childPath = path.child(key);
      if (context.isHandled(value)) {
        context.recording(object, childPath);
        continue;
      }
      var handler = context.getReferenceHandler(value);
      handler.traverse(value, context, childPath);
    }
  };
  ObjectReferenceHandler.prototype.transform = function (object, context, path) {
    var referencePath = context.getReference(object, path);
    if (referencePath) {
      return new Reference(referencePath.path);
    }
    var result = {};
    for (var key in object) {
      var value = object[key];
      var childPath = path.child(key);
      var handler = context.getReferenceHandler(value);
      result[key] = handler.transform(value, context, childPath);
    }
    return result;
  };
  return ObjectReferenceHandler;
}();

var ArrayReferenceHandler = /** @class */function () {
  function ArrayReferenceHandler() {}
  ArrayReferenceHandler.prototype.accept = function (object) {
    return Array.isArray(object);
  };
  ArrayReferenceHandler.prototype.traverse = function (object, context, path) {
    context.recording(object, path);
    for (var i = 0; i < object.length; i++) {
      var value = object[i];
      var childPath = path.child(i);
      if (context.isHandled(value)) {
        context.recording(object, childPath);
        continue;
      }
      var handler = context.getReferenceHandler(value);
      handler.traverse(value, context, childPath);
    }
  };
  ArrayReferenceHandler.prototype.transform = function (object, context, path) {
    var referencePath = context.getReference(object, path);
    if (referencePath) {
      return new Reference(referencePath.path);
    }
    return object.map(function (it, i) {
      var childPath = path.child(i);
      var handler = context.getReferenceHandler(childPath);
      return handler.transform(it, context, childPath);
    });
  };
  return ArrayReferenceHandler;
}();

function encode(input) {
  var extensionCodec = new msgpack.ExtensionCodec();
  extensionCodec.register(new ReferenceCodec());
  var context = new EncodeContext();
  context.registerReferenceHandler(new ObjectReferenceHandler());
  context.registerReferenceHandler(new ArrayReferenceHandler());
  var transformed = context.handleReference(input);
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
  return DecodeContext;
}(CodecContext);

function decode(buffer) {
  var extensionCodec = new msgpack.ExtensionCodec();
  extensionCodec.register(new ReferenceCodec());
  var context = new DecodeContext();
  return msgpack.decode(buffer, {
    context: context,
    extensionCodec: extensionCodec
  });
}

exports.decode = decode;
exports.encode = encode;
//# sourceMappingURL=index.cjs.js.map
