export type Serializable = null | ArrayBuffer | ArrayBufferView | string | number | boolean | Serializable[] | {
    [key: string]: Serializable | Serializable[];
};
