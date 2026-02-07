export interface Product {
  id: string;
  name: string;
  designer: string;
  price: number;
  priceFormatted: string;
  description: string;
  model: string;
  color: string;
  category: "sneaker" | "apparel" | "accessory";
  badge?: string;
  trend?: string;
  sizes: number[];
  stock: Record<number, number>;
  details?: {
    material: string;
    origin: string;
    weight: string;
    technology: string;
  };
  images?: string[];
  releaseDate?: string;
  isLimited?: boolean;
  discount?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size: number;
  colorVariant?: string;
  addedAt: number;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  lastAdded: CartItem | null;
}

export interface ShippingAddress {
  id?: string;
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "credit_card" | "pix" | "boleto";
  status:
    | "pending"
    | "paid"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  total: number;
  shipping: number;
  discount: number;
  createdAt: number;
  trackingCode?: string;
}

export type PaymentMethod = "credit_card" | "pix" | "boleto";

export interface CheckoutFormData {
  email: string;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  cardDetails?: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  };
  installments: number;
  discountCode?: string;
}

export const SNEAKER_SIZES = [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];

export const SIZE_CONVERSION: Record<
  number,
  { us: string; uk: string; cm: number }
> = {
  37: { us: "5", uk: "4", cm: 23.5 },
  38: { us: "6", uk: "5", cm: 24.0 },
  39: { us: "6.5", uk: "5.5", cm: 24.5 },
  40: { us: "7.5", uk: "6.5", cm: 25.0 },
  41: { us: "8", uk: "7", cm: 25.5 },
  42: { us: "8.5", uk: "7.5", cm: 26.0 },
  43: { us: "9.5", uk: "8.5", cm: 26.5 },
  44: { us: "10", uk: "9", cm: 27.0 },
  45: { us: "11", uk: "10", cm: 27.5 },
  46: { us: "11.5", uk: "10.5", cm: 28.0 },
  47: { us: "12.5", uk: "11.5", cm: 28.5 },
};
