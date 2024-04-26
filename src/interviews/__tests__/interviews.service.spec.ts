/**
 * Импорт модулей Test и TestingModule из @nestjs/testing.
 * Эти утилиты помогают создать модульное тестовое окружение для NestJS приложений.
 */
import { TestingModule } from "@nestjs/testing";

import { InterviewsService } from "../interviews.service";
import { JwtService } from "@nestjs/jwt";
import { getModelToken } from "@nestjs/sequelize";
import { Interview } from "../interviews.model";
import { initializeTestModule } from "src/__tests__/testSetup";

/**
 * Описание тестового блока для InterviewsService. Все тесты, связанные с этим сервисом, будут внутри этого блока.
 */
describe("InterviewsService", () => {
  /**
   * Определение переменных для хранения экземпляра сервиса, JWT сервиса и мок-объекта репозитория.
   * Мок-объект mockInterviewRepository имитирует поведение реального репозитория, заменяя его метод create.
   */
  let service: InterviewsService;
  let jwtService: JwtService;
  let mockInterviewRepository = {
    /**
 * jest.fn():
    jest.fn() создает новую мок-функцию. Это означает, что функция не будет выполнять какую-либо реальную логику из вашего приложения, 
    а будет вести себя так, как вы настроите в тестах. Она может быть использована для замены реальных функций в тестах, чтобы вы могли проверить, 
    сколько раз и с какими аргументами она была вызвана, не выполняя её реальной логики.

 .mockImplementation():
    Метод .mockImplementation() используется для задания конкретного поведения мок-функции. В данном случае вы указываете, 
    как должна вести себя функция, когда она вызывается. Внутри метода вы можете определить любую логику, 
    которую хотите имитировать в рамках теста.

   dto => Promise.resolve(dto):
    Эта часть является функцией, которую вы передаете в mockImplementation(). 
    Она принимает аргумент dto и возвращает промис, который сразу разрешается с тем же dto (объект данных, который передается в функцию).
    Это имитация асинхронной функции, которая обычно добавляет или изменяет данные в базе данных и затем возвращает новый или измененный объект.
    В тестах это позволяет вам упростить работу с асинхронностью, предполагая, 
    что функция всегда успешно завершается и возвращает входные данные без изменений.
*/
    create: jest.fn().mockImplementation((dto) => Promise.resolve(dto)),
  };
  /**
   * Блок beforeEach выполняется перед каждым тестом, настраивая свежее тестовое окружение.
   */
  beforeEach(async () => {
    /**
     * providers - определение поставщиков для тестового модуля. Поставщики включают сервисы и моки.
     */
    const providers = [
      InterviewsService,
      {
        /**
         * 
        Мок JwtService. Этот объект заменяет реальный JwtService и предоставляет замоканную функцию verify, 
        которая возвращает заранее определенные значения.
        */
        provide: JwtService,
        /**
         * Здесь указываются данные, которые будут использованы при парсинге токена.
         * То есть в примере createInterview мы забираем никнейм из токена и добавляем его в базу данных вместе со
         * статьёй(как автора).
         * То есть если вдруг пользователя мы где-то указываем, то именно эти данные должны быть проверены.
         */
        useValue: {
          verify: jest.fn().mockReturnValue({
            id: 1,
            email: "test@example.com",
            nickName: "Новый никнейм",
          }),
        },
      },
      {
        /**
         * Инъекция мок-объекта модели Interview.
         * getModelToken используется для получения токена модели, который в инъекции зависимостей заменяется моком.
         */
        provide: getModelToken(Interview),
        useValue: mockInterviewRepository,
      },
    ];
    /**
     * Компиляция модуля завершает настройку тестового окружения, собирая все зависимости.
     * За это отвечает initializeTestModule
     */
    const module: TestingModule = await initializeTestModule(providers);
    /**
     * Извлечение экземпляров сервисов из скомпилированного модуля.
     * Это дает доступ к экземплярам InterviewsService и JwtService, которые будут использоваться в тестах.
     */
    service = module.get<InterviewsService>(InterviewsService);
    jwtService = module.get<JwtService>(JwtService);
  });
  /**
   * Базовый тест проверяет, что сервис и его зависимости корректно определены,
   * что является проверкой успешной инъекции.
   */
  it("Сервис и зависимости определены", () => {
    expect(service).toBeDefined();
    expect(jwtService).toBeDefined();
  });
});
