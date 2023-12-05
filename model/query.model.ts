export type TQuery = {
  fields: string;
  filter: object;
  limit: string;
  page: string;
  meta: {
    total_count: boolean;
    filter_count: boolean;
  };
};
