import { IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class SignInDto {
  @ApiProperty()
  @IsString()
  username: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string
}
