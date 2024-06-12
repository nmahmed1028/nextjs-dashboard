'use server'; //mark all exported funcs in file as server functions

import { z } from 'zod'; //used for type validation
import { sql } from '@vercel/postgres';
//clear client side router cache (stores route segments in browser) + trigger new req to server
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({ //can validate form data
    id: z.string(), 
    customerId: z.string({invalid_type_error: 'Please select a customer.'}), 
    amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than 0'}), //change from string to number while validating type, default 0
    status: z.enum(['pending', 'paid'], {invalid_type_error: 'Please select an invoice status'}),
    date: z.string(),
});

const CreateInvoice = FormSchema.omit({id: true, date: true});
const UpdateInvoice = FormSchema.omit({id: true, date: true});

export type State = { //temporary until @types/react-dom updated
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

//prevState is state from useFormState
export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const {customerId, amount, status} = validatedFields.data;
    const amountInCents = amount * 100; //convert to cents to avoid JS float errors
    const date = new Date().toISOString().split('T')[0]; //create new invoice creation date w/ format yyyy-mm-dd
    
    try {
        await sql `
            INSERT INTO invoices (customer_id, amount, status, date) 
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
        `; //sql query to insert new invoice into database
    } catch (error) {
        return {message: 'Database Error: Failed to Create Invoice.'};
    }

    revalidatePath('/dashboard/invoices'); //once db updated, path revalidated and fresh data fetched
    redirect('/dashboard/invoices'); //redirect user to invoices page after db updated
}

export async function updateInvoice(id: string, prevState: State, formData: FormData) {
    const validatedFields = UpdateInvoice.safeParse({ //used for form validation
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.',
        };
    }

    const { customerId, amount, status} = validatedFields.data; //initialize the vars w/ data from validatedFields
    const amountInCents = amount * 100; //convert to cents to avoid JS float errors
    
    try {
        await sql `
            UPDATE invoices
            SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
            WHERE id = ${id}
        `; 
    } catch (error) {
        return {message: 'Database Error: Failed to Update Invoice.'};
    }

    revalidatePath('/dashboard/invoices'); //once db updated, path revalidated and fresh data fetched
    redirect('/dashboard/invoices'); //redirect user to invoices page after db updated
}

export async function deleteInvoice(id: string) {
    //throw new Error('Failed to Delete Invoice');
    try {
        await sql `DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/dashboard/invoices');
        return {message: 'Deleted Invoice.'};
    } catch (error) {
        return {message: 'Database Error: Failed to Delete Invoice'};
    }
}

