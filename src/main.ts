import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "./pipes/validation.pipe";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = new DocumentBuilder()
    .setTitle("bebebe")
    .setDescription("Документация REST API")
    .setVersion("1.0.0")
    .addTag("какой-то тег")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: "*", // Разрешаем запросы с любого источника
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
  });

  app.useStaticAssets(join(__dirname, "..", "static"));

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
