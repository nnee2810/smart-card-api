import { Module } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { PassportModule } from "@nestjs/passport"
import { AccessTokenStrategy } from "src/modules/auth/auth.strategy"
import { AuthController } from "src/modules/auth/auth.controller"

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}
