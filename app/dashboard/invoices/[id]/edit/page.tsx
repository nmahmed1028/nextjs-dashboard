import Form from '@/app/ui/invoices/edit-form'; //edit form pre populated w/ defaultValue for customer name/invoice amnt/status
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default async function Page({ params }: {params: {id: string}}) {
  const id = params.id;
  const [invoice, customers] = await Promise.all([ //promise fetches invoice/customers in parallel
    fetchInvoiceById(id),
    fetchCustomers(),
  ]);

  if (!invoice) { //if invoice doesn't exist invoke notfound
    notFound();
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}