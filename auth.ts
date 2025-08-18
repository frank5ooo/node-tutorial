"use server";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";
import { actionClient } from "@/app/lib/safe-action";
import { returnValidationErrors } from "next-safe-action";

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const loginUserAction = actionClient
  .inputSchema(loginUserSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return returnValidationErrors(loginUserSchema, {
        _errors: ["User not found"],
      });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return returnValidationErrors(loginUserSchema, {
        _errors: ["Invalid password"],
      });
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  });

export const { auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      async authorize(credentials) {
        if (!credentials) return null;
        const parsed = loginUserSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const result = await loginUserAction({ ...parsed.data });

        // Si hay errores de validación o null, retornamos null
        if (!result.data || "_errors" in result) return null;

        return {
          id: result.data?.id,
          email: result.data?.email,
          name: result.data?.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
});
