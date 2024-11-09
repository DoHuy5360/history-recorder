export const addZeroFormat = <T extends number>(arg: T) => (arg < 10 ? `0${arg}` : arg);
