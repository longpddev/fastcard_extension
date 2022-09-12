import MD5 from "crypto-js/md5";

declare global {
  interface Window {
    nearest: any;
  }
}

export const nearest = (arr: Array<number>) => (val: number) => {
  let distant: any = undefined;
  let position: number = 0;
  arr.forEach((item, index) => {
    const space = Math.abs(item - val);

    if (space < distant || distant === undefined) {
      distant = space;
      position = index;
    }
  });

  return arr[position];
};

export const isValidUrl = (url: string) => {
  const urlRegex =
    /^(blob:)?((http(s?)?):\/\/)?([wW]{3}\.)?[a-zA-Z0-9\-.]+\.?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?.*$/g;
  const result = url.match(urlRegex);

  return result !== null;
};

export const encodePassword = (password: string) => MD5(password).toString();

export class Maybe {
  data: Array<any>;
  constructor(value: Maybe | any) {
    let result = value;
    if (value instanceof Maybe) result = value.get();
    if (!Array.isArray(result)) result = [result];
    console.log(result);
    this.data = result;
  }
  isNotNil() {
    return (
      this.data !== undefined && this.data !== null && this.data.length > 0
    );
  }

  get() {
    return this.data.length === 1 ? this.data[0] : this.data;
  }

  map(cb: (i: any, index?: number) => any) {
    if (this.data.length === 1) return new Maybe(cb(this.get(), 0));
    return new Maybe(this.data.map(cb));
  }

  run(cb: (i: any) => any) {
    this.map(cb);
    return this;
  }
}

export function getSelect() {
  return window.getSelection();
}
