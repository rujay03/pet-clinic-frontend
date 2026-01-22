// components/pharmacy-staff/pos/ProductCard.tsx
"use client";

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
    <button
      onClick={() => onAddToCart(product)}
      className="bg-white rounded-lg p-4 border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Product Image */}
      <div className="bg-slate-50 rounded-lg h-40 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-32 w-auto object-contain"
          />
        ) : (
          <svg
            className="w-20 h-20 text-slate-300"
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

      {/* Product Info */}
      <div className="text-left">
        <h3 className="font-medium text-slate-900 mb-2 text-sm leading-tight">
          {product.name}
        </h3>
        <p className="text-slate-900 font-medium text-base">
          Rs. {product.price.toLocaleString("en-IN")}
        </p>
      </div>
    </button>
  );
}
