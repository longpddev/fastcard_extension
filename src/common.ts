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
