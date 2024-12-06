import { PrismaClient } from "@prisma/client"
import { pagination } from "prisma-extension-pagination"
import { OnModuleInit } from "@nestjs/common"

export const PRISMA_SERVICE = "PRISMA_SERVICE"

export class BasePrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  withExtensions() {
    return this.$extends(
      pagination({
        pages: {
          includePageCount: true,
        },
      }),
    )
  }
}

export type PrismaService = ReturnType<BasePrismaService["withExtensions"]>
