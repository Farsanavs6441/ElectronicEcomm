// Web API type declarations for React Native Web
declare global {
  interface Window {
    innerWidth: number;
    innerHeight: number;
    addEventListener: (type: string, listener: () => void) => void;
    removeEventListener: (type: string, listener: () => void) => void;
  }

  interface Storage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
  }

  const window: Window;
  const localStorage: Storage;
}

export {};
