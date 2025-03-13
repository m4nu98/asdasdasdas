import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative bg-pink-50 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Elegance in <span className="text-pink-600">Every Detail</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto md:mx-0">
              Discover our new collection of luxury handbags designed for the modern woman. Timeless style meets practical elegance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-6">
                <Link href="/category/new-arrivals">Shop New Arrivals</Link>
              </Button>
              <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50 px-8 py-6">
                <Link href="/collections">Explore Collections</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1559563458-527698bf5295?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Luxury handbag collection"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg hidden md:block">
              <p className="font-medium">Summer Collection</p>
              <p className="text-sm text-gray-500">New arrivals weekly</p>
            </div>
            
            <div className="absolute -top-6 -right-6 bg-pink-600 text-white p-4 rounded-full shadow-lg hidden md:flex items-center justify-center">
              <div className="text-center">
                <p className="font-bold text-xl">20%</p>
                <p className="text-xs">OFF</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-0 w-24 h-24 bg-pink-200 rounded-full opacity-50 -translate-x-1/2"></div>
      <div className="absolute bottom-1/4 right-0 w-32 h-32 bg-pink-200 rounded-full opacity-50 translate-x-1/2"></div>
    </section>
  );
}