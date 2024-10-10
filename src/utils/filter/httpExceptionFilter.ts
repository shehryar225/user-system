import {ExceptionFilter,Catch,ArgumentsHost,HttpException,HttpStatus} from '@nestjs/common';
import { Response } from 'express';   

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

        // Determine if the error response is a string or an object
        const message = typeof errorResponse === 'string'
        ? errorResponse
        : (errorResponse as any).message || 'Unexpected error occurred';

        // Return a formatted error response
        response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message,
        });
  }
}