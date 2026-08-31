export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CLIENT";
  phone?: string | null;
  address?: string | null;
}

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

// ─── Legacy (Beer Drop era) ─────────────────────────────────────────────────

export interface Beer {
  id: string;
  name: string;
  description?: string | null;
  pricePerLiter: number;
  stockInLiters: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  stripeSessionId?: string | null;
  notes?: string | null;
  createdAt: Date;
  paidAt?: Date | null;
  preparedAt?: Date | null;
  deliveredAt?: Date | null;
  items?: OrderItem[];
  user?: User;
}

export interface OrderItem {
  id: string;
  orderId: string;
  beerId: string;
  quantity: number;
  unitPrice: number;
  beer?: Beer;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

// ─── Cart ───────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}
