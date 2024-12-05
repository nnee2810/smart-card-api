import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { EnvPayload } from "src/types/env"

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<EnvPayload>,
    private jwtService: JwtService,
  ) {}

  generateAccessToken(id: string) {
    return this.jwtService.sign(
      {
        id,
      },
      {
        secret: this.configService.get("JWT_ACCESS_TOKEN_SECRET"),
        expiresIn: this.configService.get("JWT_ACCESS_TOKEN_EXPIRE"),
      },
    )
  }

  generateRefreshToken(id: string) {
    return this.jwtService.sign(
      {
        id,
      },
      {
        secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
        expiresIn: this.configService.get("JWT_REFRESH_TOKEN_EXPIRE"),
      },
    )
  }
}
