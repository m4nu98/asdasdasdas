import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { CategoriesSection } from "@/components/categories-section";
import { FeaturedProducts } from "@/components/featured-products";
import { TestimonialsSection } from "@/components/testimonials-section";
import { FeaturesSection } from "@/components/features-section";
import { InstagramSection } from "@/components/instagram-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <CategoriesSection />
        <FeaturedProducts />
        <div className="py-16 bg-pink-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Luxury Meets Functionality</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Our bags are crafted with the finest materials and designed to complement your lifestyle.
              Each piece is a perfect blend of timeless elegance and modern practicality.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <img
                src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Luxury handbag"
                className="rounded-lg shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Designer purse"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
        <TestimonialsSection />
        <InstagramSection />
      </main>
      <Footer />
    </>
  );
}