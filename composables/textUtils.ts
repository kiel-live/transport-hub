export const truncate = (str: string, length = 30) => (str.length > length ? `${str.substring(0, length)} ...` : str);
