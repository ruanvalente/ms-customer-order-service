import {
	OrderItemResponseDTO,
	OrderResponseDTO,
} from '../dto/response/order.response.dto';
import { OrderItem } from '../order-item.entity';
import { Orders } from '../orders.entity';

export class OrderResponseMapper {
	private static mapItem(this: void, item: OrderItem): OrderItemResponseDTO {
		return {
			id: item.id,
			productId: item.productId,
			quantity: item.quantity,
			unitPrice: item.unitPrice,
		};
	}

	static toDTO(order: Orders): OrderResponseDTO {
		return {
			id: order.id,
			clientId: order.clientId,
			status: order.status,
			createdAt: order.createdAt,
			items: order.items?.map(this.mapItem) ?? [],
		};
	}
}
