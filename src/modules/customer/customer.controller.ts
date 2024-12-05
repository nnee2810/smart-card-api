import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common"
import { CreateCustomerDto } from "./dto/create-customer.dto"
import { UpdateCustomerDto } from "./dto/update-customer.dto"
import {
  PRISMA_SERVICE,
  PrismaService,
} from "src/modules/prisma/prisma.service"
import { PaginationDto } from "src/dto/pagination.dto"

@Controller("customer")
export class CustomerController {
  constructor(
    @Inject(PRISMA_SERVICE)
    private prismaService: PrismaService,
  ) {}

  @Post()
  create(@Body() data: CreateCustomerDto) {
    return this.prismaService.customer.create({
      data,
    })
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    this.prismaService.customer
    return
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return
  }
}
