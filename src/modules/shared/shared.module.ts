import { Module } from "@nestjs/common"
import * as Joi from "joi"
import { ConfigModule } from "@nestjs/config"
import { EnvPayload } from "src/types/env"
import { JwtModule } from "@nestjs/jwt"
import { PrismaModule } from "src/modules/prisma/prisma.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object<EnvPayload, true>({
        PORT: Joi.number().required(),

        DATABASE_URL: Joi.string().required(),

        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRE: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRE: Joi.string().required(),

        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),

        GOOGLE_TRANSLATE_API_KEY: Joi.string().required(),
      }),
    }),
    PrismaModule,
    JwtModule.register({
      global: true,
    }),
  ],
})
export class SharedModule {}
