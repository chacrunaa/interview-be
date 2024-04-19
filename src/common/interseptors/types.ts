export interface CustomResponse<T> {
    data: T;
    message: string;
    statusCode: number;
  }