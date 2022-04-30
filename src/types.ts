export type Primitive = string | number | boolean | null | undefined;

export type PlainObject = {
  [key: string]: Primitive | PlainObject | PlainObject[];
};

export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export enum Environments {
  Development = 'development',
  Production = 'production',
}

export enum Screen {
  Intro = 'intro',
  NewSession = 'new-session',
  ShowSession = 'show-session',
}
