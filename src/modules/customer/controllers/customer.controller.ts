import { Controller, Get } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';
import { CustomerService } from '../services/customer.service';

@Controller('api/v1/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async findAll(): Promise<Customer[]> {
    return await this.customerService.findAll();
  }
}
