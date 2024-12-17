import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import {
  IsBase64,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from "class-validator"

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsPhoneNumber("VN")
  phone: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsBase64()
  avatar: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber(undefined, {
    each: true,
  })
  publicKey: number[]
}
