// src/types/next-auth.d.ts
import NextAuth from "next-auth";
import {
    JWT as DefaultJWT,
    Session as DefaultSession,
    User as DefaultUser,
} from "next-auth";

declare module "next-auth" {
    /** Extiende el objeto `User` que devuelve tu authorize() */
    interface User extends DefaultUser {
        isOnboarded: boolean;
    }

    /** Extiende la sesión que verás en el cliente */
    interface Session extends DefaultSession {
        user: DefaultSession["user"] & {
            id: string;
            isOnboarded: boolean;
        };
    }
}

declare module "next-auth/jwt" {
    /** Extiende el token JWT interno */
    interface JWT extends DefaultJWT {
        id: string;
        isOnboarded: boolean;
    }
}
