import { Truck, RefreshCw, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Free shipping on all orders over $100",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "30-day hassle-free returns",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Your data is protected with us",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Customer service available anytime",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="bg-pink-100 p-3 rounded-full mb-4">
                <feature.icon className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="font-medium mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}