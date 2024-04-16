import { Op } from "sequelize";
import { objectsOfComparison } from "src/interviews/data/objectsOfComparison.constants";
import { QueryParams } from "src/interviews/dto/create-interview-query.dto";
import { FilterConditions } from "src/interviews/utils/types";


// Обновленная функция для парсинга квери параметров
export const parseQueryAndFilter = (query: QueryParams): FilterConditions => {
  let whereCondition = {};

  if (query.grade) {
    // Разделяем значения параметра по запятым
    let grades = query.grade.split(',').map(g => g.trim());
    // Создаем условие OR для каждого из значений
    whereCondition[Op.or] = grades.map(grade => ({
      grade: {
        [Op.iLike]: `%${grade}%` // используем iLike для поиска без учета регистра
      }
    }));
  }

  if (query.stage) {
    let stages = query.stage.split(',').map(s => s.trim());
    // Если условие OR уже создано, добавляем к нему новые условия
    // В противном случае создаем новое условие OR
    const stageConditions = stages.map(stage => ({
      stage: {
        [Op.iLike]: `%${stage}%`
      }
    }));

    if (whereCondition[Op.or]) {
      whereCondition[Op.or] = [...whereCondition[Op.or], ...stageConditions];
    } else {
      whereCondition[Op.or] = stageConditions;
    }
  }

  return whereCondition;
};