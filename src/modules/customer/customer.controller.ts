import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { CreateCustomerDto } from "./dto/create-customer.dto"
import { UpdateCustomerDto } from "./dto/update-customer.dto"
import {
  PRISMA_SERVICE,
  PrismaService,
} from "src/modules/prisma/prisma.service"
import { PaginationDto } from "src/dto/pagination.dto"
import { LinkCardDto } from "src/modules/customer/dto/link-card.dto"
import { createPublicKey } from "src/utils/security"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { AccessTokenGuard } from "src/modules/auth/auth.guard"

@ApiTags("Customer")
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller("customer")
export class CustomerController {
  constructor(
    @Inject(PRISMA_SERVICE)
    private prismaService: PrismaService,
  ) {}

  @ApiOperation({
    summary: "Tạo khách hàng mới",
  })
  @Post()
  async create(@Body() data: CreateCustomerDto) {
    try {
      return await this.prismaService.customer.create({
        omit: {
          publicKey: true,
        },
        data: {
          ...data,
          publicKey: createPublicKey(Buffer.from(data.publicKey)),
        },
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException("Số điện thoại đã được sử dụng")
        }
      }
      throw new InternalServerErrorException(error)
    }
  }

  @ApiOperation({
    summary: "Lấy danh sách khách hàng",
  })
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.prismaService.customer.paginate({
      ...query,
      omit: {
        publicKey: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  @ApiOperation({
    summary: "Lấy thông tin khách hàng",
  })
  @Get(":id")
  async findOne(@Param("id") id: string) {
    const customer = await this.prismaService.customer.findFirst({
      omit: {
        publicKey: true,
      },
      where: {
        OR: [
          {
            id,
          },
          {
            phone: id,
          },
        ],
      },
    })
    if (!customer) throw new NotFoundException()
    return customer
  }

  @ApiOperation({
    summary: "Cập nhật thông tin khách hàng",
  })
  @Patch(":id")
  update(@Param("id") id: string, @Body() data: UpdateCustomerDto) {
    try {
      return this.prismaService.customer.update({
        omit: {
          publicKey: true,
        },
        where: { id },
        data,
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ConflictException("Số điện thoại đã tồn tại")
        }
      }
    }
  }

  @ApiOperation({
    summary: "Xóa khách hàng",
  })
  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.prismaService.customer.delete({
      omit: {
        publicKey: true,
      },
      where: { id },
    })
  }

  @ApiOperation({
    summary: "Liên kết thẻ với khách hàng",
  })
  @Post("link-card/:id")
  linkCard(@Param("id") id: string, @Body() data: LinkCardDto) {
    return this.prismaService.customer.update({
      omit: {
        publicKey: true,
      },
      where: { id },
      data: {
        publicKey: data.publicKey.join(" "),
      },
    })
  }
}
