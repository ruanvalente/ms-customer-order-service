export class OrderItemResponseDTO {
	id: number;
	productId: number;
	quantity: number;
	unitPrice: number;
}
export class OrderResponseDTO {
	id: number;
	clientId: number;
	status: string;
	createdAt: Date;
	items: OrderItemResponseDTO[];
}
