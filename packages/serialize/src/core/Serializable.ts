export type Serializable =
    | ArrayBuffer
    | ArrayBufferView
    | string
    | number
    | boolean
    | Serializable[]
    | {
          [key: string]: Serializable | Serializable[];
      };
