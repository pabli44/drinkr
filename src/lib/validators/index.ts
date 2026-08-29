import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      beerId: z.string(),
      quantity: z.number().positive("La cantidad debe ser mayor a 0"),
    })
  ).min(1, "Debe agregar al menos un item"),
  notes: z.string().optional(),
});

export const createBeerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  pricePerLiter: z.number().positive("El precio debe ser mayor a 0"),
  stockInLiters: z.number().min(0, "El stock no puede ser negativo"),
  imageUrl: z.string().url("URL inválida").optional(),
  isActive: z.boolean().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "PREPARING", "READY", "DELIVERED", "CANCELLED"]),
});
