// app/pharmacy-staff/dashboard/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/common/ProtectedRoute";

const kpiCards = [
	{
		title: "Total Pets",
		value: "2",
		actionText: "View Detailed Report",
		accent: "#2f7afc",
		actionBg: "#e9f1ff",
		icon: (
			<svg
				className="h-8 w-8 text-slate-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.6}
					d="M17 20a4 4 0 00-8 0m8 0H7m10 0h1a2 2 0 002-2v-1a5 5 0 00-5-5h-1m-5 8H4a2 2 0 01-2-2v-1a5 5 0 015-5h1m0 0a4 4 0 118 0m-8 0a4 4 0 018 0"
				/>
			</svg>
		),
	},
	{
		title: "Upcoming Appointments",
		value: "5",
		actionText: "View Detailed Report",
		accent: "#f1b530",
		actionBg: "#fff7e5",
		icon: (
			<svg
				className="h-8 w-8 text-slate-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.7}
					d="M8 7V3m8 4V3m-9 8h10m-11 9h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v11a2 2 0 002 2z"
				/>
			</svg>
		),
	},
	{
		title: "Medicines Available",
		value: "298",
		actionText: "View Inventory",
		accent: "#2f7afc",
		actionBg: "#edf2ff",
		icon: (
			<svg
				className="h-8 w-8 text-[#3a7cff]"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.7}
					d="M9 3h6a2 2 0 012 2v1a2 2 0 002 2v11a2 2 0 01-2 2H7a2 2 0 01-2-2V8a2 2 0 002-2V5a2 2 0 012-2zm0 8h6"
				/>
			</svg>
		),
	},
	{
		title: "Medicine Shortage",
		value: "01",
		actionText: "Resolve Now",
		accent: "#ff4b4b",
		actionBg: "#fff0f0",
		icon: (
			<svg
				className="h-8 w-8 text-slate-400"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={1.7}
					d="M13 5h-2l-1 6h4l-1-6zm-1 10h.01M4 20h16M7 20l2-7h6l2 7"
				/>
			</svg>
		),
	},
];

const topSelling = [
	{
		name: "Canine Deworming Tablet",
		id: "VET-ANTP-001",
		amount: 140,
		sub: 8420,
		growth: "18%",
		color: "#4e6bf3",
	},
	{
		name: "Amoxiclav Vet 250 mg",
		id: "VET-ANTI-003",
		amount: 120,
		sub: 7760,
		growth: "12%",
		color: "#f3c94e",
	},
	{
		name: "Meloxicam Oral Suspension",
		id: "VET-PAIN-005",
		amount: 92,
		sub: 6140,
		growth: "9%",
		color: "#ffd560",
	},
	{
		name: "Pet Multivitamin Syrup",
		id: "VET-SUPP-007",
		amount: 88,
		sub: 5980,
		growth: "15%",
		color: "#6cc0ff",
	},
];

const recentSales = [
	{ name: "Jithin Kumar", phone: "0997383979", total: "Rs. 1,280", date: "Apr 1, 2024" },
	{ name: "Anitha Shenoy", phone: "8769379910", total: "Rs. 720", date: "Apr 9, 2024" },
	{ name: "Rajesh Kumar", phone: "6649512879", total: "Rs. 1,380", date: "Apr 8, 2024" },
	{ name: "Neha Dixit", phone: "9911233401", total: "Rs. 2,400", date: "Apr 3, 2024" },
];

function Bars({ values, color }: { values: number[]; color: string }) {
	return (
		<div className="mt-4 flex h-16 items-end gap-3">
			{values.map((value, index) => (
				<div
					key={`${color}-${index}`}
					className="w-5 rounded-t-md"
					style={{ height: `${value}%`, backgroundColor: color }}
				/>
			))}
		</div>
	);
}

