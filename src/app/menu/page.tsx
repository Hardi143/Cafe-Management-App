import AppLayout from '@/components/app-layout';
import MenuTable from '@/components/menu-table';
import { getMenuItems } from '@/lib/data';

export default async function MenuPage() {
    const items = await getMenuItems();
    return (
        <AppLayout>
            <div className="flex flex-col w-full">
                <div className="flex items-center mb-4">
                    <h1 className="text-2xl font-bold tracking-tight">Menu Management</h1>
                </div>
                <MenuTable initialItems={items} />
            </div>
        </AppLayout>
    );
}
