export type Primitive = string | number | boolean | null | undefined;

export type PlainObject = {
  [key: string]: Primitive | PlainObject | PlainObject[];
};

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type ElementProperties = Writeable<
  HTMLElementTagNameMap[keyof HTMLElementTagNameMap]
>;
