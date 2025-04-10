import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomerRequestDTO } from '../entities/dto/request/customer.request.dto';
import { CustomerResponseDTO } from '../entities/dto/response/customer.response.dto';
import { CustomerService } from '../services/customer.service';

@Controller('api/v1/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(): Promise<CustomerResponseDTO[]> {
    return await this.customerService.findAll();
  }

  @Post()
  async create(
    @Body() customer: CustomerRequestDTO,
  ): Promise<CustomerResponseDTO> {
    return await this.customerService.create(customer);
  }
}
