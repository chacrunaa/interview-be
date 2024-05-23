import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import { InjectModel } from "@nestjs/sequelize";
import { File } from "./file.model";
import { CustomException } from "src/common/error-handling/custom-exception";
import * as uuid from "uuid";
import TelegramBot from "node-telegram-bot-api";
import { processFileAsync } from "src/files/utils/video/processFileAsync";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import ffprobePath from "ffprobe-static";
import axios from "axios";

// Установите пользовательские пути к ffmpeg и ffprobe
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

@Injectable()
export class FilesService {
  private bot: TelegramBot;
  private chatId: string;
  private groupChatId: string = process.env.TELEGRAM_GROUP_CHAT_ID;
  private externalEndpoint = process.env.EXTERNAL_ENDPOINT || "";

  constructor(
    @InjectModel(File)
    private fileRepository: typeof File
  ) {
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {
      polling: true,
    });
    this.chatId = process.env.TELEGRAM_CHAT_ID;

    // Получаем chatId при первом сообщении, если он еще не установлен
    this.bot.on("message", (msg) => {
      if (!this.chatId) {
        this.chatId = msg.chat.id.toString();
        console.log(`Получен чат id: ${this.chatId}`);

        // Сохраняем chatId в файл
        this.saveChatId(this.chatId);

        // Отправляем подтверждение получения chatId
        this.bot.sendMessage(this.chatId, "Chat ID received and saved.");
      }
    });
  }

  private saveChatId(chatId: string) {
    try {
      fs.writeFileSync("chatId.txt", chatId, "utf-8");
      console.log(`Чат id сохранён: ${chatId}`);
    } catch (err) {
      console.error("Ошибка сохранения id чата, лог:", err);
    }
  }

  private generateShortId(): string {
    return (
      Date.now().toString(36) + Math.random().toString(36).substring(2, 6)
    ).toUpperCase();
  }

  // Метод для создания файла и записи его в базу данных
  async createFile(file: any, articleid: string): Promise<void> {
    try {
      const shortId = this.generateShortId();
      const videoFileName = `${shortId}_video${path.extname(
        file.originalname
      )}`;
      const filePath = path.resolve(process.cwd(), "static");

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      const fullPath = path.join(filePath, videoFileName);
      fs.writeFileSync(fullPath, file.buffer);

      const fileRecord = await this.fileRepository.create({
        originalName: file.originalname,
        videoFileName: videoFileName,
        audioFileName: "",
        articleid,
      });

      console.log(`Видео ${videoFileName} готово к извлечению аудио`);
      processFileAsync(fullPath, fileRecord, this.sendToTelegram.bind(this));
    } catch (e) {
      console.error("Ошибка создания файла для записи, лог:", e);
      throw new CustomException("Произошла ошибка при записи файла");
    }
  }

  // Метод для отправки аудиофайла в Telegram и на внешний эндпоинт
  public async sendToTelegram(
    fileRecord: File,
    arctileid: string
  ): Promise<void> {
    const audioFilePath = path.resolve(
      process.cwd(),
      "static",
      fileRecord.audioFileName
    );
    try {
      if (!this.chatId) {
        throw new Error(
          "Chat ID not set. Send a message to the bot to initialize."
        );
      }

      const fileSize = fs.statSync(audioFilePath).size;
      const maxSize = 50 * 1024 * 1024; // 50 MB

      if (fileSize > maxSize) {
        console.log(`Размер файла ${fileSize} больше лимита 50мб, запуск разделения
         файла...`);
        await this.splitAudioFile(audioFilePath, fileRecord);
      } else {
        await this.bot.sendAudio(this.groupChatId, audioFilePath, {
          caption: `ID: ${fileRecord.id}\nOriginal Name: ${fileRecord.originalName}\nArticleId: ${fileRecord.articleid}`,
        });
        console.log(
          `Аудиофайл ${fileRecord.audioFileName} отправлен в телеграм`
        );

        // Удаление аудиофайла после успешной отправки
        fs.unlink(audioFilePath, (err) => {
          if (err) {
            console.error("Ошибка при удалении файла, лог:", err);
          } else {
            console.log(`Аудиофайл ${audioFilePath} удалён`);
          }
        });
        // Отправка на внешний эндпоинт
        if (this.externalEndpoint) {
          await this.sendToExternalEndpoint(fileRecord);
          console.log("Файл отправлен на внешний api");
        }
      }
      console.log("Файл обработан и отправлен");
    } catch (error) {
      console.error("Ошибка при отправке файла, лог:", error);
    }
  }

  // Метод для отправки аудиофайла на внешний эндпоинт
  public async sendToExternalEndpoint(fileRecord: File): Promise<void> {
    const audioFilePath = path.resolve(
      process.cwd(),
      "static",
      fileRecord.audioFileName
    );
    try {
      const duration = await this.getAudioDuration(audioFilePath);

      const formData = new FormData();
      formData.append("id", fileRecord.id.toString());
      formData.append("originalName", fileRecord.originalName);
      formData.append("duration", duration.toString());
      formData.append(
        "audio",
        fs.createReadStream(audioFilePath) as any,
        fileRecord.originalName
      );
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      const headers = formData.getHeaders();

      await axios.post(this.externalEndpoint, formData, {
        headers: {
          ...headers,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(
        `Аудиофайл: ${fileRecord.audioFileName} отправлен на эндпоинт ${this.externalEndpoint}`
      );
    } catch (error) {
      console.error(
        `Ошибка отправки файла на эндпоинт ${this.externalEndpoint}. Лог ошибки:`,
        error
      );
    }
  }

  // Метод для получения длительности аудиофайла
  getAudioDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err);
        } else {
          resolve(metadata.format.duration);
        }
      });
    });
  }

  // Метод для разделения аудиофайла на части
  async splitAudioFile(filePath: string, fileRecord: File) {
    const maxSize = 50 * 1024 * 1024; // 50 MB
    const duration = await this.getAudioDuration(filePath);
    const segmentDuration = Math.floor(
      (maxSize / fs.statSync(filePath).size) * duration
    );

    return new Promise<void>((resolve, reject) => {
      ffmpeg(filePath)
        .outputOptions(
          "-f",
          "segment",
          "-segment_time",
          segmentDuration.toString()
        )
        .output(
          `${path.dirname(filePath)}/${path.basename(
            filePath,
            path.extname(filePath)
          )}_part_%03d.mp3`
        )
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        .on("end", async () => {
          const segmentFiles = fs
            .readdirSync(path.dirname(filePath))
            .filter((f) =>
              f.includes(
                `${path.basename(filePath, path.extname(filePath))}_part_`
              )
            )
            .map((f) => path.join(path.dirname(filePath), f));

          console.log(`Аудиофайл разделен на ${segmentFiles.length} сегмента`);

          for (const segmentFile of segmentFiles) {
            console.log(
              `Отправка информации о сегменте в телеграм с id чата: ${this.groupChatId}`
            );
            await this.bot.sendAudio(this.groupChatId, segmentFile, {
              caption: `ID: ${fileRecord.id}\nOriginal Name: ${fileRecord.originalName}`,
            });
            console.log(`Аудио отправлено в телеграм чат: ${segmentFile}`);
          }

          console.log("Все сегметы отправлены в чат");

          // Удаляем сегменты после отправки
          segmentFiles.forEach((segmentFile) => fs.unlinkSync(segmentFile));

          // Удаление исходного аудиофайла
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Ошибка при удалении исходного файла, лог:", err);
            } else {
              console.log(`Извлечённое аудио ${filePath} удалено`);
            }
          });

          resolve();
        })
        .on("error", (err) => {
          console.error("Ошибка при разделении файла, лог:", err);
          reject(err);
        })
        .run();
    });
  }

  async getFileById(id: number): Promise<File> {
    const file = await this.fileRepository.findByPk(id);
    if (!file) {
      throw new HttpException("Файл не найден", HttpStatus.NOT_FOUND);
    }
    return file;
  }

  async getAllFiles(): Promise<File[]> {
    return this.fileRepository.findAll();
  }
}
