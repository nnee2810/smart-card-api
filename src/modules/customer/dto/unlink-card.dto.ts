import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class UnlinkCardDto {
  @ApiProperty()
  @IsString()
  signature: string

  @ApiProperty()
  @IsString()
  message: string
}
