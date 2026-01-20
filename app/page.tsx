"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 5;

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-white rounded-full shadow-lg px-8 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl text-gray-900">
            Pet Care
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="#about"
              className="text-gray-700 hover:text-gray-900 text-sm"
            >
              About
            </Link>
            <Link
              href="#benefits"
              className="text-gray-700 hover:text-gray-900 text-sm"
            >
              Benefits
            </Link>
            <Link
              href="#contact"
              className="text-gray-700 hover:text-gray-900 text-sm"
            >
              Contact
            </Link>
            <Link
              href="/auth/login"
              className="px-6 py-2 rounded-full text-white text-sm font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: "#4F7FFF" }}
            >
              Pet Care Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gray-300 overflow-hidden">
        <Image
          src="/hero-image.jpg"
          alt="Woman with her pet dog"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent">
          <div className="max-w-[1400px] mx-auto px-8 h-full flex items-center">
            <div className="max-w-xl">
              <h1 className="text-5xl font-bold text-white leading-tight">
                Ensuring your pets
                <br />
                live their best lives
              </h1>
            </div>
          </div>
        </div>
        {/* Carousel Dots */}
        <div className="absolute bottom-8 right-8 flex gap-2">
          {[...Array(totalSlides)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "bg-blue-600 w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Prioritizing your pet
                <br />
                companion
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At pawcare, our primary goal is to ensure that every pet we care
                for leads a happy, healthy life. We are dedicated to providing
                the highest standard of veterinary care, delivered with
                compassion and professionalism.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our team of experienced veterinarians and support staff work
                tirelessly to promote preventive care for your lovely pet,
                providing comprehensive treatments and supporting through all
                life stages.
              </p>
            </div>
            <div className="relative h-96">
              <Image
                src="/cat-image.jpg"
                alt="Cat companion"
                fill
                className="object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8">
          <h2 className="text-4xl font-bold mb-12 text-gray-900">BENEFITS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Professional Team Card */}
            <div className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer">
              <Image
                src="/professional-team.jpg"
                alt="Professional veterinary team"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="inline-block bg-white rounded-full px-6 py-3 text-sm font-medium text-gray-900">
                  Professional Team
                </span>
              </div>
            </div>

            {/* Treat with Love Card */}
            <div className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer">
              <Image
                src="/treat-with-love.jpg"
                alt="Treating pets with love"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="inline-block bg-white rounded-full px-6 py-3 text-sm font-medium text-gray-900">
                  Treat with ❤️
                </span>
              </div>
            </div>

            {/* Emergency Care Card */}
            <div className="relative h-80 rounded-3xl overflow-hidden group cursor-pointer">
              <Image
                src="/emergency-care.jpg"
                alt="Emergency care services"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="inline-block bg-white rounded-full px-6 py-3 text-sm font-medium text-gray-900">
                  Emergency Care
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-20"
        style={{ backgroundColor: "#1a2b5f" }}
      >
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-white">
                Our experts are
                <br />
                available for you 24/7
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  <span>62 21345 8888</span>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                  <div>
                    <div>62 21345 4444</div>
                    <div className="text-sm text-gray-300">
                      (Emergency Services)
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-5 h-5 text-red-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <span>mail@pawcare.com</span>
                </div>
              </div>
            </div>
            <div className="relative h-96">
              <div className="absolute inset-0 bg-gray-200 rounded-3xl overflow-hidden">
                <Image
                  src="/vet-expert.jpg"
                  alt="Veterinary expert"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Petcare Column */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Petcare</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Consultation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Pet Products
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Grooming
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-gray-900">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Stay Connected Column */}
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Stay Connected</h3>
              <p className="text-sm text-gray-600 mb-3">Contact</p>
              <p className="text-sm text-gray-600 mb-4">
                hi.pawcare@pawcare.com
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label="Facebook"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-700 transition-colors"
                  aria-label="Instagram"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="md:col-span-2">
              <h3 className="font-bold text-gray-900 mb-4">
                Join as pawfamily and get 10% OFF
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Our services are wide open for you
              </p>
              <button className="px-6 py-2 rounded-full border-2 border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors text-sm">
                Be Pawfamily
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
            <p>© Petcare.co</p>
            <Link href="#" className="hover:text-gray-900">
              Terms and Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
