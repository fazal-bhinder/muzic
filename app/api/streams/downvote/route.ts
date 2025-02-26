import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"; 
import { prisma } from "../../lib/db";
import { PrismaClient } from "@prisma/client/extension";

const UpvoteSchema = z.object({
    streamId:z.string()
})

export async function POST(req:NextRequest){
    const session = await getServerSession();
    

    const user = await prisma.user.findFirst({
        where:{
            email:session?.user?.email ?? ""
        }
    })
    if(!user){
        return NextResponse.json({
            msg:"Not logged in"
        },{
            status:403
        })
    }

    try{
        const data = UpvoteSchema.parse( await req.json());
        await prisma.upvote.delete({
            where:{
                userId_streamId :{ 
                    userId:user.id,
                    streamId:data.streamId
                }
               
            }
        })
        return NextResponse.json({
            msg:"Upvote deleted"
        })
    }
    catch(e){
        return NextResponse.json({
            msg:"Invalid while downvoting"
        },{
            status:411,
        })
    }
}