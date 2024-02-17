import { TPopulate } from 'utils/model/query.model';

export const handleField = (fields: string) => {
  let fieldHandle: any = {},
    selectObj: any,
    fieldSplit: any[] = [];

  if (fields) {
    const fieldArr = fields.split(',').filter((item: string) => item !== '');

    for (const field of fieldArr) {
      if (field.includes('.')) {
        const nestedFieldArr = field
          .split('.')
          .filter((item: string) => item !== '');
        selectObj = {
          ...selectObj,
          [nestedFieldArr[0]]: 1,
        };
        const removeLastEl = nestedFieldArr.slice(0, -1).join('.');
        const lastEl = nestedFieldArr.slice(-1).join();
        if (!fieldHandle[removeLastEl])
          fieldHandle = {
            ...fieldHandle,
            [removeLastEl]: lastEl,
          };
        else {
          if (!fieldHandle[removeLastEl].includes('*'))
            fieldHandle[removeLastEl] =
              fieldHandle[removeLastEl] + ' ' + lastEl;
        }
      } else
        selectObj = {
          ...selectObj,
          [field]: 1,
        };
    }

    for (const [key, value] of Object.entries(fieldHandle)) {
      const keySplit = key.split('.').filter((item: string) => item !== '');
      let populateObj: TPopulate;
      if (keySplit.length > 1) {
        populateObj = keySplit.reduceRight(
          (prev: TPopulate, cur: string, index) => {
            return {
              path: cur,
              ...(index + 1 === keySplit.length
                ? {
                    ...(value !== '*' && {
                      select: value as string,
                    }),
                  }
                : { populate: prev }),
            };
          },
          { populate: {} },
        );
      } else {
        populateObj = {
          path: key,
          ...(value !== '*' && {
            select: value as string,
          }),
        };
      }

      let exist = false;
      //kiểm tra path đã tồn tại trong mảng chưa, nếu rồi thì phải merge các object cùng path với nhau
      for (let index in fieldSplit) {
        if (fieldSplit[index]['path'] === populateObj['path']) {
          const merge = {
            ...fieldSplit[index],
            ...populateObj,
          };
          fieldSplit[index] = merge;
          exist = true; //nếu đã có path tồn tại thì ko thêm mới vào mảng nữa
          break;
        }
      }
      //trong trường hợp có path mới thì thêm vào mảng
      if (!exist) fieldSplit = [...fieldSplit, populateObj];
    }
    for (const field of fieldArr) {
      if (field === '*') {
        selectObj = undefined;
        break;
      }
    }

    for (const item of fieldSplit) {
      if (item['select']?.includes('*')) delete item['select'];
    }
  }
  return {
    populate: fieldSplit,
    select: selectObj,
  };
};
