import { ApiProperty } from "@nestjs/swagger"
import { IsString } from "class-validator"

export class LinkCardDto {
  @ApiProperty()
  @IsString()
  publicKey: string
}
