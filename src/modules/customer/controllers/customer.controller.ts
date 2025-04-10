import { Controller, Get } from '@nestjs/common';
import { CustomerResponseDTO } from '../entities/dto/response/customer.response.dto';
import { CustomerService } from '../services/customer.service';

@Controller('api/v1/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(): Promise<CustomerResponseDTO[]> {
    return await this.customerService.findAll();
  }
}
