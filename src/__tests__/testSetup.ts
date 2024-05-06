/**
 * Базовый тест модуль. 
 * Добавление JwtService в тестовый модуль будет обсуждаться отдельно 
 * в зависимости от потребности и настройки новых тестов
*/

import { Test, TestingModule } from '@nestjs/testing';

/**
 * Функция для создания тестового модуля. Принимает массив providers и возвращает скомпилированный тестовый модуль.
 * Это унифицирует и упрощает создание тестовых модулей по всему приложению.
 */
export async function initializeTestModule(providers: any[]): Promise<TestingModule> {
    return await Test.createTestingModule({
        providers: providers,
    }).compile();
}