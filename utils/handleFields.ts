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

export const handleNestedPopulate = (object: any, nestedFieldArr: string[]) => {
  return {
    ...(object && {
      path: object.path,
      ...(object.path === nestedFieldArr[nestedFieldArr.length - 2]
        ? {
            ...(nestedFieldArr.slice(-1)[0] !== '*' && {
              select: nestedFieldArr.slice(-1)[0],
            }),
          }
        : { populate: handleNestedPopulate(object?.populate, nestedFieldArr) }),
    }),
  };
};

export const getLastValue = (object: any) => {
  for (const key in object) {
    if (object.select) {
      return object.select;
    }
    return getLastValue(object.populate);
  }
};

export const handleMergeObject = (object: any, last: string) => {
  for (const key in object) {
    if (object.select) {
      return {
        path: object.path,
        select: object.select + ' ' + last,
      };
    }
    return {
      path: object.path,
      populate: handleMergeObject(object.populate, last),
    };
  }
};
