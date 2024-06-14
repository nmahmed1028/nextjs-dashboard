import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth; //initialize nextauth.js w/ authconfig object, exporting auth property

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'], //specify that middleware run on specific paths
    //protected routes won't start rendering until middleware verifies authentication
};