import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
  UnauthorizedException,
} from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"
import { CreateOrderDto } from "src/modules/order/dto/create-order.dto"
import {
  PRISMA_SERVICE,
  PrismaService,
} from "src/modules/prisma/prisma.service"
import { encodeString, verifySignature } from "src/utils/security"

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
  async createOrder(@Body() { signature, ...data }: CreateOrderDto) {
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
}
