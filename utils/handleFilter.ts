const numberRegex = new RegExp(/^\d+$/);

export const handleFilter = (object: object) => {
  for (const key in object) {
    if (typeof object[key] !== 'object') {
      return {
        [key]: numberRegex.test(object[key]) ? +object[key] : object[key],
      };
    }
    return {
      [key]: handleFilter(object[key]),
    };
  }
};
