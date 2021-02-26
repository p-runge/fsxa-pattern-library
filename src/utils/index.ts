export const isClient = () => typeof window !== "undefined";

export const importTPPSnapAPI = (version: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    // We will wait for tpp to load until we resolve this promise
    script.onload = () => {
      resolve();
    };
    script.onerror = () => {
      reject();
    };
    script.src = `https://cdn.jsdelivr.net/npm/fs-tpp-api@${version}/snap.js`;
    document.head.appendChild(script);
  });
};

export const getTPPSnap = (): any | null => {
  return (window && (window as any).TPP_SNAP) || null;
};
