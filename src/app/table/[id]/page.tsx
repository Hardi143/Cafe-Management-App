import { getMenuItems } from '@/lib/data';
import CustomerMenu from '@/components/customer-menu';
import { Coffee } from 'lucide-react';
import Link from 'next/link';

export default async function TableOrderPage({ params }: { params: { id: string } }) {
  const menuItems = await getMenuItems();
  const tableId = params.id;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href={`/table/${tableId}`} className="flex items-center gap-2 font-semibold text-lg">
            <Coffee className="h-6 w-6 text-primary" />
            <span>BrewFlow</span>
          </Link>
          <div className="font-semibold">Table {tableId}</div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <CustomerMenu menuItems={menuItems} tableId={tableId} />
      </main>
      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        Powered by BrewFlow
      </footer>
    </div>
  );
}
