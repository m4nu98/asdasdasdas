import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Emma Thompson",
    role: "Fashion Blogger",
    content: "The quality of these bags is exceptional. I've received so many compliments on my tote bag. It's spacious, stylish, and the leather is butter-soft.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: 2,
    name: "Sophia Chen",
    role: "Business Professional",
    content: "I needed a bag that could transition from office to evening events. My Elegance clutch is perfect - professional yet glamorous. The attention to detail is impressive.",
    rating: 5,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
  {
    id: 3,
    name: "Olivia Martinez",
    role: "Travel Enthusiast",
    content: "The crossbody bag has been my travel companion across 3 continents. It's durable, secure, and still looks brand new despite all our adventures together.",
    rating: 4,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
            >
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-gray-600">{testimonial.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}