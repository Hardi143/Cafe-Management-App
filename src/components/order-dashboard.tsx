'use client';
import { useState } from 'react';
import type { Order, MenuItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import OrderCard from '@/components/order-card';
import { AddOrderDialog } from './add-order-dialog';

type OrderDashboardProps = {
  initialOrders: Order[];
  menuItems: MenuItem[];
};

const OrderColumn = ({ title, orders, onStatusChange }: { title: string; orders: Order[]; onStatusChange: (orderId: string, newStatus: Order['status']) => void; }) => (
  <div className="flex-1 rounded-lg border bg-card text-card-foreground shadow-sm">
    <div className="p-4 border-b">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
    </div>
    <div className="p-4 space-y-4 h-[calc(100vh-220px)] overflow-y-auto">
      {orders.length > 0 ? (
        orders.map((order) => (
          <OrderCard key={order.id} order={order} onStatusChange={onStatusChange} />
        ))
      ) : (
        <p className="text-muted-foreground text-sm">No orders in this stage.</p>
      )}
    </div>
  </div>
);


export default function OrderDashboard({ initialOrders, menuItems }: OrderDashboardProps) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [isAddOrderDialogOpen, setIsAddOrderDialogOpen] = useState(false);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleAddOrder = (newOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => {
    const newFullOrder: Order = {
      ...newOrder,
      id: `ORD-${Date.now()}`,
      orderNumber: Math.max(...orders.map(o => o.orderNumber), 0) + 1,
      createdAt: new Date().toISOString(),
      status: 'Received',
    };
    setOrders(prev => [newFullOrder, ...prev]);
  };

  const orderStatuses: Order['status'][] = ['Received', 'Preparing', 'Ready for Pickup'];

  return (
    <div className="flex flex-col w-full">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold tracking-tight">Order Dashboard</h1>
            <Button onClick={() => setIsAddOrderDialogOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Order
            </Button>
        </div>
      <div className="flex gap-6">
        {orderStatuses.map((status) => (
          <OrderColumn
            key={status}
            title={status}
            orders={orders.filter((order) => order.status === status).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
      <AddOrderDialog
        isOpen={isAddOrderDialogOpen}
        onOpenChange={setIsAddOrderDialogOpen}
        menuItems={menuItems}
        onAddOrder={handleAddOrder}
      />
    </div>
  );
}
