import { PlainObject, Primitive } from './types';

// See https://github.com/microsoft/TypeScript/pull/12253#issuecomment-353494273
export const keys = Object.keys as <T>(o: T) => (keyof T)[];

// See https://stackoverflow.com/a/44078785/659910
export const uuid = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

export const objectIsHtmlElement = (object: unknown): object is HTMLElement =>
  !!(object as HTMLElement).tagName;

export const objectIsHtmlInputElement = (
  object: unknown
): object is HTMLInputElement => !!(object as HTMLInputElement).type;

export const formatDuration = (ms: number) => {
  let seconds = ms / 1000;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);

  seconds = Math.round(seconds - hours * 3600 - minutes * 60);

  const hoursFormatted = hours < 10 ? `0${hours}` : hours.toString();
  const minutesFormatted = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsFormatted = seconds < 10 ? `0${seconds}` : seconds.toString();

  return `${hoursFormatted}:${minutesFormatted}:${secondsFormatted}`;
};

export const isPlainObject = (object: unknown): object is PlainObject =>
  typeof object === 'object' && !Array.isArray(object);

export const objectSet = (
  object: PlainObject,
  key: string,
  value: Primitive
) => {
  if (!key) {
    return;
  }

  const subKeys = key.split('.');
  const lastKey = subKeys.pop();

  if (!lastKey) {
    return;
  }

  for (const key of subKeys) {
    const next = object[key];
    if (!isPlainObject(next)) {
      return;
    }

    object = next;
  }

  object[lastKey] = value;
};

export const capitalize = (str: string) =>
  `${str[0].toUpperCase()}${str.slice(1)}`;

export const isCapitalized = (str: string) => str[0].toUpperCase() === str[0];
