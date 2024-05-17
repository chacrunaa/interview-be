import { getModelToken } from "@nestjs/sequelize";
import { TestingModule } from "@nestjs/testing";
import { initializeTestModule } from "src/__tests__/testSetup";
import {
  MockInterviewRepositoryType,
  commonProviders,
  createMockInterviewDto,
} from "src/interviews/__tests__/testMocks";
import { Interview } from "src/interviews/interviews.model";
import { InterviewsService } from "src/interviews/interviews.service";

describe("InterviewsService - Pagination", () => {
  let service: InterviewsService;
  let mockInterviewRepository: MockInterviewRepositoryType;

  beforeEach(async () => {
    const module: TestingModule = await initializeTestModule(commonProviders);
    service = module.get<InterviewsService>(InterviewsService);
    mockInterviewRepository = module.get(getModelToken(Interview));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Подготовка моков
  const expectedRows = Array(50)
    .fill({})
    .map(() => createMockInterviewDto());
  const expectedTotal = expectedRows.length;
  /**
   * --------------------------------------------------------------------------------------------------------
   * Базовые тесты на работу сервиса в целом + пагинация.
   * Для пагинации обязательно делать некорректные значения
   *
   * Шаблон тестирования пагинации желательно вынести куда-нибудь
   * */
  it("применяет пагинацию по умолчанию, когда параметры запроса не предоставлены", async () => {
    mockInterviewRepository.findAndCountAll.mockResolvedValue({
      rows: expectedRows.slice(0, 5), // Эмуляция возвращения первой страницы
      count: expectedTotal,
    });

    // Вызов тестируемого метода
    const result = await service.getInterviews({});

    // Проверки результата
    expect(result.total).toEqual(expectedTotal);
    expect(result.totalPages).toEqual(Math.ceil(expectedTotal / 5));
    expect(result.currentPage).toBe(1);
    expect(result.pageSize).toBe(5);
    expect(result.interviews).toHaveLength(5);

    // Проверка аргументов, переданных в findAndCountAll
    expect(mockInterviewRepository.findAndCountAll).toHaveBeenCalledWith({
      where: {}, // Нет фильтров
      limit: 5, // Пагинация по умолчанию, 5 элементов на страницу
      offset: 0, // Пагинация по умолчанию, начинаем с первой страницы
    });
  });

  it("применяет пользовательскую пагинацию, когда предоставлены параметры запроса", async () => {
    const customPageSize = 2;
    const customPageNumber = 3;
    mockInterviewRepository.findAndCountAll.mockResolvedValue({
      rows: expectedRows,
      count: expectedTotal,
    });

    // Вызов тестируемого метода с пользовательскими параметрами пагинации
    const result = await service.getInterviews({
      pageSize: customPageSize,
      page: customPageNumber,
    });

    // Проверки результата
    expect(result.total).toEqual(expectedTotal);
    expect(result.totalPages).toEqual(
      Math.ceil(expectedTotal / customPageSize)
    );
    expect(result.currentPage).toBe(customPageNumber);
    expect(result.pageSize).toBe(customPageSize);
    expect(result.interviews).toHaveLength(expectedRows.length);

    // Проверка аргументов, переданных в findAndCountAll
    expect(mockInterviewRepository.findAndCountAll).toHaveBeenCalledWith({
      where: {},
      limit: customPageSize,
      offset: customPageSize * (customPageNumber - 1),
    });
  });

  it("обрабатывает некорректные параметры пагинации", async () => {
    // Подготовка моков для некорректных параметров
    const expectedRows = [];
    const expectedTotal = 0;
    mockInterviewRepository.findAndCountAll.mockResolvedValue({
      rows: expectedRows,
      count: expectedTotal,
    });

    // Вызов тестируемого метода с некорректными параметрами
    const result = await service.getInterviews({
      pageSize: 0,
      page: -1,
    });

    // Проверки результата
    expect(result.total).toEqual(expectedTotal);
    expect(result.totalPages).toBe(0);
    expect(result.currentPage).toBe(1);
    expect(result.pageSize).toBe(5);
    expect(result.interviews).toHaveLength(0);

    // Проверка аргументов, переданных в findAndCountAll
    expect(mockInterviewRepository.findAndCountAll).toHaveBeenCalledWith({
      where: {},
      limit: 5, // Возвращаемся к значению по умолчанию
      offset: 0, // Возвращаемся к значению по умолчанию
    });
  });

  test.each`
    pageSize | page  | total | expectedTotalPages | expectedError | description
    ${5}     | ${1}  | ${10} | ${2}               | ${null}       | ${"Корректный расчет: 10 записей, pageSize = 5, ожидается 2 страницы"}
    ${10}    | ${2}  | ${20} | ${2}               | ${null}       | ${"Корректный расчет: 20 записей, pageSize = 10, ожидается 2 страницы"}
    ${20}    | ${1}  | ${50} | ${3}               | ${null}       | ${"Корректный расчет: 50 записей, pageSize = 20, ожидается 3 страницы"}
    ${5}     | ${1}  | ${0}  | ${0}               | ${null}       | ${"Корректный расчет: 0 записей, pageSize = 5, ожидается 0 страниц"}
    ${5}     | ${10} | ${10} | ${2}               | ${null}       | ${"Корректный расчет: 10 записей, pageSize = 5, page = 10, ожидается 2 страницы"}
    ${5}     | ${1}  | ${5}  | ${1}               | ${null}       | ${"Корректный расчет: 5 записей, pageSize = 5, ожидается 1 страница"}
    ${5}     | ${2}  | ${5}  | ${1}               | ${null}       | ${"Корректный расчет: 5 записей, pageSize = 5, page = 2, ожидается 1 страница"}
    ${5}     | ${3}  | ${5}  | ${1}               | ${null}       | ${"Корректный расчет: 5 записей, pageSize = 5, page = 3, ожидается 1 страница"}
  `(
    "$description",
    async ({ pageSize, page, total, expectedTotalPages, expectedError }) => {
      mockInterviewRepository.findAndCountAll.mockResolvedValueOnce({
        rows: Array.from({ length: total }, () => ({})),
        count: total,
      });

      const query = { pageSize, page };

      if (expectedError) {
        await expect(service.getInterviews(query)).rejects.toThrow(
          expectedError
        );
      } else {
        const result = await service.getInterviews(query);
        expect(result.totalPages).toBe(expectedTotalPages);
        expect(result.total).toBe(total);
      }
    }
  );

  it("выбрасывает ошибку, когда соединение с базой данных не устанавливается", async () => {
    mockInterviewRepository.findAndCountAll.mockRejectedValue(
      new Error("Ошибка подключения к базе данных")
    );
    await expect(service.getInterviews({})).rejects.toThrow(
      "Ошибка подключения к базе данных"
    );
  });
});
