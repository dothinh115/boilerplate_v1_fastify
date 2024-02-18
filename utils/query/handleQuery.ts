import { Model } from 'mongoose';
import { handleFilter } from './handleFilter';
import { TQuery } from 'utils/model/query.model';
import { handleField } from './handleFields';

export const handleQuery = async <T>(
  model: Model<T>,
  query: TQuery,
  _id?: any,
) => {
  const { fields, filter, page, limit, meta } = query;
  let selectObj: any,
    populate: any[] = [],
    result: any[],
    filterString: object = {},
    total_count: number,
    filter_count: number,
    metaSelect: string[] = [];
  if (fields) {
    populate = handleField(fields).populate;
    selectObj = handleField(fields).select;
  }
  if (filter) filterString = handleFilter(filter);
  if (meta) metaSelect = meta.split(',').filter((meta: string) => meta !== '');

  try {
    if (_id)
      result = await model.findById(_id, { ...selectObj }).populate(populate);
    else
      result = await model
        .find({ ...filterString }, { ...selectObj })
        .populate(populate)
        .skip((+page - 1) * +limit)
        .limit(+limit)
        .lean();
    for (const meta of metaSelect) {
      if (meta === '*') {
        total_count = await model.find().countDocuments();
        filter_count = await model.find({ ...filterString }).countDocuments();
        break;
      }
      if (meta === 'total_count')
        total_count = await model.find().countDocuments();
      if (meta === 'filter_count')
        filter_count = await model.find({ ...filterString }).countDocuments();
    }
  } catch (error) {}

  const data = {
    data: result,
  };
  for (const meta of metaSelect) {
    if (meta === '*') {
      data['meta'] = {
        total_count,
        filter_count,
      };
      break;
    }
    if (meta === 'total_count') data['meta'] = { total_count };
    if (meta === 'filter_count') data['meta'] = { filter_count };
  }

  return data;
};
