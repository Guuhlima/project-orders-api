// src/products/types/products.schemas.ts
import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(2, 'name deve ter ao menos 2 caracteres.'),
  price: z.number().finite().positive('price deve ser maior que 0.'),
  description: z.string().trim().optional(),
  isActive: z.boolean().optional(),
});

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(2, 'name deve ter ao menos 2 caracteres.').optional(),
    price: z.number().finite().positive('price deve ser maior que 0.').optional(),
    description: z.string().trim().optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Envie ao menos um campo para atualizar.',
  });

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
