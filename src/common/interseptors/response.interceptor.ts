import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomResponse } from 'src/common/interseptors/types';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (this.isCustomResponse(data)) {
          return {
            statusCode: data.statusCode,
            message: data.message,
            data: data.data
          };
        }
        return {
            statusCode: 200,
            message: '',
            data,
        }; 
      })
    );
  }

  private isCustomResponse(data: any): data is CustomResponse<any> {
    return data && 'statusCode' in data && 'message' in data && 'data' in data;
  }
}