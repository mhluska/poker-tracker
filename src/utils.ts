// See https://stackoverflow.com/a/44078785/659910
export const uuid = () =>
  Date.now().toString(36) + Math.random().toString(36).substring(2);

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

export const capitalize = (str: string) =>
  `${str[0].toUpperCase()}${str.slice(1)}`;

// Works like `Date#toISOString()` but includes the client timezone.
// See https://stackoverflow.com/a/17415677/659910
export const toISOString = (date: Date) => {
  const tzo = -date.getTimezoneOffset();
  const dif = tzo >= 0 ? '+' : '-';
  const pad = (num: number) => (num < 10 ? '0' : '') + num;

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes()) +
    ':' +
    pad(date.getSeconds()) +
    dif +
    pad(Math.floor(Math.abs(tzo) / 60)) +
    ':' +
    pad(Math.abs(tzo) % 60)
  );
};
