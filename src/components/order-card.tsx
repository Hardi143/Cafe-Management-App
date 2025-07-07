'use client';

import { useState } from 'react';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, MoveRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { BillDialog } from './bill-dialog';

type OrderCardProps = {
  order: Order;
  onStatusChange: (orderId: string, newStatus: Order['status']) => void;
};

export default function OrderCard({ order, onStatusChange }: OrderCardProps) {
    const [isBillOpen, setIsBillOpen] = useState(false);

    const handleNextStatus = () => {
        if (order.status === 'Received') {
            onStatusChange(order.id, 'Preparing');
        } else if (order.status === 'Preparing') {
            onStatusChange(order.id, 'Ready for Pickup');
        }
    };

    const timeAgo = formatDistanceToNow(new Date(order.createdAt), { addSuffix: true });

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-lg">
            <span>Order #{order.orderNumber}</span>
            <span className="text-sm font-normal text-muted-foreground">{timeAgo}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
            <ul className="space-y-2 text-sm">
                {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                        <span>{item.quantity}x {item.name}</span>
                        <span>₹{(item.quantity * item.unitPrice).toFixed(2)}</span>
                    </li>
                ))}
            </ul>
            <div className="border-t my-2" />
            <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
            </div>
        </CardContent>
        <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={() => setIsBillOpen(true)}>
                <Printer className="mr-2 h-4 w-4" />
                Print Bill
            </Button>
            {order.status !== 'Ready for Pickup' && (
                <Button size="sm" onClick={handleNextStatus}>
                    Next
                    <MoveRight className="ml-2 h-4 w-4" />
                </Button>
            )}
        </CardFooter>
      </Card>
      <BillDialog order={order} isOpen={isBillOpen} onOpenChange={setIsBillOpen} />
    </>
  );
}
