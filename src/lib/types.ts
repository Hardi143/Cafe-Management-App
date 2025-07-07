export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Coffee' | 'Tea' | 'Pastries' | 'Sandwiches';
  imageUrl: string;
  customizations?: {
    name: string;
    options: { name: string; priceModifier: number }[];
  }[];
};

export type CartItem = {
  id: string; // unique cart item id
  menuItem: MenuItem;
  quantity: number;
  customizations: { [key: string]: string };
  unitPrice: number;
  totalPrice: number;
}

export type OrderItem = {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  customizations?: { [key: string]: string };
};

export type Order = {
  id: string;
  orderNumber: number;
  items: OrderItem[];
  total: number;
  status: 'Received' | 'Preparing' | 'Ready for Pickup';
  createdAt: string; // ISO string
};
