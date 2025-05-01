import { InventoryStatus } from '../../enum/inventory.status';

export class InventoryResponseDTO {
	status: InventoryStatus;
	message: string;
	data: any;
}
