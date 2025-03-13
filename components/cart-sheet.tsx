"use client";

import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart, CartItem } from "@/components/cart-provider";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export function CartSheet({ children }: { children: React.ReactNode }) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  return (
    <Sheet>
      {children}
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart ({totalItems})</SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="text-6xl">🛍️</div>
            <p className="text-muted-foreground text-center">
              Your cart is empty. Add some beautiful bags!
            </p>
            <Button asChild className="bg-pink-600 hover:bg-pink-700">
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-6">
                {items.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    onRemove={() => removeItem(item.id)}
                    onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity)}
                  />
                ))}
              </ul>
            </div>
            
            <div className="space-y-4 pt-4">
              <Separator />
              
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-medium">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Shipping</span>
                  <span className="text-sm font-medium">Calculated at checkout</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              
              <SheetFooter className="flex flex-col gap-2 sm:flex-col">
                <Button className="w-full bg-pink-600 hover:bg-pink-700">
                  Checkout
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">Continue Shopping</Link>
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function CartItem({ 
  item, 
  onRemove, 
  onUpdateQuantity 
}: { 
  item: CartItem; 
  onRemove: () => void; 
  onUpdateQuantity: (quantity: number) => void;
}) {
  return (
    <li className="flex gap-4">
      <div className="relative h-24 w-24 rounded-md overflow-hidden bg-muted">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="font-medium text-sm">{item.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{formatCurrency(item.price)}</p>
          </div>
          <button onClick={onRemove} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex items-center mt-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none"
              onClick={() => onUpdateQuantity(item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="ml-auto font-medium">
            {formatCurrency(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </li>
  );
}