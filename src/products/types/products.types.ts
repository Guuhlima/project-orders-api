export class CreateProductDTO {
    name: string;
    price: number;
    description?: string;
    isActive?: boolean;
}

export class UpdateProductDTO {
    name?: string;
    price?: number;
    description?: string;
    isActive?: boolean;
}