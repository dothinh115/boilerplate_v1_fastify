export const failResponse = (message: string, statusCode: number = 400) => ({
  statusCode,
  message,
});

export const successResponse = (
  data: object = {},
  statusCode: number = 200,
) => ({
  statusCode,
  ...data,
});