export default function PharmacyStaffDashboardPage() {
	const { user, logout } = useAuth();

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

							<nav className="hidden items-center gap-2 text-sm lg:flex">
								<Link
									className="rounded-full border border-white/30 bg-white/5 px-8 py-2 font-medium"
									href="/pharmacy-staff/dashboard"
								>
									Dashboard
								</Link>
								<Link
									className="rounded-full px-6 py-2 text-white/90 hover:bg-white/10"
									href="/pharmacy-staff/medicine"
								>
									Medicine
								</Link>
								<Link
									className="rounded-full px-6 py-2 text-white/90 hover:bg-white/10"
									href="/pharmacy-staff/inventory"
								>
									Inventory Management
								</Link>
								<Link
									className="rounded-full px-6 py-2 text-white/90 hover:bg-white/10"
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
					<div className="mb-7 flex items-start justify-between">
						<div>
							<h1 className="text-2xl font-semibold leading-tight text-[#18214f]">
								Dashboard
							</h1>
							<p className="text-sm text-[#445178]">
								A quick overview of the pharmacy.
							</p>
						</div>
						<button className="flex items-center gap-4 rounded-2xl border border-[#d6dbea] bg-[#f8f9ff] px-7 py-4 text-sm font-medium text-[#22295f]">
							Download Report
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
						</button>
					</div>

					<section className="mb-7 grid grid-cols-1 gap-5 xl:grid-cols-4">
						{kpiCards.map((card) => (
							<article
								key={card.title}
								className="rounded-2xl border border-[#dde2ef] bg-white p-6 shadow-[0_6px_18px_rgba(16,24,40,0.06)]"
								style={{
									boxShadow: `inset 5px 0 0 ${card.accent}, 0 6px 18px rgba(16,24,40,0.06)`,
								}}
							>
								<div className="mb-4 flex items-start justify-between">
									<div>
										<h3 className="text-3xl font-semibold leading-none text-[#192252]">
											{card.value}
										</h3>
										<p className="mt-2 text-sm font-medium text-[#243161]">
											{card.title}
										</p>
									</div>
									{card.icon}
								</div>
								<button
									className="flex w-full items-center justify-center gap-3 rounded-xl py-3 text-sm font-medium text-[#20295a]"
									style={{ backgroundColor: card.actionBg }}
								>
									{card.actionText}
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
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</button>
							</article>
						))}
					</section>

					<section className="mb-6 grid grid-cols-1 gap-5 xl:grid-cols-2">
						<article className="overflow-hidden rounded-2xl border border-[#dde2ef] bg-white">
							<div className="flex items-center justify-between border-b border-[#e7eaf4] px-6 py-4">
								<h2 className="text-lg font-semibold text-[#192252]">
									Inventory
								</h2>
								<button className="flex items-center gap-2 text-sm font-medium text-[#243161]">
									Go to Configuration <span className="text-base">&#8250;</span>
								</button>
							</div>
							<div className="grid grid-cols-2 px-6 py-5">
								<div className="border-r border-[#e7eaf4] pr-6">
									<p className="text-3xl font-semibold leading-none">298</p>
									<p className="mt-2 text-sm text-[#2f3b67]">
										Total Medicines
									</p>
								</div>
								<div className="pl-6">
									<p className="text-3xl font-semibold leading-none">24</p>
									<p className="mt-2 text-sm text-[#2f3b67]">
										Medicine Groups
									</p>
								</div>
							</div>
						</article>

						<article className="overflow-hidden rounded-2xl border border-[#dde2ef] bg-white">
							<div className="flex items-center justify-between border-b border-[#e7eaf4] px-6 py-4">
								<h2 className="text-lg font-semibold text-[#192252]">
									Quick Report
								</h2>
								<button className="flex items-center gap-2 text-sm font-medium text-[#243161]">
									April 2024 <span className="text-base">&#8250;</span>
								</button>
							</div>
							<div className="grid grid-cols-2 px-6 py-5">
								<div className="border-r border-[#e7eaf4] pr-6">
									<p className="text-3xl font-semibold leading-none">10,854</p>
									<p className="mt-2 text-sm text-[#2f3b67]">Quantity Sold</p>
									<Bars
										values={[28, 45, 26, 48, 30, 27, 35, 50, 60, 42, 75]}
										color="#f1c94f"
									/>
								</div>
								<div className="pl-6">
									<p className="text-3xl font-semibold leading-none">782</p>
									<p className="mt-2 text-sm text-[#2f3b67]">
										Invoices Generated
									</p>
									<Bars
										values={[
											30, 50, 28, 42, 25, 38, 54, 35, 47, 76, 55, 100,
										]}
										color="#9bb2df"
									/>
								</div>
							</div>
						</article>
					</section>

					<section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1.1fr]">
						<article className="rounded-2xl border border-[#dde2ef] bg-white">
							<div className="flex items-center justify-between border-b border-[#e7eaf4] px-6 py-4">
								<h2 className="text-lg font-semibold text-[#192252]">
									Top Selling Medicines
								</h2>
								<button className="flex items-center gap-2 text-sm font-medium text-[#243161]">
									View All <span className="text-base">&#8250;</span>
								</button>
							</div>
							<div className="space-y-5 px-6 py-5">
								{topSelling.map((item) => (
									<div
										key={item.id}
										className="flex items-center justify-between"
									>
										<div className="flex items-center gap-4">
											<div
												className="h-12 w-10 rounded-lg"
												style={{ backgroundColor: item.color }}
											/>
											<div>
												<p className="text-sm font-medium text-[#1f285b]">
													{item.name}{" "}
													<span className="rounded-lg bg-[#e8f7eb] px-2 py-0.5 text-xs text-[#20a45f]">
														{`↑ ${item.growth}`}
													</span>
												</p>
												<p className="text-xs text-[#6a7497]">{item.id}</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-2xl font-semibold leading-none">
												{item.amount}
											</p>
											<p className="text-sm text-[#5f6b90]">{item.sub}</p>
										</div>
									</div>
								))}
							</div>
						</article>

						<div className="grid gap-5">
							<article className="rounded-2xl border border-[#dde2ef] bg-white">
								<div className="flex items-center justify-between border-b border-[#e7eaf4] px-6 py-4">
									<h2 className="text-lg font-semibold text-[#192252]">
										Recent Sales
									</h2>
									<button className="flex items-center gap-2 text-sm font-medium text-[#243161]">
										View All <span className="text-base">&#8250;</span>
									</button>
								</div>
								<div className="space-y-4 px-6 py-5">
									{recentSales.map((sale) => (
										<div
											key={sale.phone}
											className="flex items-center justify-between"
										>
											<div className="flex items-center gap-3">
												<div className="grid h-10 w-10 place-items-center rounded-full bg-[#e6ebf8] text-[#5a6a97]">
													●
												</div>
												<div>
													<p className="text-sm font-medium text-[#1f285b]">
														{sale.name}
													</p>
													<p className="text-xs text-[#66739a]">
														{sale.phone}
													</p>
												</div>
											</div>
											<div className="text-right">
												<p className="text-lg font-semibold text-[#1f285b]">
													{sale.total}
												</p>
												<p className="text-xs text-[#66739a]">
													{sale.date}
												</p>
											</div>
										</div>
									))}
								</div>
							</article>

							<article className="rounded-2xl border border-[#dde2ef] bg-white">
								<div className="border-b border-[#e7eaf4] px-6 py-4">
									<h2 className="text-lg font-semibold text-[#192252]">
										Medicine Stock Groups
									</h2>
								</div>
								<div className="flex items-center gap-8 px-6 py-6">
									<div
										className="h-40 w-40 rounded-full"
										style={{
											background:
												"conic-gradient(#6ed5b2 0 48%, #f4cf52 48% 70%, #4b86ee 70% 86%, #e99aa1 86% 100%)",
										}}
									>
										<div className="m-7 h-26 w-26 rounded-full bg-white" />
									</div>
									<div className="space-y-3 text-sm text-[#2c3967]">
										<p>
											<span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#6ed5b2]" />
											Generic Medicine
										</p>
										<p>
											<span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#f4cf52]" />
											Antibiotics
										</p>
										<p>
											<span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#4b86ee]" />
											Diabetes
										</p>
										<p>
											<span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#e99aa1]" />
											Pain Relief
										</p>
									</div>
								</div>
								<div className="space-y-2 border-t border-[#e7eaf4] px-6 py-4 text-sm text-[#2c3967]">
									<div className="flex items-center justify-between">
										<span>Generic Medicine</span>
										<span className="font-semibold">48%</span>
									</div>
									<div className="flex items-center justify-between">
										<span>Antibiotics</span>
										<span className="font-semibold">22%</span>
									</div>
									<div className="flex items-center justify-between">
										<span>Diabetes</span>
										<span className="font-semibold">16%</span>
									</div>
								</div>
							</article>
						</div>
					</section>
				</main>
			</div>
		</ProtectedRoute>
	);
}
