import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";

import { ApplicationModule } from "./app.module";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(ApplicationModule);

  const configService = app.get(ConfigService);

  const options = new DocumentBuilder()
    .setTitle("mongoose")
    .setDescription("API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("swagger", app, document);

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<number>("PORT", 3000);

  await app.listen(port, host, () => {
    console.info(`Express server is running on http://${host}:${port}/`);
  });
}

void bootstrap();
