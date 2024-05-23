import * as path from "path";
import * as uuid from "uuid";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";

ffmpeg.setFfmpegPath(ffmpegPath);

export const extractAudio = (videoPath: string): Promise<string> => {
  const audioFileName = uuid.v4() + ".mp3";
  const audioFilePath = path.resolve(process.cwd(), "static", audioFileName);

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioFilePath)
      .on("end", () => {
        resolve(audioFileName);
      })
      .on("error", (err) => {
        reject(err);
      })
      .run();
  });
};
