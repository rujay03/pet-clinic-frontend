// components/pharmacy-staff/pos/ShoppingCart.tsx
"use client";

import type { CartItem } from "@/types/pharmacy";

interface ShoppingCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function ShoppingCart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}: ShoppingCartProps) {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6 h-full flex flex-col">
      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto mb-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <svg
              className="w-16 h-16 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="text-sm">Cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={item.product.id}
                className="flex items-start gap-3 pb-4 border-b border-slate-200 last:border-b-0"
              >
                {/* Item Number */}
                <div className="flex-shrink-0">
                  <span className="text-lg font-medium text-slate-900">
                    {index + 1}.
                  </span>
                </div>

                {/* Item Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-slate-900 text-sm mb-1">
                    {item.product.name}
                  </h4>
                  <p className="text-slate-900 font-medium text-base mb-2">
                    Rs.{" "}
                    {(item.product.price * item.quantity).toLocaleString(
                      "en-IN",
                    )}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(
                          item.product.id,
                          Math.max(0, item.quantity - 1),
                        )
                      }
                      className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="text-sm font-medium text-slate-900 w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                      <svg
                        className="w-4 h-4 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Quantity Badge */}
                <div className="flex-shrink-0">
                  <span className="text-xs font-medium text-slate-500">
                    QTY
                  </span>
                  <div className="text-lg font-medium text-slate-900">
                    {item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total Section */}
      {cartItems.length > 0 && (
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-lg font-semibold text-slate-900 mb-1">
                Total
              </div>
              <div className="text-2xl font-semibold text-slate-900">
                Rs. {totalAmount.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-slate-500 mb-1">QTY</div>
              <div className="text-2xl font-semibold text-slate-900">
                {totalQuantity}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
