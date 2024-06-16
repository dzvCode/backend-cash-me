import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message?: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        let statusCode = data.statusCode; // Check if statusCode is provided in data object

        // If statusCode is not provided in data object, get it from context
        if (!statusCode) {
          const response = context.switchToHttp().getResponse();
          statusCode = response.statusCode;
        }    

        const message = this.reflector.get<string>('response_message', context.getHandler()) || data.message;
        
        const responseData: Response<T> = {
          statusCode: statusCode || HttpStatus.OK,
          data: data.result || null,
        };

        if (message) {
          responseData.message = message;
        }

        return responseData;
      }),
    );
  }
}
