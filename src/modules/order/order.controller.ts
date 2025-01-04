import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
} from "@nestjs/common"
import {
  PRISMA_SERVICE,
  PrismaService,
} from "src/modules/prisma/prisma.service"
import { CreateOrderDto } from "src/modules/order/dto/create-order.dto"

@Controller("order")
export class OrderController {
  constructor(
    @Inject(PRISMA_SERVICE)
    private prismaService: PrismaService,
  ) {}

  @Post()
  createOrder(@Body() data: CreateOrderDto) {
    const customer = this.prismaService.customer.findUnique({
      where: {
        id: data.customerId,
      },
    })
    if (!customer) throw new NotFoundException("Khách hàng không tồn tại")
  }
}
