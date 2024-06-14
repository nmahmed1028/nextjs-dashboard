import type { NextAuthConfig } from "next-auth";

export const authConfig = { //contains config options for nextauth.js
    pages: {
        signIn: '/login'
    },
    callbacks: { //prevent users from accessing dashboard pages unless logged in
        authorized({ auth, request: { nextUrl } }) { //authorized verifies if req authorized to access page via next.js middleware
            //auth = user's session, request = incoming request
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; //redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
    },
    providers: [], //arr w/ diferent login options
} satisfies NextAuthConfig;