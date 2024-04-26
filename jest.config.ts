const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("./tsconfig");

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
  testPathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "\\.d\\.ts$",
    "__tests__/testSetup.ts",
    'testMocks.ts',
  ], // Игнорирование файла настроек тестов, чтобы jest не ругался на то, что в общих файлах настройки 
    // нет ни одного теста
  transform: {
    "^.+\\.ts$": "ts-jest", // Указываем, как обрабатывать файлы TypeScript
  },
  moduleFileExtensions: ["js", "json", "ts"], // Указываем расширения файлов, которые нужно обрабатывать
  verbose: true, // при распределении тестов по директориям в консоле после теста выводится меньше инфы.
  // если информация по тестам необходима, то включаем эту настройку

};
