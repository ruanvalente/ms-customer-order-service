import { Injectable } from '@nestjs/common';
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

  async create(customer: CustomerRequestDTO): Promise<CustomerResponseDTO> {
    return this.customerRepository.save(customer);
  }
}
