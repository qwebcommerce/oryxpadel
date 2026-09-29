import AdminDashboard from "@/components/admin/AdminDashboard";
import { getDashboardStats, listAllProducts, listOrders } from "@/lib/db";
import type { DashboardStats } from "@/types";

export const metadata = { title: "Admin" };

const EMPTY_STATS: DashboardStats = {
  revenue: 0,
  orderCount: 0,
  productCount: 0,
  customerCount: 0,
  pendingOrders: 0,
  lowStock: 0,
};

export default async function AdminHomePage() {
  try {
    const [stats, orders, products] = await Promise.all([getDashboardStats(), listOrders(), listAllProducts()]);
    return <AdminDashboard stats={stats} orders={orders} products={products} />;
  } catch (error) {
    console.error("Admin dashboard failed to load:", error instanceof Error ? error.message : error);
    return <AdminDashboard stats={EMPTY_STATS} orders={[]} products={[]} />;
  }
}
