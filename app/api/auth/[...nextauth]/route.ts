import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "../../lib/db";

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    secret: process.env.NEXTAUTH_SECRET as string,
    callbacks:{
        async signIn(params){
            if(!params.user.email){
                return false;
            }

            try{
                await prisma.user.create({
                    data:{
                        email:params.user.email,
                        provider:"GOOGLE"
                    }
                })
            }
            catch(e){

            }
            return true;
        }
    }
})

export {handler as GET, handler as POST}