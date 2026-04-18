// components/pharmacy-staff/pos/ProductCard.tsx
"use client";

import Image from "next/image";
import type { POSProduct } from "@/types/pharmacy";

interface ProductCardProps {
  product: POSProduct;
  onAddToCart: (product: POSProduct) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  return (
    <article className="rounded-2xl border border-[#dce1ec] bg-white p-4">
      <div className="mb-3 grid h-[150px] place-items-center rounded-xl bg-[#f3f5fa]">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={120}
            height={120}
            className="h-[120px] w-auto object-contain"
          />
        ) : (
          <svg
            className="h-16 w-16 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        )}
      </div>

      <h3 className="min-h-[52px] text-base font-medium leading-snug text-[#1e2757]">
        {product.name}
      </h3>
      <p className="mt-2 text-lg font-semibold leading-none text-[#1b2554]">
        Rs. {product.price.toLocaleString("en-IN")}
      </p>

      <button
        onClick={() => onAddToCart(product)}
        className="mt-3 h-11 w-full rounded-[14px] bg-[#2a63ff] text-sm font-medium leading-none text-white shadow-[0_2px_8px_rgba(37,85,220,0.2)] transition-colors hover:bg-[#2054e7]"
      >
        Add to Cart
      </button>
    </article>
  );
}
