import * as path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

const videoPath = process.argv[2];
const processId = process.argv[3]; // Уникальный идентификатор процесса
const shortId = path.basename(videoPath).split("_")[0];
const audioFileName = `${shortId}_audio.mp3`;
const audioFilePath = path.resolve(process.cwd(), "static", audioFileName);

console.log(`Процесс номер ${processId} извлекает аудио из ${videoPath}`);

ffmpeg(videoPath)
  .output(audioFilePath)
  .on("end", () => {
    console.log(`Процесс номер ${processId} извлёк аудио из: ${audioFileName}`);
    process.send({ audioFileName });
  })
  .on("error", (err) => {
    console.error(`Процесс ${processId} завершен с ошибкой, лог::`, err);
    process.exit(1);
  })
  .run();
