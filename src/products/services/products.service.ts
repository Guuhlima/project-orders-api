import {
    BadRequestException,
    Injectable,
    NotFoundException
} from '@nestjs/common'
import { PrismaService } from 'src/lib/prisma'
import { CreateProductDTO, UpdateProductDTO } from '../types/products.types'
import { ZodError } from 'zod'
import { createProductSchema, CreateProductInput, UpdateProductInput, updateProductSchema } from '../schemas/products.schema'

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: CreateProductDTO) {
        const parsed = this.parseOrThrow<CreateProductDTO>(createProductSchema, data);

        const product = await this.prisma.products.create({
            data: {
                name: parsed.name,
                price: parsed.price,
                description: parsed.description,
                isActive: parsed.isActive ?? true,
            }
        });

        return { product };
    }

    async findAll() {
        const product  = await this.prisma.products.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' },
        });

        return { product };
    }

    async findById(id: string) {
        const product = await this.prisma.products.findUnique({ where: { id } });
        if (!product) throw new NotFoundException('Produto não encontrado')

        return { product };
    }

    async update(id: string, data: UpdateProductDTO) {
        const existing = await this.prisma.products.findUnique({ where: {id} });
        if (!existing) throw new NotFoundException('Produto não encontrado')

        const parsed = this.parseOrThrow<UpdateProductInput>(updateProductSchema, data)

        const product = await this.prisma.products.update({
            where: { id },
            data: {
                name: parsed.name,
                price: parsed.price,
                description: parsed.description,
                isActive: parsed.isActive,
            }
        });

        return { product }
    }

    async delete(id: string) {
        const existing = await this.prisma.products.findUnique({ where: {id} });
        if (!existing) throw new NotFoundException('Produto não encontrado')

        const product = await this.prisma.products.update({
            where: { id },
            data: { isActive: true}
        });

        return { product };
    }

    private parseOrThrow<T>(schema: { parse: (input: unknown) => T }, input: unknown): T {
        try {
            return schema.parse(input);
        } catch (error) {
        if (error instanceof ZodError) {
            const msg = error.issues.map((i) => i.message).join(' | ');
            throw new BadRequestException(msg);
        }
            throw error;
        }
    }
}