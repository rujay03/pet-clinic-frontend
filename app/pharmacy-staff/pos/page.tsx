// app/pharmacy-staff/pos/page.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import type { POSProduct, CartItem } from "@/types/pharmacy";
import ProductCard from "@/components/pharmacy-staff/pos/ProductCard";
import ShoppingCart from "@/components/pharmacy-staff/pos/ShoppingCart";

const mockProducts: POSProduct[] = [
	{
		id: "1",
		name: "Canine Deworming Tablet",
		price: 950,
		stock: 50,
		image: "/pharmacy-products/ABORT-AID.jpg",
	},
	{
		id: "2",
		name: "Feline Deworming Suspension",
		price: 1240,
		stock: 35,
		image: "/pharmacy-products/ABORT-AID.jpg"
	},
	{
		id: "3",
		name: "Amoxiclav Vet 250 mg",
		price: 680,
		stock: 48,
		image:  "/pharmacy-products/ABORT-AID.jpg",
	},
	{
		id: "4",
		name: "Doxycycline Vet 100 mg",
		price: 720,
		stock: 42,
		image: "/pharmacy-products/ABORT-AID.jpg",
	},
	{
		id: "5",
		name: "Meloxicam Oral Suspension",
		price: 1120,
		stock: 26,
		image: "/pharmacy-products/ABORT-AID.jpg",
	},
	{
		id: "6",
		name: "Carprofen Chewable Tablet",
		price: 1350,
		stock: 24,
		image: "/pharmacy-products/ABORT-AID.jpg",
	},
	{
		id: "7",
		name: "Pet Multivitamin Syrup",
		price: 890,
		stock: 60,
		image:  "/pharmacy-products/ABORT-AID.jpg",
	},
	{
		id: "8",
		name: "Probiotic Sachet for Pets",
		price: 510,
		stock: 80,
		image: "/pharmacy-products/ABORT-AID.jpg",
	},
];

