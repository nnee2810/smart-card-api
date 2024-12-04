import { ApiProperty } from "@nestjs/swagger"
import { IsPhoneNumber, IsString } from "class-validator"

export class CreateCustomerDto {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsPhoneNumber("VN")
  phone: string
}
