export const blobToBase64 = async (
  blob: Blob
): Promise<string | ArrayBuffer | null> => {
  const reader = new FileReader();

  reader.readAsDataURL(blob);

  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });
};
