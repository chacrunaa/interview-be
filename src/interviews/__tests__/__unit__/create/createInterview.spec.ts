import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/sequelize";
import { TestingModule } from "@nestjs/testing";
import { initializeTestModule } from "src/__tests__/testSetup";
import {
  MockInterviewRepositoryType,
  commonProviders,
} from "src/interviews/__tests__/testMocks";
import {
  GradeEnum,
  StageEnum,
  StatusEnum,
} from "src/interviews/data/objectsOfComparison.constants";
import { Interview } from "src/interviews/interviews.model";
import { InterviewsService } from "src/interviews/interviews.service";

describe("InterviewsService - Create Interviews", () => {
  let service: InterviewsService;
  let jwtService: JwtService;
  let mockInterviewRepository: MockInterviewRepositoryType;
  beforeEach(async () => {
    const module: TestingModule = await initializeTestModule(commonProviders);
    service = module.get<InterviewsService>(InterviewsService);
    jwtService = module.get<JwtService>(JwtService);
    mockInterviewRepository = module.get(getModelToken(Interview));
  });
  /**
   *  Проверка на успешное создание объекта/элемента.
   * Это базовый тест, который проверяет что основная функция с правильными данными работает
   * Тест будет расширяться по мере возврастания логики перед отправкой данных на сервер методом create
   */
  it("Метод create создается и возвращает ожидаемый результат при правильных данных", async () => {
    const dto = {
      companyName: "Новая компания",
      articleTitle: "Новое интервью",
      articleDescription: "Прошло хорошо",
      status: [StatusEnum.failure],
      grade: [GradeEnum.junior, GradeEnum.middle],
      stage: [StageEnum.conversation, StageEnum.techpart],
      maxoffer: 120000,
      minoffer: 90000,
    };
    const token = "mockToken";
    const result = await service.create(dto, token);

    expect(jwtService.verify).toHaveBeenCalledWith(token);
    expect(mockInterviewRepository.create).toHaveBeenCalledWith({
      ...dto,
      nickName: "Новый никнейм",
      prefix: null,
    });
    expect(result).toEqual({
      ...dto,
      nickName: "Новый никнейм",
      prefix: null,
    });
  });
  /**
   * Тест на проверку правильности возврата ошибки. 
   * В нём мы указываем какую ошибку ожидаем в mockRejectedValue
   * И как эту ошибку должен обработать метод. 
   * Если вместо ожидаемой обработки ошибки мы получаем другую - значит неверно настроен
   * отлов внутри метода или тест. 
   * 
   * Пример когда тест падает:   
    expect(received).rejects.toThrow(expected)
    Expected substring: "Ожидаемое сообщение об ошибке"
    Received message:   "s is not defined"
   */
  it("Правльный возврат ошибки из метода сервиса", async () => {
    const dto = {
      companyName: "Новая компания",
      articleTitle: "Новое интервью",
      articleDescription: "Прошло хорошо",
      status: [StatusEnum.failure],
      grade: [GradeEnum.junior, GradeEnum.middle],
      stage: [StageEnum.conversation, StageEnum.techpart],
      maxoffer: 120000,
      minoffer: 90000,
    };
    const token = "mockToken";
    mockInterviewRepository.create.mockRejectedValue(
      new Error("Ожидаемое сообщение об ошибке")
    );
    await expect(service.create(dto, token)).rejects.toThrow("Ожидаемое сообщение об ошибке");
  });
});
