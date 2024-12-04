import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ConfigService } from "@nestjs/config"
import { EnvPayload } from "src/types/env"
import helmet from "helmet"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService<EnvPayload>)
  const PORT = configService.get("PORT")

  app.enableShutdownHooks()
  app.enableCors()
  app.use(helmet())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle("smart-card-api")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  await app.listen(PORT || 3000)
}

bootstrap()
