import { ApiResponse } from "src/interfaces/apiReponse.interface";

export function createResponse<T>(data:T,message:string,statusCode:number,token?:string):ApiResponse<T> {

    return {
        message,
        data,
        statusCode,
        token
      };
}