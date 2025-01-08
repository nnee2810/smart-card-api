import { ApiProperty } from "@nestjs/swagger"
import { UserRole } from "@prisma/client"
import { IsEnum, IsString, MinLength } from "class-validator"

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  @MinLength(6)
  username: string

  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole)
  role: UserRole
}
