import { faker } from "@faker-js/faker";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/sequelize";
import {
  GradeEnum,
  StageEnum,
  StatusEnum,
} from "src/interviews/data/objectsOfComparison.constants";
import { Interview } from "src/interviews/interviews.model";
import { InterviewsService } from "src/interviews/interviews.service";

export const createMockInterviewDto = (
  overrides: Partial<Interview> = {}
): Interview => {
  return {
    id: faker.number.int(),
    companyName: faker.company.name(),
    articleTitle: faker.lorem.words(3),
    articleDescription: faker.lorem.sentences(2),
    status: [faker.helpers.arrayElement(Object.values(StatusEnum))],
    grade: [faker.helpers.arrayElement(Object.values(GradeEnum))],
    stage: [faker.helpers.arrayElement(Object.values(StageEnum))],
    nickName: faker.internet.userName(),
    maxoffer: faker.number.int({ min: 50000, max: 200000 }),
    minoffer: faker.number.int({ min: 30000, max: 50000 }),
    prefix: faker.helpers.arrayElement(["от", "до", null]),
    ...overrides, // Позволяет переопределить генерируемые значения или добавить новые
  } as Interview; // используем приведение типов, чтобы убрать обязательные методы модели из секвалайз
};
// для использования в другим местах
export interface MockInterviewRepositoryType {
  create: jest.Mock;
  findAndCountAll: jest.Mock;
}

export const mockJwtService = {
  provide: JwtService,
  useValue: {
    verify: jest.fn().mockReturnValue({
      id: 1,
      email: "test@example.com",
      nickName: "Новый никнейм",
    }),
  },
};

export const mockInterviewRepository = {
  provide: getModelToken(Interview),
  useValue: {
    create: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        ...dto,
        nickName: "Новый никнейм",
        prefix: null,
      })
    ),
    findAndCountAll: jest.fn().mockImplementation(() => ({
      rows: [],
      count: 0,
    })),
  },
};

// Экспорт списка общих провайдеров для удобства
export const commonProviders = [
  InterviewsService,
  mockJwtService,
  mockInterviewRepository,
];
