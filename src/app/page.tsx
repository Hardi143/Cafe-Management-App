import AppLayout from '@/components/app-layout';
import OrderDashboard from '@/components/order-dashboard';
import { getOrders, getMenuItems } from '@/lib/data';

export default async function Home() {
  const orders = await getOrders();
  const menuItems = await getMenuItems();

  return (
    <AppLayout>
      <OrderDashboard initialOrders={orders} menuItems={menuItems} />
    </AppLayout>
  );
}
