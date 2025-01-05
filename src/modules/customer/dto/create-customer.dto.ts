import { ApiProperty } from "@nestjs/swagger"
import { IsBase64, IsInt, IsPhoneNumber, IsString } from "class-validator"

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsPhoneNumber("VN")
  phone: string

  @ApiProperty()
  @IsBase64()
  avatar: string

  @ApiProperty()
  @IsInt({
    each: true,
  })
  publicKey: number[]
}
