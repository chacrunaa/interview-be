import { Op } from "sequelize";
import { QueryParams } from "src/interviews/dto/get-interview.dto";
export const parseQueryAndFilter = (query: QueryParams, enums: any): any => {
  const whereCondition: any = {};

  // Функция для проверки и фильтрации значений по enum
  const filterValidEnums = (values: string | string[], enumType: any): string[] => {
    const enumValues = Object.values(enumType);
    if (typeof values === 'string') {
      values = values.split(',').map(value => value.trim());
    }
    return values.filter(value => enumValues.includes(value));
  };

  // Автоматически обрабатываем все поля в query, для которых определены enum значения в enums
  Object.keys(query).forEach(field => {
    if (query[field] && enums[field]) {
      const validValues = filterValidEnums(query[field], enums[field]);
      if (validValues.length > 0) {
        whereCondition[field] = { [Op.contains]: validValues };
      }
    }
  });

  return whereCondition;
};