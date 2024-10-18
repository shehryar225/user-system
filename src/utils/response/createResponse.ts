import { HttpStatus } from "@nestjs/common";
import { ApiResponseOptions } from "@nestjs/swagger";

// export function createApiResponse(
//     statusCode: number,
//     message: any,
//     Data?: any,
//   ): ApiResponseOptions {
//     return {
//       status: statusCode,
//       description: message,
//       content: {
//         'application/json': {
//           schema: {
//             example: {
//               statusCode: statusCode,
//               message: message,
//               data: Data || null,
//             },
//           },
//         },
//       },
//     };
//   };


export function createApiResponse(
  statusCode: HttpStatus,
  message: string | Record<string, string[]>,
): ApiResponseOptions {
  let responseMessage = "Request failed.";
  let errors = null;

  if (typeof message === 'string') {
    responseMessage = message; 
  } else {
  
    const errorCount = Object.keys(message).length;
    const firstErrorMessage = Object.values(message)[0][0];
    responseMessage = `${firstErrorMessage} and (${errorCount - 1}) more`;
    errors = message;
  }

  return {
    status: statusCode,
    description: responseMessage,
    content: {
      'application/json': {
        schema: {
          example: {
            message: responseMessage,
            errors: errors,
            statusCode: statusCode,
          },
        },
      },
    },
  };
}