import type { MenuItem, Order } from './types';

export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Espresso',
    description: 'A rich and aromatic shot of pure coffee essence, the perfect pick-me-up.',
    price: 250.00,
    category: 'Coffee',
    imageUrl: 'https://placehold.co/300x200.png',
    customizations: [
      {
        name: 'Size',
        options: [
          { name: 'Single', priceModifier: 0 },
          { name: 'Double', priceModifier: 80.00 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Caramel Latte',
    description: 'Smooth espresso and steamed milk, sweetened with a swirl of buttery caramel.',
    price: 350.00,
    category: 'Coffee',
    imageUrl: 'https://placehold.co/300x200.png',
    customizations: [
        {
            name: "Size",
            options: [
                { name: "Small", priceModifier: 0 },
                { name: "Medium", priceModifier: 40 },
                { name: "Large", priceModifier: 80 },
            ]
        },
        {
            name: "Milk",
            options: [
                { name: "Whole Milk", priceModifier: 0 },
                { name: "Oat Milk", priceModifier: 60 },
                { name: "Almond Milk", priceModifier: 60 },
            ]
        }
    ]
  },
  {
    id: '3',
    name: 'Chocolate Croissant',
    description: 'A flaky, buttery croissant with a rich, dark chocolate center.',
    price: 280.00,
    category: 'Pastries',
    imageUrl: 'https://placehold.co/300x200.png',
  },
  {
    id: '4',
    name: 'Earl Grey Tea',
    description: 'A classic black tea infused with the fragrant essence of bergamot orange.',
    price: 200.00,
    category: 'Tea',
    imageUrl: 'https://placehold.co/300x200.png',
    customizations: [
        {
            name: "Size",
            options: [
                { name: "Small", priceModifier: 0 },
                { name: "Large", priceModifier: 40 },
            ]
        }
    ]
  },
  {
    id: '5',
    name: 'Turkey Club',
    description: 'Roasted turkey, crispy bacon, lettuce, and tomato on toasted sourdough.',
    price: 550.00,
    category: 'Sandwiches',
    imageUrl: 'https://placehold.co/300x200.png',
  },
];

export const orders: Order[] = [
  {
    id: 'ORD-1',
    orderNumber: 101,
    items: [
      { menuItemId: '1', name: 'Classic Espresso', quantity: 1, unitPrice: 250.00, customizations: { Size: 'Double' } },
      { menuItemId: '3', name: 'Chocolate Croissant', quantity: 1, unitPrice: 280.00 },
    ],
    total: 530.00,
    status: 'Received',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'ORD-2',
    orderNumber: 102,
    items: [{ menuItemId: '2', name: 'Caramel Latte', quantity: 2, unitPrice: 350.00, customizations: { Size: 'Large', Milk: 'Oat Milk' } }],
    total: 700.00,
    status: 'Preparing',
    createdAt: new Date(Date.now() - 3 * 60000).toISOString(),
  },
  {
    id: 'ORD-3',
    orderNumber: 103,
    items: [{ menuItemId: '4', name: 'Earl Grey Tea', quantity: 1, unitPrice: 200.00 }],
    total: 200.00,
    status: 'Ready for Pickup',
    createdAt: new Date(Date.now() - 1 * 60000).toISOString(),
  },
];

// Simulate fetching data
export const getMenuItems = async (): Promise<MenuItem[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(menuItems), 500));
};

export const getOrders = async (): Promise<Order[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(orders), 500));
};
