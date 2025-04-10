import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Customer } from '../entities/customer.entity';
import { CustomerRequestDTO } from '../entities/dto/request/customer.request.dto';
import { CustomerResponseDTO } from '../entities/dto/response/customer.response.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<CustomerResponseDTO[]> {
    return this.customerRepository.find();
  }

  async findById(customerID: number): Promise<CustomerResponseDTO> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerID },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async create(
    customerRequestDTO: CustomerRequestDTO,
  ): Promise<CustomerResponseDTO> {
    const existingCustomer = await this.customerRepository.findOne({
      where: {
        email: customerRequestDTO.email,
      },
    });

    if (existingCustomer) {
      throw new BadRequestException(
        'A customer with this e-mail already exists.',
      );
    }
    const customer = this.customerRepository.create(customerRequestDTO);
    return this.customerRepository.save(customer);
  }
}
