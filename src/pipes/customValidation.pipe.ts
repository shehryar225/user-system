import {
    ArgumentMetadata,
    BadRequestException,
    Injectable,
    PipeTransform,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationsPipe implements PipeTransform {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException(this.formatErrors(errors));
        }
        return object;
    }

    private toValidate(metatype: any): boolean {
        const types = [String, Number, Boolean, Array, Object];
        return !types.includes(metatype);
    }

    private formatErrors(errors: ValidationError[]): any {
        const formattedErrors = {};
        for (const error of errors) {
            const property = error.property;
            const constraints = error.constraints;
            if (constraints) {
                formattedErrors[property] = Object.values(constraints);
            }
        }

        const errorMessage = this.createErrorMessage(formattedErrors);

        return {
            message: errorMessage,
            errors: formattedErrors,
        };
    }

    private createErrorMessage(errors: Record<string, string[]>): string {
        console.log("------------------------------------------------")
        const messages = Object.values(errors).flat();
        if (messages.length > 1) {
            return `${messages[0]} and (${messages.length - 1}) more`;
        }
        return messages[0] || 'Validation failed';
    }
}
