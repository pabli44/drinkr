// ─── Product models ─────────────────────────────────────────────────────────

export type Presentation = "SIXPACK" | "BOTTLE" | "CAN" | "SINGLE";

export interface Category {
  id: string;
  name: string;
  icon?: string | null;
  order: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  categoryId: string;
  presentation: Presentation;
  regularPrice: number;
  promoPrice: number;
  stock: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}

// ─── Cart ───────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}
