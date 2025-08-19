'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export type State = {
  message?: string | null;
  errors?: {
    customerId?: string[];
    status?: string[];
  };
};

export type StateProduct = {
  errors?: {
    name?: string[];
    price?: string[];
  };
  message?: string | null;
};

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  }
  catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
