'use client';

import { useState } from 'react';
import type { MenuItem } from '@/lib/types';
import Image from 'next/image';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { MenuItemDialog } from './menu-item-dialog';

export default function MenuTable({ initialItems }: { initialItems: MenuItem[] }) {
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleAddItem = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };
  
  const handleSaveItem = (itemData: MenuItem) => {
    if (selectedItem) {
        setItems(items.map(item => item.id === itemData.id ? itemData : item));
    } else {
        setItems([...items, { ...itemData, id: `item-${Date.now()}` }]);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Menu Items</CardTitle>
          <CardDescription>
            Manage your cafe's menu items here. Add, edit, or delete them as needed.
          </CardDescription>
          <div className="text-right">
            <Button onClick={handleAddItem}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Description</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map(item => (
                <TableRow key={item.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt={item.name}
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={item.imageUrl}
                      width="64"
                      data-ai-hint="coffee pastry sandwich"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs truncate">
                    {item.description}
                  </TableCell>
                  <TableCell>RS {item.price.toFixed(2)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEditItem(item)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteItem(item.id)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <MenuItemDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
        onSave={handleSaveItem}
      />
    </>
  );
}
