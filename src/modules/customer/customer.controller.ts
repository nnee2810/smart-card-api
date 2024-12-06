import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
} from "@nestjs/common"
import { CreateCustomerDto } from "./dto/create-customer.dto"
import { UpdateCustomerDto } from "./dto/update-customer.dto"
import {
  PRISMA_SERVICE,
  PrismaService,
} from "src/modules/prisma/prisma.service"
import { PaginationDto } from "src/dto/pagination.dto"
import { LinkCardDto } from "src/modules/customer/dto/link-card.dto"
import { UnlinkCardDto } from "src/modules/customer/dto/unlink-card.dto"
import { verifyMessage, verifySignature } from "src/utils/security"
import { ApiOperation } from "@nestjs/swagger"

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
  create(@Body() data: CreateCustomerDto) {
    return this.prismaService.customer.create({
      omit: {
        publicKey: true,
      },
      data,
    })
  }

  @ApiOperation({
    summary: "Lấy danh sách khách hàng",
  })
  @Get()
  findAll(@Query() query: PaginationDto) {
    console.log("findAll")
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
  findOne(@Param("id") id: string) {
    console.log("findOne")
    return this.prismaService.customer.findUnique({
      omit: {
        publicKey: true,
      },
      where: { id },
    })
  }

  @ApiOperation({
    summary: "Cập nhật thông tin khách hàng",
  })
  @Patch(":id")
  update(@Param("id") id: string, @Body() data: UpdateCustomerDto) {
    return this.prismaService.customer.update({
      omit: {
        publicKey: true,
      },
      where: { id },
      data,
    })
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
  @Post(":id/link-card")
  linkCard(@Param("id") id: string, @Body() data: LinkCardDto) {
    return this.prismaService.customer.update({
      omit: {
        publicKey: true,
      },
      where: { id },
      data,
    })
  }

  @ApiOperation({
    summary: "Hủy liên kết thẻ với khách hàng",
  })
  @Post(":id/unlink-card")
  async unlinkCard(
    @Param("id") id: string,
    @Body() { signature, message }: UnlinkCardDto,
  ) {
    const customer = await this.prismaService.customer.findUnique({
      where: { id },
    })
    if (!customer) throw new NotFoundException()

    if (
      !verifyMessage(message, {
        action: "unlink-card",
        targetId: id,
      }) ||
      !verifySignature(customer.publicKey, signature, message)
    )
      throw new UnauthorizedException()

    return this.prismaService.customer.update({
      omit: {
        publicKey: true,
      },
      where: { id },
      data: {
        publicKey: null,
      },
    })
  }
}
