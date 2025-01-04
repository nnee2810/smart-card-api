import { IsBoolean, IsInt, IsString, Min } from "class-validator"
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
  @Min(0)
  rewardPoints: number

  @ApiProperty()
  @IsInt()
  timestamp: number

  @ApiProperty()
  @IsInt({
    each: true,
  })
  signature: number[]
}
