'use client';
import { useState, useMemo } from 'react';
import type { MenuItem, CartItem } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CustomerMenu({ menuItems, tableId }: { menuItems: MenuItem[]; tableId: string }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (menuItem: MenuItem) => {
    const existingItem = cart.find(item => item.menuItem.id === menuItem.id);
    if (existingItem) {
      updateQuantity(existingItem.id, 1);
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
    toast({ title: "Added to cart", description: `${menuItem.name} was added to your order.` });
  };

  const updateQuantity = (cartItemId: string, change: 1 | -1) => {
    setCart(currentCart => {
      const itemToUpdate = currentCart.find(item => item.id === cartItemId);
      if (!itemToUpdate) return currentCart;

      const newQuantity = itemToUpdate.quantity + change;
      if (newQuantity <= 0) {
        return currentCart.filter(item => item.id !== cartItemId);
      }
      return currentCart.map(item => item.id === cartItemId ? { ...item, quantity: newQuantity, totalPrice: newQuantity * item.unitPrice } : item);
    });
  };
  
  const placeOrder = () => {
    console.log("Placing order for table:", tableId, cart);
    toast({ title: "Order Placed!", description: "Your order has been sent to the kitchen." });
    setCart([]);
  }

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.totalPrice, 0), [cart]);
  const cartItemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Menu</h1>
          <p className="text-muted-foreground">Select items to add to your order.</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <ShoppingCart className="mr-2 h-5 w-5" />
              My Order
              {cartItemCount > 0 && <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">{cartItemCount}</span>}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Your Order for Table {tableId}</SheetTitle>
            </SheetHeader>
            <div className="py-4 h-[calc(100vh-150px)] overflow-y-auto">
                {cart.length === 0 ? <p className="text-muted-foreground">Your cart is empty.</p> :
                <div className="space-y-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between items-start">
                            <div className="flex gap-4">
                                <Image src={item.menuItem.imageUrl} alt={item.menuItem.name} width={64} height={64} className="rounded-md w-16 h-16 object-cover" data-ai-hint="coffee pastry"/>
                                <div>
                                    <p className="font-semibold">{item.menuItem.name}</p>
                                    <p className="text-sm text-muted-foreground">${item.unitPrice.toFixed(2)}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.id, -1)}>
                                            {item.quantity === 1 ? <Trash2 className="h-3 w-3 text-destructive" /> : <Minus className="h-3 w-3" />}
                                        </Button>
                                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateQuantity(item.id, 1)}>
                                            <Plus className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <p className="font-semibold">${item.totalPrice.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                }
            </div>
            <SheetFooter className="absolute bottom-0 right-0 left-0 p-4 border-t bg-background">
                <div className="w-full space-y-4">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <Button className="w-full" size="lg" onClick={placeOrder} disabled={cart.length === 0}>
                        Place Order
                    </Button>
                </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col group">
            <div className="relative">
              <Image src={item.imageUrl} alt={item.name} width={400} height={250} className="w-full h-48 object-cover" data-ai-hint="coffee pastry sandwich tea"/>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground flex-1 mt-1">{item.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
                <Button variant="outline" size="sm" onClick={() => addToCart(item)}>
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
