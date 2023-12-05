const numberRegex = new RegExp(/^\d+$/);

export const handleFilter = (object: Object) => {
  let result: typeof object = {};
  for (const key in object) {
    result[key] = stringToNumberObject(object[key]);
  }
  return result;
};

const stringToNumberObject = (value: Object | string) => {
  if (typeof value === 'string') {
    return +value;
  }
  for (const key in value) {
    if (typeof value[key] !== 'object') {
      return {
        [key]: numberRegex.test(value[key]) ? +value[key] : value[key],
      };
    }
    return {
      [key]: stringToNumberObject(value[key]),
    };
  }
};
