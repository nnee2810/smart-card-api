import { IsBoolean, IsInt, IsString } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  customerId: string

  @ApiProperty()
  @IsBoolean()
  useRewardPoint: boolean

  @ApiProperty()
  @IsInt()
  rewardPointsReceived: number

  @ApiProperty()
  @IsInt()
  totalAmount: number

  @ApiProperty()
  @IsInt()
  timestamp: number

  @ApiProperty()
  @IsInt({
    each: true,
  })
  signature: number[]
}
