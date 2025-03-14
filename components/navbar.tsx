"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Search, Menu, X, Heart, User, LogOut, ShoppingBasket, ChevronDown, Percent } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartSheet } from "@/components/cart-sheet";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const categories = [
    { name: "Bolsos de Mano", href: "/category/bolsos-de-mano", className: "", icon: null },
    { name: "Bolsos de Hombro", href: "/category/bolsos-de-hombro", className: "", icon: null },
    { name: "Mochilas Elegantes", href: "/category/mochilas-elegantes", className: "", icon: null },
    { name: "Novedades", href: "/category/carteras-de-fiesta", className: "", icon: null },
    { name: "Ofertas", href: "/category/ofertas", className: "text-pink-600 font-semibold", icon: <Percent className="h-4 w-4 text-pink-600" /> }
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Top announcement bar */}
      <div className="bg-pink-100 text-pink-800 py-2 text-center text-sm font-medium">
        Free shipping on orders over $100 | Use code ELEGANCE for 15% off
      </div>

      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <ShoppingBag className="h-6 w-6 text-pink-600 mr-2" />
            <span className="text-xl font-bold tracking-tight">Elegance</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors">
                Categorías <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link href={category.href} className={`flex items-center justify-between w-full ${category.className || ''}`}>
                      {category.name}
                      {category.icon}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors flex items-center gap-1 ${category.className}`}
              >
                {category.name}
                {category.icon}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-700 hover:text-pink-600 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="text-gray-700 hover:text-pink-600 transition-colors hidden sm:block"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Account Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {session ? (
                  <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || `https://ui-avatars.com/api/?name=${session.user?.name}`} alt={session.user?.name || ""} />
                      <AvatarFallback>{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              {session ? (
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="flex items-center">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Productos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mi Cuenta</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="flex items-center">
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Mis Favoritos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center">
                      <ShoppingBasket className="mr-2 h-4 w-4" />
                      <span>Mis Compras</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center text-red-600 focus:text-red-600"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Iniciar Sesión</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup" className="flex items-center text-pink-600">
                      <User className="mr-2 h-4 w-4" />
                      <span>Crear Cuenta</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>

            {/* Cart */}
            <CartSheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingBag className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
            </CartSheet>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Collapsible
                open={isCategoriesOpen}
                onOpenChange={setIsCategoriesOpen}
                className="space-y-2"
              >
                <CollapsibleTrigger asChild>
                  <button className="flex items-center justify-between w-full px-2 py-1.5 text-sm font-medium text-gray-900">
                    <span>Categorías</span>
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCategoriesOpen ? 'transform rotate-180' : ''}`} />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-1">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className={`block text-sm text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors px-4 py-1.5 rounded flex items-center justify-between ${category.className || ''}`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsCategoriesOpen(false);
                      }}
                    >
                      {category.name}
                      {category.icon}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
              
              <Link
                href="/new-arrivals"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Novedades
              </Link>
              <Link
                href="/sale"
                className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Ofertas
              </Link>
            </nav>
          </div>
        )}

        {/* Search bar */}
        {isSearchOpen && (
          <div className="py-4 border-t border-gray-200">
            <div className="flex items-center">
              <Input
                type="search"
                placeholder="Search for bags..."
                className="flex-1"
              />
              <Button className="ml-2 bg-pink-600 hover:bg-pink-700">
                Search
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}