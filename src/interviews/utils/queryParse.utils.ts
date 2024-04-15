import { Op } from "sequelize";
import { objectsOfComparison } from "src/interviews/data/objectsOfComparison.constants";
import { QueryParams } from "src/interviews/dto/create-interview-query.dto";
import { FilterConditions } from "src/interviews/utils/types";

// Функция для обработки параметра запроса и создания условия Sequelize
const processQueryParam = (
  /** Значение для сопоставления*/
  paramValue: string,
  /** Массив для сопоставления значений и кодов-статусов*/
  mapping: Record<string, string>
): string[] => {
  if (paramValue.split(",").length === 1) {
    return [mapping[paramValue]];
  }
  return paramValue
    .split(",")
    .map((key) => mapping[key.trim()])
    .filter((value): value is string => value !== undefined);
};

// Функция для парсинга квери параметров и создания условий для запроса в базу данных
export const parseQueryAndFilter = (query: QueryParams): FilterConditions => {
  const { gradeMapping, stageMapping, statusMapping } = objectsOfComparison;
  const whereCondition: FilterConditions = {};

  // Обработка параметра status
  if (query.status) {
    whereCondition.status = {
      [Op.in]: processQueryParam(query.status, statusMapping),
    };
  }

  // Обработка параметра stage
  if (query.stage) {
    whereCondition.stage = {
      [Op.in]: processQueryParam(query.stage, stageMapping),
    };
  }

  // Обработка параметра grade
  if (query.grade) {
    whereCondition.grade = {
      [Op.in]: processQueryParam(query.grade, gradeMapping),
    };
  }
  return whereCondition;
};
