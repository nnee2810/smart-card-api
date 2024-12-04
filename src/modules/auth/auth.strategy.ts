import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { PrismaService } from "src/modules/prisma/prisma.service"
import { EnvPayload } from "src/types/env"
import { RequestWithUser } from "src/types/request"
import { Jwt } from "src/types/jwt"

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  "access-token",
) {
  constructor(
    private configService: ConfigService<EnvPayload>,
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET"),
      passReqToCallback: true,
    })
  }

  async validate(request: RequestWithUser, payload: Jwt) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: payload.id,
      },
    })
    request.user = user
    return user
  }
}
