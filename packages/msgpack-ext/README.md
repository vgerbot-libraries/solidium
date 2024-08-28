# `@vgerbot/msgpack-ext`

`@vgerbot/msgpack-ext` is an extended version of @msgpack/msgpack library, providing enhanced serialization and deserialization capabilities with support for additional data types and circular references.

## Features

- **Extended Data Type Support**: Serialize and deserialize more complex data structurs seamlessly.
- **Circular Reference Handling**: Seamlessly manage objects with circular references without the fear of infinite loops or data corruption.

## Installation

You can install `@vgerbot/msgpack-ext` via npm:

```bash
npm install @vgerbot/msgpack-ext
```

## Usage

Here’s a quick example to get you started:

```js
const { encode, decode } = require('@vgerbot/msgpack-ext');

const data = {
  name: "example",
  numbers: [1, 2, 3],
  circular: null
};

// Handling circular references
data.circular = data;

const encoded = encode(data);
const decoded = decode(encoded);

console.log(decoded);
```

## License

This project is licensed under the [MIT License](../../LICENSE). See the LICENSE file for more details.
