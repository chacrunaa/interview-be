import { generatePrefixOfInterview } from "src/interviews/utils/generatePrefixOfInterview.utils";

describe("InterviewsService - Utils generatePrefixOfInterview", () => {
  /**
   * Пока что записываем в таком формате. Возможно обновим jest
   * 
   * 
   * Для понимания это эквивалент записи 
   *    test.each([
        { maxoffer: 100000, minoffer: 0, expected: 'до', description: 'максимальное предложение без минимального' },
        { maxoffer: 0, minoffer: 50000, expected: 'от', description: 'минимальное предложение без максимального' },
        { maxoffer: 100000, minoffer: 50000, expected: null, description: 'оба предложения указаны' },
        { maxoffer: 0, minoffer: 0, expected: null, description: 'оба предложения отсутствуют' },
        { maxoffer: undefined, minoffer: undefined, expected: null, description: 'неопределенные значения' }

    ])('возвращает $expected, когда $description', ({ expected, description }) => {

        const result = generatePrefixOfInterview({ maxoffer, minoffer });
        expect(result).toBe(expected);
    });
   */
  describe("Функция generatePrefixOfInterview", () => {
    test.each`
      maxoffer     | minoffer     | expected | description
      ${100000}    | ${0}         | ${"до"}  | ${"максимальное предложение без минимального"}
      ${0}         | ${50000}     | ${"от"}  | ${"минимальное предложение без максимального"}
      ${100000}    | ${50000}     | ${null}  | ${"оба предложения указаны"}
      ${0}         | ${0}         | ${null}  | ${"оба предложения отсутствуют"}
      ${undefined} | ${undefined} | ${null}  | ${"невалидные значения"}
    `(
      "возвращает $expected, когда - $description",
      ({ maxoffer, minoffer, expected }) => {
        const result = generatePrefixOfInterview({ maxoffer, minoffer });
        expect(result).toBe(expected);
      }
    );
  });
});
