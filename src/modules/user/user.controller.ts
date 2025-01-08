import { Controller, Get, Inject, Query, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { CurrentUser } from "src/decorators/current-user.decorator"
import { exclude } from "src/utils/exclude"
import { PRISMA_SERVICE, PrismaService } from "../prisma/prisma.service"
import { AccessTokenGuard } from "src/modules/auth/auth.guard"
import { PaginationDto } from "src/dto/pagination.dto"

@ApiTags("User")
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller("user")
export class UserController {
  constructor(
    @Inject(PRISMA_SERVICE)
    private prismaService: PrismaService,
  ) {}

  @ApiOperation({ summary: "Lấy profile người dùng hiện tại" })
  @Get("profile")
  async getProfile(@CurrentUser("id") id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })
    return exclude(user, ["password", "refreshToken"])
  }

  findAll(@Query() query: PaginationDto, @CurrentUser("id") id: string) {
    return this.prismaService.user.paginate({
      ...query,
      where: {
        NOT: {
          id,
        },
      },
      omit: {
        password: true,
        refreshToken: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }
}
