// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import User from "../../models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credenciales",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Contraseña", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email y contraseña son requeridos");
                }
                await connectToDatabase();
                const user = await User.findOne({
                    email: credentials.email,
                }).select("+password");
                if (!user) throw new Error("Usuario no encontrado");
                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );
                if (!isValid) throw new Error("Contraseña incorrecta");

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    isOnboarded: user.isOnboarded,
                };
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.isOnboarded = (user as any).isOnboarded;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    ...session.user!,
                    id: token.id as string,
                    isOnboarded: token.isOnboarded as boolean,
                };
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};
