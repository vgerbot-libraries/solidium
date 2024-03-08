type JSONValue = string | number | boolean | null;
export type JSONType =
    | Array<JSONValue | JSONType>
    | {
          [key: string]: JSONValue | JSONType | Array<JSONValue | JSONType>;
      };
