export type TQuery = {
  fields: string;
  filter: object;
  limit: string;
  page: string;
  meta: string;
};

export type TPopulate = {
  path?: string;
  populate?: any;
  select?: string;
};

export const numberRegex = new RegExp(/^\d+$/);
