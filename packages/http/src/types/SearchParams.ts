export type SearchParams =
    | URLSearchParams
    | Record<
          string,
          string | number | boolean | Array<string | number | boolean>
      >;
