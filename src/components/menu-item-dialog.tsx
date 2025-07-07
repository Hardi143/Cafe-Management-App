'use client';
import { useState, useEffect, useTransition, useActionState } from 'react';
import type { MenuItem } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createAIDescription } from '@/app/actions';
import { Sparkles, LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

type MenuItemDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  item: MenuItem | null;
  onSave: (item: MenuItem) => void;
};

const initialState = {
  description: '',
  error: null,
};

export function MenuItemDialog({ isOpen, onOpenChange, item, onSave }: MenuItemDialogProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://placehold.co/300x200.png');
  const [ingredients, setIngredients] = useState('');
  const [style, setStyle] = useState('');

  const [aiState, formAction] = useActionState(createAIDescription, initialState);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPrice(item.price);
      setCategory(item.category);
      setDescription(item.description);
      setImageUrl(item.imageUrl)
    } else {
      setName('');
      setPrice(0);
      setCategory('');
      setDescription('');
      setImageUrl('https://placehold.co/300x200.png');
    }
    setIngredients('');
    setStyle('');
    aiState.description = '';
    aiState.error = null;
  }, [item, isOpen, aiState]);

  useEffect(() => {
    if (aiState.description) {
      setDescription(aiState.description);
    }
    if (aiState.error) {
        toast({
            variant: "destructive",
            title: "AI Error",
            description: "Could not generate description.",
        })
    }
  }, [aiState, toast]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave({
      id: item?.id || '',
      name,
      price,
      category,
      description,
      imageUrl
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price</Label>
            <Input id="price" type="number" value={price} onChange={e => setPrice(parseFloat(e.target.value))} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Input id="category" value={category} onChange={e => setCategory(e.target.value)} className="col-span-3" placeholder="e.g., Vadapav, Burger" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Image</Label>
            <div className="col-span-3 flex items-center gap-4">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={name || 'Menu item image'}
                  width={80}
                  height={80}
                  className="rounded-md object-cover aspect-square"
                  data-ai-hint="food image"
                />
              )}
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" />
          </div>

            <div className="space-y-4 rounded-lg border p-4">
                <div className="space-y-2">
                    <h4 className="font-semibold">AI Description Generator</h4>
                    <p className="text-sm text-muted-foreground">
                        Describe the ingredients and style, and let AI write the description for you.
                    </p>
                </div>
                <form action={(formData) => startTransition(() => formAction(formData))} className="space-y-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ingredients" className="text-right">Ingredients</Label>
                        <Input id="ingredients" name="ingredients" placeholder="e.g., potato, bun, spices" className="col-span-3" onChange={e => setIngredients(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="style" className="text-right">Style</Label>
                        <Input id="style" name="style" placeholder="e.g., Street food, spicy" className="col-span-3" onChange={e => setStyle(e.target.value)} />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" variant="outline" disabled={isPending || !ingredients || !style}>
                            {isPending ? (
                                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-4 w-4" />
                            )}
                            Generate with AI
                        </Button>
                    </div>
                </form>
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
