'use client';
import type { Order } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, Coffee } from 'lucide-react';
import { useRef } from 'react';

type BillDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  order: Order;
};

export function BillDialog({ isOpen, onOpenChange, order }: BillDialogProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = printRef.current;
    if (printContent) {
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // To re-attach event listeners etc.
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <div ref={printRef}>
          <DialogHeader>
            <DialogTitle className="flex flex-col items-center text-center">
              <Coffee className="h-8 w-8 mb-2 text-primary" />
              BrewFlow
              <span className="text-sm font-normal text-muted-foreground mt-1">
                Thank you for your order!
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Order #{order.orderNumber}</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
            <div className="border-t my-4 border-dashed" />
            <div className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div>
                    <p>{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                  </div>
                  <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t my-4 border-dashed" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
