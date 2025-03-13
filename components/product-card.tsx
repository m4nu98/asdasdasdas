"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-provider";
import { formatCurrency } from "@/lib/utils";

export type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  colors: string[];
  isNew?: boolean;
  isSale?: boolean;
};

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group">
      <div
        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={`/product/${product.id}`}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Quick add button */}
        <div
          className={`absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3 transition-transform duration-300 ${
            isHovered ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <Button
            onClick={handleAddToCart}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>

        {/* Wishlist button */}
        <button
          className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4 text-gray-600" />
        </button>

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
              New
            </span>
          )}
          {product.isSale && (
            <span className="bg-pink-600 text-white text-xs font-medium px-2 py-1 rounded">
              {discount}% Off
            </span>
          )}
        </div>
      </div>

      <div>
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-medium text-gray-900 mb-1">{product.name}</h3>
        </Link>

        <div className="flex items-center mb-2">
          <p className="font-medium text-gray-900">{formatCurrency(product.price)}</p>
          {product.originalPrice && (
            <p className="ml-2 text-sm text-gray-500 line-through">
              {formatCurrency(product.originalPrice)}
            </p>
          )}
        </div>

        {/* Color options */}
        <div className="flex gap-1">
          {product.colors.map((color) => (
            <button
              key={color}
              className={`w-4 h-4 rounded-full border ${
                selectedColor === color ? "ring-2 ring-offset-1 ring-gray-400" : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
              aria-label={`Select ${color} color`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}