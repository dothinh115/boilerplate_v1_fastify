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

export function getLastValue(object: any) {
  if (typeof object !== 'object') {
    return object;
  }
  for (const prop in object) {
    return getLastValue(object[prop]);
  }
}

export function getLastKey(object: any, valueToFind: any) {
  for (const prop in object) {
    if (object[prop] == valueToFind) return prop;
    return getLastValue(object[prop]);
  }
}

const numberRegex = new RegExp(/^\d+$/);
export const handleFilter = (object: object) => {
  for (const key in object) {
    if (typeof object[key] !== 'object') {
      return {
        [key]: numberRegex.test(object[key]) ? +object[key] : object[key],
      };
    } else {
      return {
        [key]: handleFilter(object[key]),
      };
    }
  }
};

export const convertIdFromString = (object: object) => {
  if (typeof object !== 'object') return;
  for (const prop in object) {
    try {
      if (prop === 'id') object[prop] = Number(object[prop]);
    } catch (error) {}
    return convertIdFromString(object[prop]);
  }
};
