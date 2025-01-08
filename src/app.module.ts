import { Module } from "@nestjs/common"
import { SharedModule } from "src/modules/shared/shared.module"
import { AuthModule } from "./modules/auth/auth.module"
import { CustomerModule } from "src/modules/customer/customer.module"
import { OrderModule } from "./modules/order/order.module"
import { UserModule } from "src/modules/user/user.module"

@Module({
  imports: [SharedModule, AuthModule, CustomerModule, OrderModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
