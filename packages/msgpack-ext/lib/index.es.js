import { encode as encode$1, decode as decode$1, ExtensionCodec } from '@msgpack/msgpack';
import { isPlainObject } from 'is-plain-object';

class Reference {
  constructor(path) {
    this.path = path;
  }
}

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
    this.objectMappers = [];
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
    this.objectMappers.push(objectMapper);
  }
}

class EncodeContext extends CodecContext {
  constructor() {
    super();
    this.objectPathMap = new Map();
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
  transformObject(object) {
    const handler = this.getObjectMapper(object);
    const path = this.getRootPath();
    return handler.transform(object, this, path);
  }
  getObjectMapper(object) {
    return this.objectMappers.find(it => it.canTransform(object)) || this.defaultObjectMapper;
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

class ArrayMapper {
  canTransform(object) {
    return object.length >= 0;
  }
  transform(object, context, path) {
    context.recording(object, path);
    const referencePath = context.getReference(object, path);
    if (referencePath) {
      return new Reference(referencePath.path);
    }
    const result = Array(object.length);
    this.map(object, context, path, (index, item, path, mapper) => {
      result[index] = mapper.transform(item, context, path);
    });
    return result;
  }
  canRevive(object) {
    return this.canTransform(object);
  }
  revive(object, context, path) {
    const isReadonly = Reflect.set(object, 0, object[0]);
    const receiver = isReadonly ? [] : object;
    this.map(object, context, path, (index, item, path, mapper) => {
      receiver[index] = mapper.revive(item, context, path);
    });
    return receiver;
  }
  map(object, context, path, handle) {
    context.recording(object, path);
    for (let i = 0; i < object.length; i++) {
      const value = object[i];
      const childPath = path.child(i);
      context.recording(value, childPath);
      const mapper = context.getObjectMapper(value);
      handle(i, value, childPath, mapper);
    }
    return object;
  }
}

function encode(input) {
  const extensionCodec = new ExtensionCodec();
  extensionCodec.register(new ReferenceCodec());
  const context = new EncodeContext();
  context.registerObjectMapper(new PlainObjectMapper());
  context.registerObjectMapper(new ArrayMapper());
  const transformed = context.transformObject(input);
  return encode$1(transformed, {
    context,
    extensionCodec
  });
}

class DecodeContext extends CodecContext {
  revive(decoded) {
    const mapper = this.getObjectMapper(decoded);
    return mapper.revive(decoded, this, this.getRootPath());
  }
  getObjectMapper(object) {
    return this.objectMappers.find(it => it.canRevive(object)) || this.defaultObjectMapper;
  }
}

class ReferenceMapper {
  canTransform() {
    return false;
  }
  transform() {
    throw new Error('Method not implemented.');
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

function decode(buffer) {
  const extensionCodec = new ExtensionCodec();
  extensionCodec.register(new ReferenceCodec());
  const context = new DecodeContext();
  context.registerObjectMapper(new PlainObjectMapper());
  context.registerObjectMapper(new ArrayMapper());
  context.registerObjectMapper(new ReferenceMapper());
  const decoded = decode$1(buffer, {
    context,
    extensionCodec
  });
  return context.revive(decoded);
}

export { decode, encode };
//# sourceMappingURL=index.es.js.map
