export class ResponseDto<T> {
  statusCode: number;
  message: string;
  data: T | Partial<T> | Partial<T>[];

  constructor(statusCode: number, message: string, data: T | Partial<T> | Partial<T>[]) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
}

