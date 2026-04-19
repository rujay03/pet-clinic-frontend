// app/pharmacy-staff/pos/page.tsx
"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import type {
	POSProduct,
	CartItem,
	InventoryMedicineApi,
	CreatePosBillRequest,
	PosBillResponse,
} from "@/types/pharmacy";
import ProductCard from "@/components/pharmacy-staff/pos/ProductCard";
import ShoppingCart from "@/components/pharmacy-staff/pos/ShoppingCart";

export default function POSPage() {
	const router = useRouter();
	const { user, logout } = useAuth();
	const [searchQuery, setSearchQuery] = useState("");
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [products, setProducts] = useState<POSProduct[]>([]);
	const [isLoadingProducts, setIsLoadingProducts] = useState(true);
	const [productsError, setProductsError] = useState<string | null>(null);
	const [isSubmittingSale, setIsSubmittingSale] = useState(false);
	const [saleError, setSaleError] = useState<string | null>(null);
	const [lastBill, setLastBill] = useState<PosBillResponse | null>(null);
	const [paymentMethod, setPaymentMethod] = useState("CASH");
	const [serviceName, setServiceName] = useState("");
	const [servicePrice, setServicePrice] = useState("");
	const [serviceNote, setServiceNote] = useState("");
	const [serviceQuantity, setServiceQuantity] = useState("1");

	const mapInventoryToPosProduct = useCallback((item: InventoryMedicineApi): POSProduct => {
		return {
			id: String(item.medicineId),
			name: item.medicineName,
			price: item.unitSellPrice ?? 0,
			stock: item.availableQuantity ?? 0,
			image: "/pharmacy-products/ABORT-AID.jpg",
			itemType: "PRODUCT",
		};
	}, []);

	const loadProducts = useCallback(async () => {
		if (!user) {
			setIsLoadingProducts(false);
			return;
		}

		try {
			setIsLoadingProducts(true);
			setProductsError(null);
			const response = await apiFetch<InventoryMedicineApi[]>("/api/inventory");
			const mapped = response
				.filter((item) => item.active)
				.map(mapInventoryToPosProduct);
			setProducts(mapped);
		} catch (error) {
			const message =
				error instanceof ApiError
					? error.message
					: "Failed to load medicines from database.";
			setProductsError(message);
		} finally {
			setIsLoadingProducts(false);
		}
	}, [mapInventoryToPosProduct, user]);

	useEffect(() => {
		void loadProducts();
	}, [loadProducts]);

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

	const handleAddServiceToCart = () => {
		if (!serviceName.trim() || !servicePrice) {
			setSaleError("Service name and price are required.");
			return;
		}

		const quantity = Number(serviceQuantity);
		const price = Number(servicePrice);
		if (!Number.isFinite(quantity) || quantity < 1 || !Number.isFinite(price) || price < 0) {
			setSaleError("Enter valid service quantity and price.");
			return;
		}

		const serviceProduct: POSProduct = {
			id: `service-${Date.now()}`,
			name: serviceName.trim(),
			price,
			stock: 9999,
			itemType: "SERVICE",
			description: serviceNote.trim() || undefined,
		};

		setCartItems((prev) => [...prev, { product: serviceProduct, quantity }]);
		setServiceName("");
		setServicePrice("");
		setServiceNote("");
		setServiceQuantity("1");
		setSaleError(null);
	};

	const formatMoney = (value: number) =>
		new Intl.NumberFormat("en-LK", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		}).format(value);

	const printBill = useCallback((bill: PosBillResponse) => {
		const printWindow = window.open("", "_blank", "width=900,height=700");
		if (!printWindow) {
			setSaleError("Could not open print window. Please allow pop-ups for this site.");
			return;
		}

		const rows = bill.items
			.map(
				(item, index) => `
					<tr>
						<td style="padding:8px;border:1px solid #ddd;">${index + 1}</td>
						<td style="padding:8px;border:1px solid #ddd;">${item.itemName}</td>
						<td style="padding:8px;border:1px solid #ddd;">${item.itemType}</td>
						<td style="padding:8px;border:1px solid #ddd;">${item.description ?? "-"}</td>
						<td style="padding:8px;border:1px solid #ddd;text-align:right;">${item.quantity}</td>
						<td style="padding:8px;border:1px solid #ddd;text-align:right;">${formatMoney(item.unitPrice)}</td>
						<td style="padding:8px;border:1px solid #ddd;text-align:right;">${formatMoney(item.lineTotal)}</td>
					</tr>
				`,
			)
			.join("");

		printWindow.document.write(`
			<html>
				<head>
					<title>${bill.billNo}</title>
				</head>
				<body style="font-family:Arial,sans-serif;padding:24px;color:#111;">
					<h2 style="margin:0;">Pet Clinic Pharmacy POS Bill</h2>
					<p style="margin:8px 0 2px;">Bill No: <strong>${bill.billNo}</strong></p>
					<p style="margin:0 0 16px;">Date: ${new Date(bill.billedAt).toLocaleString()}</p>
					<table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
						<thead>
							<tr>
								<th style="padding:8px;border:1px solid #ddd;text-align:left;">#</th>
								<th style="padding:8px;border:1px solid #ddd;text-align:left;">Item</th>
								<th style="padding:8px;border:1px solid #ddd;text-align:left;">Type</th>
								<th style="padding:8px;border:1px solid #ddd;text-align:left;">Note</th>
								<th style="padding:8px;border:1px solid #ddd;text-align:right;">Qty</th>
								<th style="padding:8px;border:1px solid #ddd;text-align:right;">Unit Price</th>
								<th style="padding:8px;border:1px solid #ddd;text-align:right;">Line Total</th>
							</tr>
						</thead>
						<tbody>${rows}</tbody>
					</table>
					<div style="margin-left:auto;max-width:320px;">
						<p style="display:flex;justify-content:space-between;margin:4px 0;"><span>Subtotal</span><strong>${formatMoney(bill.subtotal)}</strong></p>
						<p style="display:flex;justify-content:space-between;margin:4px 0;"><span>Discount</span><strong>${formatMoney(bill.discountAmount)}</strong></p>
						<p style="display:flex;justify-content:space-between;margin:4px 0;"><span>Tax</span><strong>${formatMoney(bill.taxAmount)}</strong></p>
						<p style="display:flex;justify-content:space-between;margin:10px 0 0;font-size:18px;"><span>Total</span><strong>${formatMoney(bill.totalAmount)}</strong></p>
					</div>
				</body>
			</html>
		`);
		printWindow.document.close();
		printWindow.focus();
		printWindow.print();
	}, []);

	const handleMakeSale = async () => {
		if (cartItems.length === 0) {
			setSaleError("Your cart is empty.");
			return;
		}

		const payload: CreatePosBillRequest = {
			items: cartItems.map((item) => ({
				itemType: item.product.itemType,
				medicineId: item.product.itemType === "PRODUCT" ? Number(item.product.id) : undefined,
				itemName: item.product.name,
				description: item.product.description,
				quantity: item.quantity,
				unitPrice: item.product.price,
			})),
			discountAmount: 0,
			taxAmount: 0,
			paymentMethod,
		};

		try {
			setIsSubmittingSale(true);
			setSaleError(null);
			const response = await apiFetch<PosBillResponse>("/api/pos/bills", {
				method: "POST",
				body: payload,
			});
			setLastBill(response);
			setCartItems([]);
			await loadProducts();
			printBill(response);
		} catch (error) {
			const message =
				error instanceof ApiError ? error.message : "Failed to complete sale.";
			setSaleError(message);
		} finally {
			setIsSubmittingSale(false);
		}
	};

	const filteredProducts = useMemo(
		() =>
			products.filter((product) =>
				product.name.toLowerCase().includes(searchQuery.toLowerCase()),
			),
		[products, searchQuery],
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
							<select
								value={paymentMethod}
								onChange={(e) => setPaymentMethod(e.target.value)}
								className="h-12 rounded-xl border border-[#d6dbea] bg-white px-4 text-sm font-medium text-[#22295f]"
							>
								<option value="CASH">Cash</option>
								<option value="CARD">Card</option>
								<option value="ONLINE">Online</option>
							</select>
							<button
								onClick={handleClearCart}
								className="flex items-center gap-2 rounded-xl bg-[#2962ff] px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-[#1f55ec]"
							>
								<span className="text-xl leading-none">+</span>
								New Sale
							</button>
							<button
								onClick={() => router.push("/pharmacy-staff/dashboard")}
								className="rounded-xl border border-[#dce1ec] bg-[#f8f9ff] px-5 py-3 text-sm font-medium text-[#22295f] hover:bg-[#eef1fb]"
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

								{productsError ? (
									<div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
										{productsError}
									</div>
								) : null}

								{isLoadingProducts ? (
									<div className="rounded-2xl border border-[#dce1ec] bg-white p-8 text-center text-base text-[#596892]">
										Loading medicines...
									</div>
								) : (
									<div className="grid grid-cols-4 gap-4">
										{filteredProducts.map((product) => (
											<ProductCard
												key={product.id}
												product={product}
												onAddToCart={handleAddToCart}
											/>
										))}
									</div>
								)}
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

					<div className="mb-4 rounded-xl border border-[#dce1ec] bg-white p-4">
						<h3 className="text-base font-semibold text-[#1f285b]">Add Service</h3>
						<div className="mt-3 grid grid-cols-1 gap-2">
							<input
								type="text"
								placeholder="Service name (e.g. Treatment)"
								value={serviceName}
								onChange={(e) => setServiceName(e.target.value)}
								className="h-10 rounded-lg border border-[#d9deea] px-3 text-sm"
							/>
							<input
								type="text"
								placeholder="Note"
								value={serviceNote}
								onChange={(e) => setServiceNote(e.target.value)}
								className="h-10 rounded-lg border border-[#d9deea] px-3 text-sm"
							/>
							<div className="grid grid-cols-2 gap-2">
								<input
									type="number"
									min={1}
									value={serviceQuantity}
									onChange={(e) => setServiceQuantity(e.target.value)}
									className="h-10 rounded-lg border border-[#d9deea] px-3 text-sm"
									placeholder="Qty"
								/>
								<input
									type="number"
									min={0}
									step="0.01"
									value={servicePrice}
									onChange={(e) => setServicePrice(e.target.value)}
									className="h-10 rounded-lg border border-[#d9deea] px-3 text-sm"
									placeholder="Price"
								/>
							</div>
							<button
								onClick={handleAddServiceToCart}
								className="h-10 rounded-lg bg-[#1f5fe0] text-sm font-medium text-white"
							>
								Add Service to Cart
							</button>
						</div>
					</div>

					{saleError ? (
						<div className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{saleError}</div>
					) : null}

					{lastBill ? (
						<div className="mt-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
							Sale completed. Bill: <strong>{lastBill.billNo}</strong>
							<button
								onClick={() => printBill(lastBill)}
								className="ml-3 rounded-md border border-emerald-300 px-2 py-1 text-xs font-semibold text-emerald-800"
							>
								Print Bill
							</button>
						</div>
					) : null}
				</main>
			</div>
		</ProtectedRoute>
	);
}
