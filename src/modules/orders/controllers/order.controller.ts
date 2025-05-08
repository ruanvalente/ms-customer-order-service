import {
	Body,
	Controller,
	Get,
	Param,
	ParseIntPipe,
	Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { OrderRequestDTO } from '../entities/dto/request/order.request.dto';
import { OrderResponseDTO } from '../entities/dto/response/order.response.dto';
import { OrderService } from '../services/order.service';

@Controller('api/v1/order')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get()
	@ApiOperation({ summary: 'List all orders' })
	@ApiResponse({
		status: 200,
		description: 'List all orders',
		type: [OrderResponseDTO],
	})
	async findAll(): Promise<OrderResponseDTO[]> {
		return await this.orderService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get order by ID' })
	@ApiResponse({
		status: 200,
		description: 'Get order by ID',
		type: OrderResponseDTO,
	})
	@ApiParam({
		name: 'id',
		description: 'Order ID',
		required: true,
		type: 'integer',
	})
	async findById(@Param('id') id: string): Promise<OrderResponseDTO> {
		return await this.orderService.findById(Number(id));
	}

	@Post()
	@ApiOperation({ summary: 'Create a new order' })
	@ApiBody({
		schema: {
			example: {
				clientId: 1,
				items: [
					{
						productId: 123,
						quantity: 2,
						unitPrice: 49.9,
					},
					{
						productId: 456,
						quantity: 1,
						unitPrice: 199.0,
					},
				],
			},
		},
	})
	@ApiResponse({
		status: 201,
		description: 'The order was successfully created.',
		type: OrderResponseDTO,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request. The order could not be created.',
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
	async create(@Body() order: OrderRequestDTO): Promise<OrderResponseDTO> {
		return await this.orderService.create(order);
	}

	@ApiOperation({ summary: 'Validate an existing order' })
	@ApiParam({
		name: 'id',
		description: 'Order ID to validate',
		required: true,
		type: 'integer',
	})
	@ApiResponse({
		status: 200,
		description: 'Order validated successfully',
		type: OrderResponseDTO,
	})
	@ApiResponse({
		status: 400,
		description: 'Bad Request - Invalid order status or validation failed',
	})
	@ApiResponse({
		status: 404,
		description: 'Order not found',
	})
	@ApiResponse({
		status: 500,
		description: 'Internal server error during validation process',
	})
	@Post(':id/validate')
	async validateOrder(
		@Param('id', ParseIntPipe) id: number,
	): Promise<OrderResponseDTO> {
		return this.orderService.validateOrder(id);
	}
}
