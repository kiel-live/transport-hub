import dayjs from 'dayjs';

export const truncate = (str: string, length = 30) => (str.length > length ? `${str.substring(0, length)} ...` : str);

export const formatDateTime = (date: Date | string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss');
