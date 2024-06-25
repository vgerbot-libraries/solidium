import { encode, decode } from 'messagepack';
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

class ReferenceTransformer {
  getTag() {
    return Tags.Ref;
  }
  accept() {
    return false;
  }
  transform(object, context, path) {
    const referencePath = context.getReference(object);
    if (!referencePath) {
      throw new Error(`Object is not reference: ${path.path}`);
    }
    return {
      $: Tags.Ref,
      _: referencePath.path
    };
  }
  revive(data, context, path) {
    const root = path.root();
    const pathArray = data._;
    const targetPath = root.descendant(pathArray);
    return context.getObject(targetPath);
  }
}

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

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class ObjectTransformer {
  getTag() {
    return Tags.Object;
  }
  accept(object) {
    return !!object && isPlainObject(object);
  }
  pretransform(object, context, path) {
    context.recording(object, path);
    for (const key in object) {
      const value = Reflect.get(object, key);
      if (context.isHandled(value)) {
        continue;
      }
      const childPath = path.child(key);
      const transformer = context.transformerOf(value);
      if (transformer.pretransform) {
        transformer.pretransform(value, context, childPath);
      } else {
        context.recording(value, childPath);
      }
    }
  }
  transform(object, context, path) {
    return __awaiter(this, void 0, void 0, function* () {
      const result = {};
      context.recording(result, path);
      for (const key in object) {
        const childPath = path.child(key);
        const value = object[key];
        const transformer = context.transformerOf(value);
        const transformed = yield transformer.transform(value, context, childPath);
        result[key] = transformed;
      }
      return Promise.resolve(result);
    });
  }
  revive(data, context, path) {
    const result = {};
    context.recording(result, path);
    for (const key in data) {
      const value = data[key];
      const childPath = path.child(key);
      const reviver = context.reviverOf(value);
      if (!reviver) {
        result[key] = value;
        continue;
      }
      const revived = reviver.revive(value, context, childPath);
      context.recording(revived, childPath);
      result[key] = revived;
    }
    return result;
  }
}

class BlobTransformer {
  getTag() {
    return Tags.Blob;
  }
  accept(object) {
    if (typeof File === 'function' && object instanceof File) {
      return false;
    }
    return object instanceof Blob;
  }
  transform(object) {
    return object.arrayBuffer().then(buffer => {
      return {
        $: Tags.Blob,
        _: [buffer, {
          type: object.type
        }]
      };
    });
  }
  revive(data) {
    const blob = new Blob([data._[0]], data._[1]);
    return blob;
  }
}

class FileTransformer {
  getTag() {
    return Tags.File;
  }
  accept(object) {
    if (typeof File !== 'function') {
      return false;
    }
    return object instanceof File;
  }
  transform(object) {
    return object.arrayBuffer().then(buffer => {
      return {
        $: Tags.File,
        _: [buffer, object.name, {
          type: object.type
        }]
      };
    });
  }
  revive(data) {
    return new File([data._[0]], data._[1], data._[2]);
  }
}

class PrimaryTransformer {
  getTag() {
    return Tags.Primary;
  }
  accept(object) {
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
  }
  transform(object) {
    return object;
  }
  revive(data) {
    return data;
  }
}

class ArrayTransformer {
  getTag() {
    return Tags.Array;
  }
  accept(object) {
    return Array.isArray(object);
  }
  pretransform(object, context, path) {
    context.recording(object, path);
    object.forEach((it, index) => {
      if (context.isHandled(it)) {
        return;
      }
      const childPath = path.child(index + '');
      const transformer = context.transformerOf(it);
      if (transformer.pretransform) {
        transformer.pretransform(it, context, childPath);
      } else {
        context.recording(it, childPath);
      }
    });
  }
  transform(object, context, path) {
    return Promise.all(object.map((it, index) => {
      const childPath = path.child(index);
      const transformer = context.transformerOf(it);
      return transformer.transform(it, context, childPath);
    }));
  }
  revive(transformedData, context, path) {
    context.recording(transformedData, path);
    transformedData.forEach((value, index) => {
      const transformer = context.reviverOf(value);
      if (!transformer) {
        return value;
      }
      const childPath = path.child(index);
      const revivedValue = transformer.revive(value, context, childPath);
      context.recording(revivedValue, childPath);
      transformedData[index] = revivedValue;
    });
    return transformedData;
  }
}

class UndefinedTransformer {
  getTag() {
    return Tags.Undefined;
  }
  accept(object) {
    return object === undefined;
  }
  transform() {
    return {
      $: Tags.Undefined,
      _: null
    };
  }
  revive() {
    return;
  }
}

const transformers = [];
function registerTransformer(transformer) {
  if (transformers.indexOf(transformer) > -1) {
    return;
  }
  transformers.push(transformer);
}
function transformerOfObject(object) {
  const transformer = transformers.find(it => it.accept(object));
  return transformer;
}
function transformerOfTag(tag) {
  const transformer = transformers.find(it => it.getTag() === tag);
  return transformer;
}
function isTransformedObject(obj) {
  return isPlainObject(obj) && '$' in obj && '_' in obj;
}
registerTransformer(new ObjectTransformer());
registerTransformer(new ArrayTransformer());
registerTransformer(new UndefinedTransformer());
registerTransformer(new BlobTransformer());
registerTransformer(new FileTransformer());
registerTransformer(new PrimaryTransformer());
registerTransformer(new ReferenceTransformer());

class EncodeContext {
  constructor() {
    this.objectPathMap = new Map();
    this.pathObjectMap = new Map();
    this.transformerMap = new Map();
  }
  isHandled(object) {
    return this.objectPathMap.has(object);
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
    const paths = this.objectPathMap.get(object) || [];
    paths.push(path);
    this.objectPathMap.set(object, paths);
    this.pathObjectMap.set(path, object);
  }
  getObject(path) {
    return this.pathObjectMap.get(path);
  }
  getReference(object) {
    const paths = this.objectPathMap.get(object);
    if (!paths) {
      return;
    }
    return paths[0];
  }
  isReference(object) {
    return this.getReference(object) !== undefined;
  }
  transformerOf(object) {
    if (this.isReference(object)) {
      return new ReferenceTransformer();
    }
    let transformer = this.transformerMap.get(object);
    if (!transformer) {
      transformer = transformerOfObject(object);
    }
    if (!transformer) {
      throw new TypeError(`Cannot serialize value: ${object}`);
    }
    this.transformerMap.set(object, transformer);
    return transformer;
  }
}

class ReviveContext {
  constructor() {
    this.pathObjectMap = new Map();
  }
  recording(object, path) {
    this.pathObjectMap.set(path, object);
  }
  getObject(path) {
    return this.pathObjectMap.get(path);
  }
  reviverOf(object) {
    if (isTransformedObject(object) && isValidTag(object.$)) {
      return transformerOfTag(object.$);
    }
    return transformerOfObject(object);
  }
}

function serialize(object, options = {
  circular: false
}) {
  const context = new EncodeContext();
  const path = new ObjectPath([]);
  const transformer = context.transformerOf(object);
  if (options.circular) {
    if (transformer.pretransform) {
      transformer.pretransform(object, context, path);
    }
  }
  return Promise.resolve(transformer.transform(object, context, path)).then(serializable => {
    return encode(serializable);
  });
}
function deserialize(data) {
  const context = new ReviveContext();
  const object = decode(data);
  const path = new ObjectPath([]);
  const reviver = context.reviverOf(object);
  if (!reviver) {
    return object;
  }
  return reviver.revive(object, context, path);
}

export { deserialize, serialize };
//# sourceMappingURL=index.es.js.map
