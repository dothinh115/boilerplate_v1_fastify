import { toSlug } from '../function';

const numberRegex = new RegExp(/^\d+$/);

export const handleFilter = (object: Object) => {
  let result: typeof object = {},
    filterArr: any[] = [];
  for (const key in object) {
    if (Array.isArray(object[key])) {
      for (const filter of object[key]) {
        filterArr = [...filterArr, stringToNumberObject(filter)];
      }
      result = {
        [key]: filterArr,
      };
      return result;
    }
    //trong trường hợp tìm kiếm bằng title hoặc name thì đưa về slug để tìm
    if (key === 'title' || key === 'name') {
      for (const compareKey in object[key]) {
        return {
          slug: {
            //compare key sử dụng quy tắc của mongodb, ví dụ như $eq, $in, $regex...
            [compareKey]: toSlug(object[key][compareKey]),
          },
        };
      }
    } else
      return {
        [key]: stringToNumberObject(object[key]),
      };
  }
};
//hàm đưa giá trị cuối cùng của object về thành number nếu nó thực sự là number
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
