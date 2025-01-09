import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { CurrentUser } from "src/decorators/current-user.decorator"
import { exclude } from "src/utils/exclude"
import { PRISMA_SERVICE, PrismaService } from "../prisma/prisma.service"
import { AccessTokenGuard } from "src/modules/auth/auth.guard"
import { PaginationDto } from "src/dto/pagination.dto"
import { CreateUserDto } from "src/modules/user/dto/create-user.dto"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

@ApiTags("User")
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller("user")
export class UserController {
  constructor(
    @Inject(PRISMA_SERVICE)
    private prismaService: PrismaService,
  ) {}

  @ApiOperation({ summary: "Tạo người dùng mới" })
  @Post()
  async createUser(@Body() data: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: {
          ...data,
          password:
            "$2a$12$qgiQAgWP38cUsGJd49V0Uez26Y0oNSZzDEUqXGPBoPg1IbhsgD8OS",
        },
        omit: {
          password: true,
          refreshToken: true,
        },
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException("Tên đăng nhập đã được sử dụng")
        }
      }
      throw new InternalServerErrorException(error)
    }
  }

  @ApiOperation({ summary: "Lấy profile người dùng hiện tại" })
  @Get("profile")
  async getProfile(@CurrentUser("id") id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    })
    return exclude(user, ["password", "refreshToken"])
  }

  @ApiOperation({ summary: "Lấy danh sách người dùng" })
  @Get()
  findAll(@Query() query: PaginationDto, @CurrentUser("id") id: string) {
    return this.prismaService.user.paginate({
      ...query,
      where: {
        NOT: {
          id,
        },
        isDeleted: false,
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

  @ApiOperation({ summary: "Xoá người dùng" })
  @Delete(":id")
  async deleteUser(
    @Param("id") id: string,
    @CurrentUser("id") currentUserId: string,
  ) {
    if (currentUserId === id)
      throw new ConflictException("Không thể xoá chính mình")
    return this.prismaService.user.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    })
  }
}
