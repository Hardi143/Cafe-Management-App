import AppLayout from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

export default function QrPage() {
  const tables = [1, 2, 3, 4, 5, 6];

  return (
    <AppLayout>
      <div className="flex flex-col w-full">
        <div className="flex items-center mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Table QR Codes</h1>
        </div>
        <p className="text-muted-foreground mb-6">
          Customers can scan these QR codes to view the menu and place an order from their table.
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tables.map(tableNum => (
            <Card key={tableNum}>
              <CardHeader>
                <CardTitle>Table {tableNum}</CardTitle>
                <CardDescription>
                  Scan to order for this table.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-4">
                <Link href={`/table/${tableNum}`} target="_blank">
                  <Image
                    src={`https://placehold.co/200x200.png`}
                    width={200}
                    height={200}
                    alt={`QR Code for Table ${tableNum}`}
                    className="rounded-lg"
                    data-ai-hint="qr code"
                  />
                </Link>
                <Link href={`/table/${tableNum}`} target="_blank" className="text-sm text-primary hover:underline">
                  /table/{tableNum}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
