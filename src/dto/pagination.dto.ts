import { IsInt, Min } from "class-validator"
import { ApiPropertyOptional } from "@nestjs/swagger"
import { Type } from "class-transformer"

export class PaginationDto {
  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1

  @ApiPropertyOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit: number = 10
}
