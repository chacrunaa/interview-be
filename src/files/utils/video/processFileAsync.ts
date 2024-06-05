import * as path from "path";
import { fork } from "child_process";
import { File } from "../../file.model";
import * as fs from "fs";
import { taskQueue } from "./taskQueue";
import * as uuid from "uuid";

export const processFileAsync = (
  videoPath: string,
  fileRecord: File,
  sendToTelegram: (fileRecord: File) => void
) => {
  taskQueue.addTask(() => {
    return new Promise<void>((resolve, reject) => {
      const processId: string = uuid.v4(); // Уникальный идентификатор для каждого процесса
      console.log(`Начало процесса ${processId} для ${videoPath}`);

      const process = fork(path.resolve(__dirname, "extractAudioProcess"), [
        videoPath,
        processId,
      ]);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      process.on("message", async (message) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const { audioFileName } = message as { audioFileName: string };
        console.log(
          `Запущен процесс номер ${processId} для извлечения аудио из: ${audioFileName}`
        );

        // Обновление записи в базе данных
        await fileRecord.update({ audioFileName });

        // Удаление видеофайла после извлечения аудио
        fs.unlink(videoPath, (err) => {
          if (err) {
            console.error(
              `Процесс номер ${processId} не смог удалить файл, ошибка:`,
              err
            );
          } else {
            console.log(
              `Процесс номер ${processId} удалил аудиофайл: ${videoPath}`
            );
          }
        });
        // Отправка файла в Telegram
        sendToTelegram(fileRecord);
        resolve();
      });

      process.on("error", (err) => {
        console.error(`Process ${processId} error extracting audio:`, err);
        reject(err);
      });
    });
  });
};
