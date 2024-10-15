import {ExceptionFilter,Catch,ArgumentsHost,HttpException,HttpStatus} from '@nestjs/common';
import { Response } from 'express';   
import { ValidationError } from 'class-validator';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorResponse:any = exception.getResponse();

    if (status === HttpStatus.BAD_REQUEST) {

        console.log(errorResponse)
        const formattedResponse = {
            message: errorResponse['message'] || 'Validation failed',
            errors: errorResponse['errors'] || {},
            statusCode: status,
        };
        response.status(status).json(formattedResponse);
    } else {
        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: errorResponse.url,
            message: exception.message,
        });
    }
  }

}