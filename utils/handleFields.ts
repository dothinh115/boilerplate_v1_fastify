import { Model } from 'mongoose';
import { handleFilter } from './handleFilter';
import { TQuery } from 'model/query.model';

type TPopulate = {
  path?: string;
  populate?: any;
  select?: string;
};
export const handleQuery = async <T>(model: Model<T>, query: TQuery) => {
  const { fields, filter, page, limit } = query;
  let fieldHandle: any = {},
    selectObj: any,
    fieldSplit: any[] = [],
    result: any[],
    filterString: Object = {},
    total_count: number,
    filter_count: number;
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
      fieldSplit = [...fieldSplit, populateObj];
    }
    // for (const index in fieldSplit) {
    //   const filterfieldSplit = fieldSplit.filter(
    //     (item: { path: string }) => item.path === fieldSplit[index]?.path,
    //   );
    //   if (filterfieldSplit.length > 1) {
    //     const newObj = {
    //       ...fieldSplit[index],
    //       ...filterfieldSplit[1],
    //     };
    //     fieldSplit = [
    //       ...fieldSplit.filter(
    //         (item: { path: string }) => item.path !== fieldSplit[index].path,
    //       ),
    //       { ...newObj },
    //     ];
    //   }
    // }
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

  if (filter) {
    filterString = handleFilter(filter);
  }

  try {
    result = await model
      .find({ ...filterString }, { ...selectObj })
      .populate(fieldSplit)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .lean();
    total_count = await model.find().count();
    filter_count = await model.find({ ...filterString }).count();
  } catch (error) {}

  return { data: result, meta: { total_count, filter_count } };
};
