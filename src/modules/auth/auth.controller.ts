import {
  Body,
  Controller,
  Inject,
  Post,
  UnauthorizedException,
} from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger"
import {
  PRISMA_SERVICE,
  PrismaService,
} from "src/modules/prisma/prisma.service"
import { EnvPayload } from "src/types/env"
import { exclude } from "src/utils/exclude"
import { Jwt } from "src/types/jwt"
import { AuthService } from "src/modules/auth/auth.service"
import { RefreshTokenDto } from "src/modules/auth/dto/refresh-token.dto"
import { SignInDto } from "src/modules/auth/dto/sign-in.dto"
import * as bcrypt from "bcrypt"

@ApiTags("Auth")
@ApiBearerAuth()
@Controller("auth")
export class AuthController {
  constructor(
    private configService: ConfigService<EnvPayload>,
    private jwtService: JwtService,
    @Inject(PRISMA_SERVICE)
    private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  @ApiOperation({ summary: "Đăng nhập " })
  @Post("sign-in")
  async signIn(@Body() data: SignInDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
      },
    })
    if (!user || !bcrypt.compareSync(data.password, user.password))
      throw new UnauthorizedException()

    const accessToken = this.authService.generateAccessToken(user.id),
      refreshToken = this.authService.generateRefreshToken(user.id)
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        refreshToken,
      },
    })
    return {
      user: exclude(user, ["password", "refreshToken"]),
      accessToken,
      refreshToken,
    }
  }

  @ApiOperation({ summary: "Refresh token" })
  @Post("refresh-token")
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync<Jwt>(refreshToken, {
        secret: this.configService.get("JWT_REFRESH_TOKEN_SECRET"),
      })
      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
      })
      if (!user || user.refreshToken !== refreshToken)
        throw new UnauthorizedException()

      const newRefreshToken = this.authService.generateRefreshToken(user.id)
      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          refreshToken: newRefreshToken,
        },
      })
      return {
        accessToken: this.authService.generateAccessToken(user.id),
        refreshToken: newRefreshToken,
      }
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
