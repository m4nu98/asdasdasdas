import Link from "next/link";

const categories = [
  {
    name: "Tote Bags",
    image: "https://images.unsplash.com/photo-1590739225287-bd31519780c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/category/tote-bags",
  },
  {
    name: "Crossbody",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/category/crossbody",
  },
  {
    name: "Clutches",
    image: "https://images.unsplash.com/photo-1563904092230-7ec217b65fe2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/category/clutches",
  },
  {
    name: "Backpacks",
    image: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    href: "/category/backpacks",
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Shop by Category</h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Find the perfect bag for every occasion. From everyday essentials to statement pieces.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative overflow-hidden rounded-lg"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <h3 className="text-white text-xl font-medium">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}