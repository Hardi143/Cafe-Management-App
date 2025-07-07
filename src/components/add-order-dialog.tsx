'use client';
import { useState, useMemo } from 'react';
import type { MenuItem, Order, CartItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Minus, Trash2 } from 'lucide-react';
import Image from 'next/image';

type AddOrderDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  menuItems: MenuItem[];
  onAddOrder: (newOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'status'>) => void;
};

export function AddOrderDialog({ isOpen, onOpenChange, menuItems, onAddOrder }: AddOrderDialogProps) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.menuItem.id === menuItem.id);
    if (existingItem) {
      setCart(cart.map(item => item.menuItem.id === menuItem.id ? { ...item, quantity: item.quantity + 1, totalPrice: (item.quantity + 1) * item.unitPrice } : item));
    } else {
      setCart([...cart, {
        id: `${menuItem.id}-${Date.now()}`,
        menuItem,
        quantity: 1,
        customizations: {},
        unitPrice: menuItem.price,
        totalPrice: menuItem.price
      }]);
    }
  };
  
  const updateQuantity = (cartItemId: string, change: 1 | -1) => {
    setCart(currentCart => {
        const itemToUpdate = currentCart.find(item => item.id === cartItemId);
        if(!itemToUpdate) return currentCart;

        const newQuantity = itemToUpdate.quantity + change;
        if (newQuantity <= 0) {
            return currentCart.filter(item => item.id !== cartItemId);
        }
        return currentCart.map(item => item.id === cartItemId ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice } : item);
    });
  };

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart]);

  const handleSubmit = () => {
    if (cart.length === 0) return;
    const newOrder = {
      items: cart.map(cartItem => ({
        menuItemId: cartItem.menuItem.id,
        name: cartItem.menuItem.name,
        quantity: cartItem.quantity,
        unitPrice: cartItem.unitPrice,
        customizations: cartItem.customizations
      })),
      total,
    };
    onAddOrder(newOrder);
    setCart([]);
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold mb-2">Menu</h3>
            <ScrollArea className="flex-1 pr-4">
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map(item => (
                  <Card key={item.id} className="overflow-hidden cursor-pointer hover:border-primary" onClick={() => addToCart(item)}>
                    <Image src={item.imageUrl} alt={item.name} width={300} height={200} className="w-full h-24 object-cover" data-ai-hint="coffee pastry" />
                    <div className="p-3">
                      <h4 className="font-semibold truncate">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div className="flex flex-col border-l pl-6">
            <h3 className="text-lg font-semibold mb-2">Current Order</h3>
            <ScrollArea className="flex-1 pr-4">
              {cart.length === 0 ? (
                <p className="text-muted-foreground mt-4">No items in order yet.</p>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold">{item.menuItem.name}</p>
                            <p className="text-sm text-muted-foreground">${item.unitPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                                {item.quantity === 1 ? <Trash2 className="h-3 w-3 text-destructive" /> : <Minus className="h-3 w-3" />}
                            </Button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                                <Plus className="h-3 w-3" />
                            </Button>
                            <span className="w-16 text-right font-medium">${item.totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between items-center text-xl font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={cart.length === 0}>Place Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Minimal Card component for layout above
const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props}>
        {children}
    </div>
);
