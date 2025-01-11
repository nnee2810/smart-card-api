import {
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import { PaginationDto } from "src/dto/pagination.dto"
import { AccessTokenGuard } from "src/modules/auth/auth.guard"
import { CreateOrderDto } from "src/modules/order/dto/create-order.dto"
import {
  PRISMA_SERVICE,
  PrismaService,
} from "src/modules/prisma/prisma.service"
import { encodeString, verifySignature } from "src/utils/security"

@ApiTags("Order")
@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller("order")
export class OrderController {
  constructor(
    @Inject(PRISMA_SERVICE)
    private prismaService: PrismaService,
  ) {}

  @ApiOperation({
    summary: "Tạo đơn hàng",
  })
  @Post()
  async create(@Body() { signature, ...data }: CreateOrderDto) {
    const customer = await this.prismaService.customer.findUnique({
      where: {
        id: data.customerId,
      },
    })
    if (!customer) throw new NotFoundException("Khách hàng không tồn tại")
    const separator = 0x7c
    if (
      !verifySignature(customer.publicKey, signature, [
        data.useRewardPoint ? 1 : 0,
        separator,
        (data.rewardPointsReceived >> 8) & 0xff,
        data.rewardPointsReceived & 0xff,
        separator,
        ...encodeString(customer.id),
        separator,
        ...encodeString(data.totalAmount.toString()),
        separator,
        ...encodeString(data.timestamp.toString()),
      ])
    )
      throw new UnauthorizedException()
    return this.prismaService.order.create({
      data: {
        ...data,
        timestamp: data.timestamp.toString(),
      },
    })
  }

  @ApiOperation({
    summary: "Lấy danh sách đơn hàng",
  })
  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.prismaService.order.paginate({
      ...query,
      include: {
        customer: {
          select: {
            name: true,
            phone: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }
}
