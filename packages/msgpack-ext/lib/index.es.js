import { encode as encode$1, decode as decode$1, ExtensionCodec } from '@msgpack/msgpack';

class Reference {
  constructor(path) {
    this.path = path;
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
  return Object.prototype.toString.call(o) === '[object Object]';
}
function isPlainObject(o) {
  if (isObject(o) === false) return false;
  // If has modified constructor
  const ctor = o.constructor;
  if (ctor === undefined) return true;
  // If has modified prototype
  const prot = ctor.prototype;
  if (isObject(prot) === false) return false;
  if (Object.prototype.hasOwnProperty.call(prot, 'isPrototypeOf') === false) {
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
    return isPlainObject(object) && '$' in object && '_' in object && object.$ === 2 && Array.isArray(object._);
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
    return isPlainObject(object) && '$' in object && '_' in object && object.$ === 1 && Array.isArray(object._);
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
    const mapper = this.getObjectMapper(object);
    const path = this.getRootPath();
    return mapper.transform(object, this, path);
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
  encode(input) {
    if (input instanceof Reference) {
      return encode$1(input.path);
    }
    return null;
  }
  decode(data) {
    const result = decode$1(data);
    return new Reference(result);
  }
}

function encode(input) {
  const extensionCodec = new ExtensionCodec();
  extensionCodec.register(new ReferenceCodec());
  const context = new EncodeContext();
  const transformed = context.transformObject(input);
  return encode$1(transformed, {
    context,
    extensionCodec
  });
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
  const extensionCodec = new ExtensionCodec();
  extensionCodec.register(new ReferenceCodec());
  const context = new DecodeContext();
  const decoded = decode$1(buffer, {
    context,
    extensionCodec
  });
  return context.revive(decoded);
}

export { decode, encode };
//# sourceMappingURL=index.es.js.map
