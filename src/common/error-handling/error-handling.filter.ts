import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Injectable, Logger } from '@nestjs/common';
import { ErrorHandlingService } from './error-handling.service';
import { Response } from 'express';


@Catch()
@Injectable()
export class ErrorHandlingFilter implements ExceptionFilter {
  constructor(private readonly errorHandlingService: ErrorHandlingService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Проверяем, является ли исключение экземпляром HttpException
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception instanceof HttpException ? exception.getResponse() : 'Ошибка обработки данных';

    response.status(status).json({
      statusCode: status,
      message: message,
    });

    // Логируем ошибку для отладки
    console.error(exception);
  }
}