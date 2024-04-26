import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/sequelize";
import { Interview } from "src/interviews/interviews.model";
import { InterviewsService } from "src/interviews/interviews.service";

// для использования в другим местах
export interface MockInterviewRepositoryType {
    create: jest.Mock;
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
        create: jest.fn().mockImplementation(dto => Promise.resolve({
            ...dto,
            nickName: "Новый никнейм", 
            prefix: null
        })),
    },
};

// Экспорт списка общих провайдеров для удобства
export const commonProviders = [
    InterviewsService,
    mockJwtService,
    mockInterviewRepository,
];