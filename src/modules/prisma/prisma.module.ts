import { Global, Module } from "@nestjs/common"
import {
  BasePrismaService,
  PRISMA_SERVICE,
  PrismaService,
} from "src/modules/prisma/prisma.service"

@Global()
@Module({
  providers: [
    {
      provide: PRISMA_SERVICE,
      useFactory(): PrismaService {
        return new BasePrismaService().withExtensions()
      },
    },
  ],
  exports: [PRISMA_SERVICE],
})
export class PrismaModule {}
