import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  failResponse(data: any, statusCode = 400) {
    return {
      statusCode,
      ...(typeof data === 'string'
        ? {
            message: data,
          }
        : data),
    };
  }

  successResponse(data: any, statusCode = 200) {
    return {
      statusCode,
      ...(typeof data === 'string'
        ? {
            message: data,
          }
        : data),
    };
  }
}
