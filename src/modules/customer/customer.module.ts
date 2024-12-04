import { Module } from "@nestjs/common"
import { CustomerController } from "./customer.controller"

@Module({
  controllers: [CustomerController],
  providers: [],
})
export class CustomerModule {}
