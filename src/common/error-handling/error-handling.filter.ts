import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { ErrorHandlingService } from './error-handling.service';
import { Response } from 'express';

@Catch()
export class ErrorHandlingFilter implements ExceptionFilter {
  constructor(private readonly errorHandlingService: ErrorHandlingService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    //@ts-ignore
    const { status, message } = this.errorHandlingService.handleException(exception);

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}