import { Module } from "@nestjs/common"
import { SharedModule } from "src/modules/shared/shared.module"
import { AuthModule } from "./modules/auth/auth.module"

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
