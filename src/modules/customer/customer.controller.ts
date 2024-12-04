import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common"
import { CreateCustomerDto } from "./dto/create-customer.dto"
import { UpdateCustomerDto } from "./dto/update-customer.dto"
import { PrismaService } from "src/modules/prisma/prisma.service"

@Controller("customer")
export class CustomerController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  create(@Body() data: CreateCustomerDto) {
    return this.prismaService.customer.create({
      data,
    })
  }

  @Get()
  findAll() {
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
