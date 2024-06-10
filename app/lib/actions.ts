'use server'; //mark all exported funcs in file as server functions

import { z } from 'zod'; //used for type validation
import { sql } from '@vercel/postgres';
//clear client side router cache (stores route segments in browser) + trigger new req to server
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(), 
    customerId: z.string(), 
    amount: z.coerce.number(), //change from string to number while validating type
    status: z.enum(['pending', 'paid']), 
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id: true, date: true});
const UpdateInvoice = FormSchema.omit({id: true, date: true});

export async function createInvoice(formData: FormData) {
    const {customerId, amount, status} = CreateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCents = amount * 100; //convert to cents to avoid JS float errors
    const date = new Date().toISOString().split('T')[0]; //create new invoice creation date w/ format yyyy-mm-dd
    
    await sql `
        INSERT INTO invoices (customer_id, amount, status, date) 
        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `; //sql query to insert new invoice into database

    revalidatePath('/dashboard/invoices'); //once db updated, path revalidated and fresh data fetched
    redirect('/dashboard/invoices'); //redirect user to invoices page after db updated
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100; //convert to cents to avoid JS float errors
    
    await sql `
        UPDATE invoices
        SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
        WHERE id = ${id}
    `; 

    revalidatePath('/dashboard/invoices'); //once db updated, path revalidated and fresh data fetched
    redirect('/dashboard/invoices'); //redirect user to invoices page after db updated
}

export async function deleteInvoice(id: string) {
    await sql `DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}

