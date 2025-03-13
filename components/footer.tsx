import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        {/* Newsletter */}
        <div className="max-w-xl mx-auto text-center mb-12">
          <h3 className="text-2xl font-bold mb-2">Join Our Newsletter</h3>
          <p className="text-gray-600 mb-4">
            Subscribe to get special offers, free giveaways, and exclusive deals.
          </p>
          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-1"
            />
            <Button className="bg-pink-600 hover:bg-pink-700">Subscribe</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Shop */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Shop
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/new-arrivals"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/category/bestsellers"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link
                  href="/category/tote-bags"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Tote Bags
                </Link>
              </li>
              <li>
                <Link
                  href="/category/crossbody"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Crossbody
                </Link>
              </li>
              <li>
                <Link
                  href="/category/sale"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Sale
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Help
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/customer-service"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Customer Service
                </Link>
              </li>
              <li>
                <Link
                  href="/track-order"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              About
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/sustainability"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Sustainability
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-pink-600 text-sm"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex space-x-4 mb-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <p className="text-sm text-gray-600">
              Customer Service: <br />
              <a href="tel:+18001234567" className="hover:text-pink-600">
                1-800-123-4567
              </a>
              <br />
              <a href="mailto:hello@elegancebags.com" className="hover:text-pink-600">
                hello@elegancebags.com
              </a>
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Elegance Bags. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-pink-600">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-sm text-gray-600 hover:text-pink-600">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="text-sm text-gray-600 hover:text-pink-600">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}