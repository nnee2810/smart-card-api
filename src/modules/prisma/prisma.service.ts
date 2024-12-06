import { PrismaClient } from "@prisma/client"
import { OnModuleInit } from "@nestjs/common"
import paginate from "prisma-paginate"

export const PRISMA_SERVICE = "PRISMA_SERVICE"

export class BasePrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }

  withExtensions() {
    return this.$extends(paginate)
  }
}

export type PrismaService = ReturnType<BasePrismaService["withExtensions"]>
