export const isClient = () => typeof window !== "undefined";

export const getTPPSnap = (): any | null => {
  return (window && (window as any).TPP_SNAP) || null;
};

export const importTPPSnapAPI = async (
  version: string,
): Promise<any | null> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    // We will wait for tpp to load until we resolve this promise
    script.onload = () => {
      resolve(getTPPSnap());
    };
    script.onerror = () => {
      reject();
    };
    script.src = `https://cdn.jsdelivr.net/npm/fs-tpp-api@${version}/snap.js`;
    document.head.appendChild(script);
  });
};
