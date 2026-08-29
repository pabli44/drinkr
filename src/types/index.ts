export interface User {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "CLIENT";
  phone?: string | null;
  address?: string | null;
}

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

export interface CartItem {
  beerId: string;
  beer: Beer;
  quantity: number;
}
