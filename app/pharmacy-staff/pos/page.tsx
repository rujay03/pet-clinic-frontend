// app/pharmacy-staff/pos/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { POSProduct, CartItem } from "@/types/pharmacy";
import ProductCard from "@/components/pharmacy-staff/pos/ProductCard";
import ShoppingCart from "@/components/pharmacy-staff/pos/ShoppingCart";

export default function POSPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentDateTime, setCurrentDateTime] = useState("");

  // Mock products data
  const mockProducts: POSProduct[] = [
    {
      id: "1",
      name: "ALOE VERA BODY LOTION",
      price: 2800.0,
      stock: 50,
    },
    {
      id: "2",
      name: "ALOE VERA BODY LOTION",
      price: 5600.0,
      stock: 50,
    },
    {
      id: "3",
      name: "ALOE VERA BODY LOTION",
      price: 2800.0,
      stock: 50,
    },
    {
      id: "4",
      name: "ALOE VERA BODY LOTION",
      price: 8400.0,
      stock: 50,
    },
    {
      id: "5",
      name: "ALOE VERA BODY LOTION",
      price: 2800.0,
      stock: 50,
    },
    {
      id: "6",
      name: "ALOE VERA BODY LOTION",
      price: 2800.0,
      stock: 50,
    },
    {
      id: "7",
      name: "ALOE VERA BODY LOTION",
      price: 2800.0,
      stock: 50,
    },
    {
      id: "8",
      name: "ALOE VERA BODY LOTION",
      price: 2800.0,
      stock: 50,
    },
  ];

  const handleAddToCart = (product: POSProduct) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(productId);
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item,
        ),
      );
    }
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  };

  const handleMakeSale = () => {
    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    console.log("Making sale:", cartItems);
    // TODO: Process sale
    alert("Sale completed!");
    setCartItems([]);
  };

  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Get current date and time - matching PharmacyShell format
  useEffect(() => {
    const updateDateTime = () => {
      const currentDate = new Date().toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const currentTime = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setCurrentDateTime(`${currentDate} ${currentTime}`);
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - matching standard width */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-indigo-900">PET CORE</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-1">
          <Link
            href="/pharmacy-staff/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
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
                d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z"
              />
            </svg>
            <span className="text-sm font-medium">Dashboard</span>
          </Link>

          <Link
            href="/pharmacy-staff/medicine"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
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
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
            <span className="text-sm font-medium">Medicine</span>
          </Link>

          <Link
            href="/pharmacy-staff/inventory"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-sm font-medium">Inventory Management</span>
          </Link>

          <Link
            href="/pharmacy-staff/pos"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-indigo-50 text-indigo-600 transition-colors"
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span className="text-sm font-medium">POS</span>
          </Link>

          <Link
            href="/pharmacy-staff/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm font-medium">Profile</span>
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/pharmacy-staff/login");
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-slate-50 w-full transition-colors"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="text-sm font-medium">Log out</span>
          </button>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-slate-50 px-8 py-4 flex-shrink-0 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search Medicine"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Make Sale and Return Dashboard */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleMakeSale}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors"
              >
                Make Sale
              </button>
              <button
                onClick={() => router.push("/pharmacy-staff/dashboard")}
                className="text-slate-900 font-medium hover:text-blue-600 transition-colors"
              >
                Return Dashboard
              </button>
            </div>
          </div>

          {/* Date and Time - matching PharmacyShell format */}
          <div className="flex justify-end mt-2">
            <div className="text-xs text-slate-500">{currentDateTime}</div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Products Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          </div>

          {/* Right Sidebar - Shopping Cart */}
          <div className="w-96 bg-slate-50 p-6 flex-shrink-0 overflow-hidden">
            <ShoppingCart
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
