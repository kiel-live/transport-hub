import parseTime from 'gtfs-utils/parse-time.js';

type GenericValue = string | number | boolean | null | undefined;
type GenericObject<T = GenericValue> = { [key: string]: T };
type MakeDataProviders<T extends GenericObject> = {
  _data: T;
  _required: boolean;
  _value: string | number | null | undefined | { latitude: number; longitude: number } | boolean | Date;
};
type Replace<T, K extends keyof T, V> = Omit<T, K> & { [P in K]: V };

export class DataProvider<U extends GenericObject, T extends MakeDataProviders<U> = MakeDataProviders<U>> {
  private _data: T['_data'];
  private _required: T['_required'];
  private _value: T['_value'];
  private _key: string | null;

  private constructor({
    _data,
    _required,
    _value,
    _key,
  }: {
    _data: T['_data'];
    _required: T['_required'];
    _value: T['_value'];
    _key: string | null;
  }) {
    this._data = _data;
    this._required = _required;
    this._value = _value;
    this._key = _key;
  }

  static create<U extends GenericObject, T extends MakeDataProviders<U>>(_data: U): DataProvider<U, T> {
    return new DataProvider({
      _data,
      _required: false,
      _value: null,
      _key: null,
    });
  }

  string(key: keyof U): DataProvider<U, Replace<T, '_value', string>> {
    return new DataProvider<U, Replace<T, '_value', string>>({
      ...this,
      _key: key,
      _value: this._data[key],
    });
  }

  prefix(prefix: string): DataProvider<U, T> {
    return new DataProvider<U, T>({
      ...this,
      _value: this._value ? `${prefix}${this._value}` : null,
    });
  }

  integer(key: keyof U): DataProvider<U, Replace<T, '_value', number>> {
    const rawValue = this._data[key] ?? null;
    let value: null | number = null;
    if (rawValue !== null && typeof rawValue === 'string' && rawValue.length > 0) {
      value = parseInt(rawValue);
    } else if (rawValue !== null && typeof rawValue === 'number') {
      value = rawValue;
    }
    return new DataProvider<U, Replace<T, '_value', number>>({
      ...this,
      _key: key,
      _value: value,
    });
  }

  float(key: keyof U): DataProvider<U, Replace<T, '_value', number>> {
    const rawValue = this._data[key] ?? null;
    let value: null | number = null;
    if (rawValue !== null && typeof rawValue === 'string' && rawValue.length > 0) {
      value = parseFloat(rawValue);
    } else if (rawValue !== null && typeof rawValue === 'number') {
      value = rawValue;
    }
    return new DataProvider<U, Replace<T, '_value', number>>({
      ...this,
      _key: key,
      _value: value,
    });
  }

  time(key: keyof U): DataProvider<U, Replace<T, '_value', string>> {
    const value = this._data[key] ?? null;
    let time: string | null = null;
    if (value !== null && typeof value === 'string') {
      const { hours: h, minutes: m, seconds: s } = parseTime(value);
      time = `${h} hours ${m} minutes ${s === null ? 0 : s} seconds`;
    }
    return new DataProvider<U, Replace<T, '_value', string>>({
      ...this,
      _key: key,
      _value: time,
    });
  }

  point(
    lonKey: keyof U,
    latKey: keyof U,
  ): DataProvider<U, Replace<T, '_value', { latitude: number; longitude: number }>> {
    const lon = this.float(lonKey).get();
    const lat = this.float(latKey).get();
    let value: { latitude: number; longitude: number } | null = null;
    if (lon && lat) {
      value = {
        latitude: lat,
        longitude: lon,
      };
    }
    return new DataProvider<U, Replace<T, '_value', { latitude: number; longitude: number }>>({
      ...this,
      _key: `${lonKey.toString()},${latKey.toString()}`,
      _value: value,
    });
  }

  boolean(key: keyof U): DataProvider<U, Replace<T, '_value', boolean>> {
    const value = this._data[key];
    return new DataProvider<U, Replace<T, '_value', boolean>>({
      ...this,
      _key: key,
      _value: value === 'true',
    });
  }

  date(
    key: keyof U,
    options: { timestampUnit: 'ms' | 's' } = { timestampUnit: 's' },
  ): DataProvider<U, Replace<T, '_value', Date>> {
    const value = this._data[key] ?? null;
    let date: Date | null = null;
    if (value !== null && typeof value === 'string') {
      date = new Date(value);
    } else if (typeof value === 'number') {
      date = new Date(value * (options?.timestampUnit === 's' ? 1000 : 1));
    }
    return new DataProvider<U, Replace<T, '_value', Date>>({
      ...this,
      _key: key,
      _value: date,
    });
  }

  required(): DataProvider<U, Replace<T, '_required', true>> {
    return new DataProvider<U, Replace<T, '_required', true>>({
      ...this,
      _required: true,
    });
  }

  get(): T['_required'] extends true ? T['_value'] : T['_value'] | null {
    const value = this._value ?? null;

    if (this._required && value === null) {
      throw new Error(`Required value is missing for key ${this._key} (data: ${JSON.stringify(this._data)})`);
    }

    return value;
  }
}
