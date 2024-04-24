export const getImageThumbnail = (src: string) => {
  if (!src) {
    return;
  }
  const split = src.split('?');
  return `${split[0]}_200x200?${split[1]}`;
};