export default function POSPage() {
	const router = useRouter();
	const { user, logout } = useAuth();
	const [searchQuery, setSearchQuery] = useState("");
	const [cartItems, setCartItems] = useState<CartItem[]>([]);

	const handleAddToCart = (product: POSProduct) => {
		setCartItems((prev) => {
			const existingItem = prev.find((item) => item.product.id === product.id);
			if (!existingItem) {
				return [...prev, { product, quantity: 1 }];
			}

			return prev.map((item) =>
				item.product.id === product.id
					? { ...item, quantity: item.quantity + 1 }
					: item,
			);
		});
	};

	const handleUpdateQuantity = (productId: string, quantity: number) => {
		if (quantity <= 0) {
			setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
			return;
		}

		setCartItems((prev) =>
			prev.map((item) =>
				item.product.id === productId ? { ...item, quantity } : item,
			),
		);
	};

	const handleRemoveItem = (productId: string) => {
		setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
	};

	const handleClearCart = () => setCartItems([]);

	const handleMakeSale = () => {
		if (cartItems.length === 0) {
			alert("Your cart is empty");
			return;
		}

		alert("Sale completed successfully");
		setCartItems([]);
	};

	const filteredProducts = useMemo(
		() =>
			mockProducts.filter((product) =>
				product.name.toLowerCase().includes(searchQuery.toLowerCase()),
			),
		[searchQuery],
	);

	if (!user) {
		return null;
	}

	return (
		<ProtectedRoute allowedRoles={["PHARMACIST", "ADMIN"]}>
			<div className="min-h-screen bg-[#f4f6fb] text-[#1a2554]">
				<header className="bg-[#22295f] text-white">
					<div className="mx-auto flex w-full max-w-[1500px] items-center justify-between px-8 py-4">
						<div className="flex items-center gap-10">
							<div className="flex items-center gap-3">
								<Image
									src="/logo.png"
									alt="PetCore Logo"
									width={64}
									height={64}
									priority
								/>
							</div>

							<nav className="hidden items-center gap-2 text-base lg:flex">
								<Link
									className="rounded-xl px-4 py-2 text-white/90 hover:bg-white/10"
									href="/pharmacy-staff/dashboard"
								>
									Dashboard
								</Link>
								<Link
									className="rounded-xl px-4 py-2 text-white/90 hover:bg-white/10"
									href="/pharmacy-staff/medicine"
								>
									Medicine
								</Link>
								<Link
									className="flex items-center gap-2 rounded-xl px-4 py-2 text-white/90 hover:bg-white/10"
									href="/pharmacy-staff/inventory"
								>
									Inventory Management
									<svg
										className="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</Link>
								<Link
									className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 font-medium"
									href="/pharmacy-staff/pos"
								>
									POS
								</Link>
							</nav>
						</div>

						<div className="flex items-center gap-4">
							<p className="hidden text-base text-white/90 xl:block">
								{user.email}
							</p>
							<button
								onClick={logout}
								className="rounded-xl bg-white px-6 py-2 text-sm font-semibold text-[#1f285b] hover:bg-white/90"
							>
								Log out
							</button>
							<div className="grid h-12 w-12 place-items-center rounded-full bg-white text-sm font-semibold text-[#1f285b]">
								T
							</div>
						</div>
					</div>
				</header>

				<main className="mx-auto w-full max-w-[1500px] px-8 pb-8 pt-8">
					<div className="mb-6 flex items-start justify-between gap-4">
						<div>
							<h1 className="text-3xl font-semibold leading-tight tracking-tight text-[#18214f]">
								Point of Sale
							</h1>
							<div className="mt-3 flex items-center gap-2 text-sm leading-none">
								<span className="text-[#6f7a9f]">Inventory</span>
								<span className="text-[#8b95b5]">&gt;</span>
								<span className="font-medium text-[#1f285b]">
									Medicine Inventory
								</span>
							</div>
						</div>

						<div className="flex items-center gap-3 pt-2">
							<button
								onClick={handleClearCart}
								className="flex items-center gap-2 rounded-xl bg-[#2962ff] px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-[#1f55ec]"
							>
								<span className="text-xl leading-none">+</span>
								New Sale
							</button>
							<button
								onClick={() => router.push("/pharmacy-staff/dashboard")}
								className="rounded-xl border border-[#d6dbea] bg-[#f8f9ff] px-5 py-3 text-sm font-medium text-[#22295f] hover:bg-[#eef1fb]"
							>
								Return Dashboard
								<span className="ml-3">&gt;</span>
							</button>
						</div>
					</div>

					<div className="grid grid-cols-[1fr_390px] gap-5">
						<section className="overflow-hidden rounded-3xl border border-[#dce1ec] bg-[#f7f8fd]">
							<div className="border-b border-[#dce1ec] p-4">
								<div className="flex items-center overflow-hidden rounded-2xl border border-[#d9deea] bg-white">
									<input
										type="text"
										placeholder="Search Medicine..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="h-14 flex-1 bg-transparent px-5 text-base text-[#1f285b] outline-none placeholder:text-[#9aa3c0]"
									/>
									<button className="grid h-14 w-14 place-items-center border-l border-[#d9deea] text-[#8a95b6]">
										<svg
											className="h-5 w-5"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
											/>
										</svg>
									</button>
								</div>
							</div>

							<div className="p-4">
								<h2 className="mb-4 text-2xl font-semibold leading-none text-[#18214f]">
									Medicine Inventory
								</h2>

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
						</section>

						<ShoppingCart
							cartItems={cartItems}
							onUpdateQuantity={handleUpdateQuantity}
							onRemoveItem={handleRemoveItem}
							onClearCart={handleClearCart}
							onMakeSale={handleMakeSale}
						/>
					</div>
				</main>
			</div>
		</ProtectedRoute>
	);
}
