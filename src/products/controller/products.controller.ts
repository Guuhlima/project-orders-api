import { Controller, Post, Delete, Get, Patch, Body, Param } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { CreateProductDTO, UpdateProductDTO } from '../types/products.types';

@Controller('products')
export class ProductsController {
    constructor(private readonly service: ProductsService) {}

    @Post()
    async create(@Body() body: CreateProductDTO) {
        const result = await this.service.create(body);
        return { message: "Produto criado com sucesso", ...result };
    }

    @Get()
    async findAll() {
        const result = await this.service.findAll();
        return { message: "Produtos encontrados", ...result }
    }

    @Get(':id') 
    async findById(@Param('id') id: string) {
        const result = await this.service.findById(id);
        return { message: 'Produto encontrado com sucesso', ...result };
    }

    @Delete('id')
    async delete(@Param('id') id: string) {
        const result = await this.service.delete(id);
        return { message: 'Produto removido com sucesso', ...result };
    }

    @Patch('id')
    async update(@Param('id') id: string, @Body() body: UpdateProductDTO) {
        const result = await this.service.update(id, body);
        return { message: 'Produto atualizado com sucesso', ...result };
    }
}
