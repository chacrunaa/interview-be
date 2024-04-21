import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

/**
 * Валидатор проверяет присутствие в строке хотя бы одного значения из enum
 */
@ValidatorConstraint({ async: true })
class IsInEnumConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [allowedValues] = args.constraints;
    let items: string[];

    // Поддержка как строки с разделителями, так и массива значений
    if (Array.isArray(value)) {
      items = value;
    } else if (typeof value === 'string') {
      items = value.split(",").map(item => item.trim());
    } else {
      return false; // Неподдерживаемый тип данных
    }

    return items.every(item => allowedValues.includes(item));
  }

  defaultMessage(args: ValidationArguments) {
    const [allowedValues] = args.constraints;
    return `Ошибка валидации - значения могут быть следующими: ${allowedValues.join(", ")}.`;
  }
}

export function IsInEnum(allowedValues: any[], validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [allowedValues],
      validator: IsInEnumConstraint,
    });
  };
}
