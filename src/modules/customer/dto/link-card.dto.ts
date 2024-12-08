import { ApiProperty } from "@nestjs/swagger"
import { IsNumber } from "class-validator"

export class LinkCardDto {
  @ApiProperty()
  @IsNumber(undefined, {
    each: true,
  })
  publicKey: number[]
}
