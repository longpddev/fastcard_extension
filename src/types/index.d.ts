export {};

declare global {
  interface Window {
    appSettings: any;
    appContext: any;
    getStorageValue: (n: string, n1?: any) => any;
    setStorageValue: (n: string, n1?: any) => void;
  }
}
