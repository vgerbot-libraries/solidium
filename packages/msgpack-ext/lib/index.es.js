import { encode as encode$1, decode as decode$1, ExtensionCodec } from '@msgpack/msgpack';
import { isPlainObject } from 'is-plain-object';

class ObjectPath {
  constructor(path, parent) {
    this.path = path;
    this.children = {};
    this.str = path.join('.');
    this.parent = parent || this;
  }
  child(key) {
    if (key in this.children) {
      return this.children[key];
    } else {
      const child = new ObjectPath(this.path.concat(key + ''), this);
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
}

class Reference {
  constructor(path) {
    this.path = path;
  }
}

class EncodeContext extends CodecContext {
  constructor() {
    super();
    this.objectPathMap = new Map();
    this.referenceHandlers = [];
    this.defaultReferenceHandler = {
      accept() {
        return true;
      },
      transform(object, context, path) {
        context.recording(object, path);
        const referencePath = context.getReference(object, path);
        if (referencePath) {
          return new Reference(path.path);
        }
        return object;
      }
    };
  }
  recording(object, path) {
    if (object === null || object === undefined) {
      return;
    }
    switch (typeof object) {
      case 'boolean':
      case 'number':
      case 'string':
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
  handleReference(object) {
    const handler = this.getReferenceHandler(object);
    const path = this.getRootPath();
    return handler.transform(object, this, path);
  }
  getReferenceHandler(object) {
    return this.referenceHandlers.find(it => it.accept(object)) || this.defaultReferenceHandler;
  }
  registerReferenceHandler(referenceHandler) {
    this.referenceHandlers.push(referenceHandler);
  }
}

var Types;
(function (Types) {
  Types[Types["Reference"] = 0] = "Reference";
})(Types || (Types = {}));

class ReferenceCodec {
  constructor() {
    this.type = Types.Reference;
  }
  encode(input, context) {
    if (input instanceof Reference) {
      return encode$1(input.path);
    }
    return null;
  }
  decode(data, extensionType, context) {
    const result = decode$1(data);
    return new Reference(result);
  }
}

class ObjectReferenceHandler {
  accept(object) {
    return isPlainObject(object);
  }
  transform(object, context, path) {
    context.recording(object, path);
    const referencePath = context.getReference(object, path);
    if (referencePath) {
      return new Reference(referencePath.path);
    }
    const result = {};
    for (const key in object) {
      const value = object[key];
      const childPath = path.child(key);
      context.recording(value, childPath);
      const handler = context.getReferenceHandler(value);
      result[key] = handler.transform(value, context, childPath);
    }
    return result;
  }
}

class ArrayReferenceHandler {
  accept(object) {
    return Array.isArray(object);
  }
  transform(object, context, path) {
    context.recording(object, path);
    const referencePath = context.getReference(object, path);
    if (referencePath) {
      return new Reference(referencePath.path);
    }
    return object.map((it, i) => {
      const childPath = path.child(i);
      context.recording(it, childPath);
      const handler = context.getReferenceHandler(childPath);
      return handler.transform(it, context, childPath);
    });
  }
}

function encode(input) {
  const extensionCodec = new ExtensionCodec();
  extensionCodec.register(new ReferenceCodec());
  const context = new EncodeContext();
  context.registerReferenceHandler(new ObjectReferenceHandler());
  context.registerReferenceHandler(new ArrayReferenceHandler());
  const transformed = context.handleReference(input);
  return encode$1(transformed, {
    context,
    extensionCodec
  });
}

class DecodeContext extends CodecContext {}

function decode(buffer) {
  const extensionCodec = new ExtensionCodec();
  extensionCodec.register(new ReferenceCodec());
  const context = new DecodeContext();
  return decode$1(buffer, {
    context,
    extensionCodec
  });
}

export { decode, encode };
//# sourceMappingURL=index.es.js.map
