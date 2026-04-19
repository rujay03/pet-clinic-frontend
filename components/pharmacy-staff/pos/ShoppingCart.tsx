// components/pharmacy-staff/pos/ShoppingCart.tsx
"use client";

import type { CartItem } from "@/types/pharmacy";

interface ShoppingCartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onMakeSale: () => void;
}

export default function ShoppingCart({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onMakeSale,
}: ShoppingCartProps) {
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <aside className="rounded-3xl border border-[#dce1ec] bg-[#f7f8fd] p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-2xl font-semibold leading-none text-[#1b2554]">Cart</h3>
        <button className="grid h-10 w-10 place-items-center rounded-lg border border-[#d6dbea] text-[#8692b4]">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
            />
          </svg>
        </button>
      </div>

      <div className="mb-4 rounded-2xl border border-[#dce1ec] bg-[#eef1f9] px-6 py-4">
        <div className="flex items-end justify-between">
          <p className="text-base leading-none text-[#5b678e]">
            <span className="text-2xl font-semibold text-[#425390]">{totalQuantity}</span> Items
          </p>
          <p className="text-2xl font-semibold leading-none text-[#1c2656]">
            Rs. {totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="h-[560px] rounded-3xl border border-[#dce1ec] bg-white">
        {cartItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-[#7e89ad]">
            <svg className="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 110 4 2 2 0 010-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <p className="mt-4 text-lg leading-none">Your cart is empty</p>
          </div>
        ) : (
          <div className="h-full space-y-4 overflow-y-auto p-4">
            {cartItems.map((item, index) => (
              <div key={item.product.id} className="rounded-2xl border border-[#dce1ec] bg-[#f9faff] p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-medium leading-tight text-[#1e2757]">
                      {index + 1}. {item.product.name}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#5d6b95]">
                      {item.product.itemType}
                    </p>
                    {item.product.description ? (
                      <p className="mt-1 text-xs text-[#6f7a9f]">{item.product.description}</p>
                    ) : null}
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-[#ff4b4b] transition-colors hover:text-[#d83434]"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.9 12.1A2 2 0 0116.1 21H7.9a2 2 0 01-2-1.9L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <p className="text-lg font-semibold leading-none text-[#1c2656]">
                  Rs. {(item.product.price * item.quantity).toLocaleString("en-IN")}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() =>
                      onUpdateQuantity(item.product.id, Math.max(0, item.quantity - 1))
                    }
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[#ccd4ea] bg-white text-[#526193]"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-base font-medium leading-none text-[#1f285b]">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[#ccd4ea] bg-white text-[#526193]"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 border-t border-[#dce1ec] pt-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onClearCart}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-[#d6dbea] bg-[#f8f9ff] text-sm font-medium text-[#2a3568] hover:bg-[#eef1fb]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 7h12M9 7V4h6v3m-8 0l1 13h6l1-13"
              />
            </svg>
            Clear Cart
          </button>
          <button
            onClick={onMakeSale}
            className="h-12 flex-1 rounded-2xl bg-[#2a63ff] text-sm font-medium text-white hover:bg-[#2054e7]"
          >
            Make Sale
          </button>
        </div>
      </div>
    </aside>
  );
}
