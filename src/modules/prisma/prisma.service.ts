import { PrismaClient } from "@prisma/client"
import { pagination } from "prisma-extension-pagination"
import { OnModuleInit } from "@nestjs/common"
import { createSoftDeleteExtension } from "prisma-extension-soft-delete"

export const PRISMA_SERVICE = "PRISMA_SERVICE"
export type PrismaService = ReturnType<BasePrismaService["withExtensions"]>

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
    ).$extends(
      createSoftDeleteExtension({
        models: {
          User: true,
          Customer: true,
        },
        defaultConfig: {
          field: "isDeleted",
          createValue: Boolean,
        },
      }),
    )
  }
}
