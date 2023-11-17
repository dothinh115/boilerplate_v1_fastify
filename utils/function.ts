export const toSlug = (text: string) =>
  text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

export const convertIdFromString = (object: object) => {
  if (typeof object !== 'object') return;
  for (const prop in object) {
    try {
      if (prop === 'id') object[prop] = Number(object[prop]);
    } catch (error) {}
    return convertIdFromString(object[prop]);
  }
};
