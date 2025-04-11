import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, ValidateNested } from 'class-validator';

class CreateOrderItemDto {
	@IsInt()
	productId: number;

	@IsInt()
	quantity: number;

	@IsNumber()
	unitPrice: number;
}

export class OrderRequestDTO {
	@IsInt()
	clientId: number;

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateOrderItemDto)
	items: CreateOrderItemDto[];
}
