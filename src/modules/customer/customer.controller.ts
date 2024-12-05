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

@Controller("customer")
export class CustomerController {
  constructor(
    @Inject(PRISMA_SERVICE)
    private prismaService: PrismaService,
  ) {}

  @Post()
  create(@Body() data: CreateCustomerDto) {
    return this.prismaService.customer.create({
      select: {
        publicKey: false,
      },
      data,
    })
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.prismaService.customer
      .paginate({
        select: {
          publicKey: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      .withPages(query)
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.prismaService.customer.findUnique({
      select: {
        publicKey: false,
      },
      where: { id },
    })
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: UpdateCustomerDto) {
    return this.prismaService.customer.update({
      select: {
        publicKey: false,
      },
      where: { id },
      data,
    })
  }

  @Delete(":id")
  delete(@Param("id") id: string) {
    return this.prismaService.customer.delete({
      select: {
        publicKey: false,
      },
      where: { id },
    })
  }

  @Post(":id/link-card")
  linkCard(@Param("id") id: string, @Body() data: LinkCardDto) {
    return this.prismaService.customer.update({
      select: {
        publicKey: false,
      },
      where: { id },
      data,
    })
  }

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
        sourceId: "",
      }) ||
      !verifySignature(customer.publicKey, signature, message)
    )
      throw new UnauthorizedException()

    return this.prismaService.customer.update({
      select: {
        publicKey: false,
      },
      where: { id },
      data: {
        publicKey: null,
      },
    })
  }
}
