import { Module } from "@nestjs/common"
import { SharedModule } from "src/modules/shared/shared.module"
import { AuthModule } from "./modules/auth/auth.module"
import { CustomerModule } from "src/modules/customer/customer.module"

@Module({
  imports: [SharedModule, AuthModule, CustomerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
