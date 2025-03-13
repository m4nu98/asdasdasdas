import { ProductCard, Product } from "@/components/product-card";

const featuredProducts: Product[] = [
  {
    id: "1",
    name: "Elegance Tote Bag",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    colors: ["#D4A373", "#000000", "#FFFFFF"],
    isNew: true,
  },
  {
    id: "2",
    name: "Chic Crossbody Bag",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    colors: ["#E9EDC9", "#CCD5AE", "#000000"],
    isSale: true,
  },
  {
    id: "3",
    name: "Luxe Leather Clutch",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    colors: ["#FAEDCD", "#000000", "#D6CCC2"],
  },
  {
    id: "4",
    name: "Mini Shoulder Bag",
    price: 79.99,
    originalPrice: 99.99,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    colors: ["#E3D5CA", "#D5BDAF", "#000000"],
    isSale: true,
  },
  {
    id: "5",
    name: "Everyday Backpack",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    colors: ["#000000", "#D6CCC2", "#EDEDE9"],
    isNew: true,
  },
  {
    id: "6",
    name: "Structured Handbag",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    colors: ["#D4A373", "#E9EDC9", "#FEFAE0"],
  },
  {
    id: "7",
    name: "Quilted Chain Bag",
    price: 119.99,
    originalPrice: 149.99,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    colors: ["#000000", "#FFFFFF", "#D6CCC2"],
    isSale: true,
  },
  {
    id: "8",
    name: "Bucket Bag",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1601369850155-829d64fb7c16?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    colors: ["#CCD5AE", "#E9EDC9", "#FEFAE0"],
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}