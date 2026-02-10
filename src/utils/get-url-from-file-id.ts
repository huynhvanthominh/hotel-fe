export const getUrlFromFileId = (fileId: string): string => {
  return `/api/image/get/${fileId}`;
}