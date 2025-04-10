import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

import { CustomerRequestDTO } from '../entities/dto/request/customer.request.dto';
import { CustomerResponseDTO } from '../entities/dto/response/customer.response.dto';
import { CustomerService } from '../services/customer.service';

@Controller('api/v1/customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  @ApiResponse({
    status: 200,
    description: 'List all customers',
    type: [CustomerResponseDTO],
  })
  async findAll(): Promise<CustomerResponseDTO[]> {
    return await this.customerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'List customer by ID' })
  @ApiResponse({
    status: 200,
    description: 'List customer by ID',
    type: [CustomerResponseDTO],
  })
  @ApiParam({
    name: 'id',
    description: 'Customer ID',
    required: false,
    type: 'integer',
  })
  async findById(@Param('id') id: string) {
    return await this.customerService.findById(Number(id));
  }

  @Post()
  @ApiBody({
    schema: {
      example: {
        name: 'john_doe',
        email: 'john@example.com',
        phoneNumber: '99 999999999',
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The customer was successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request. The customer could not be created.',
  })
  @ApiResponse({
    status: 422,
    description:
      'Unprocessable Entity. Validation failed for the provided data.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  async create(
    @Body() customer: CustomerRequestDTO,
  ): Promise<CustomerResponseDTO> {
    return await this.customerService.create(customer);
  }
}
