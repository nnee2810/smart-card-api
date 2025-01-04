import { Module } from "@nestjs/common"
import { OrderController } from "src/modules/order/order.controller"

@Module({
  controllers: [OrderController],
})
export class OrderModule {}
