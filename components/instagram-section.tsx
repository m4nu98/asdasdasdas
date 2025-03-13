import Link from "next/link";
import { Instagram } from "lucide-react";

const instagramPosts = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    link: "https://instagram.com",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    link: "https://instagram.com",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    link: "https://instagram.com",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    link: "https://instagram.com",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1601369850155-829d64fb7c16?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    link: "https://instagram.com",
  },
];

export function InstagramSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-12">
          <Instagram className="h-6 w-6 text-pink-600 mr-2" />
          <h2 className="text-3xl font-bold">Follow Us on Instagram</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={post.image}
                alt="Instagram post"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </a>
          ))}
        </div>
        
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">
            Tag your photos with <span className="font-medium">#EleganceBags</span> for a chance to be featured
          </p>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 font-medium hover:text-pink-700 transition-colors"
          >
            @elegancebags
          </Link>
        </div>
      </div>
    </section>
  );
}