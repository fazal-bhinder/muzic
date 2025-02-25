import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"; 
import { prisma } from "../../lib/db";


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

    // Check if the Stream ID exists in the database
    const streamExists = await prisma.stream.findUnique({
        where: {
          id: data.streamId,
        },
      });
  
      if (!streamExists) {
        return NextResponse.json(
          {
            msg: "Stream not found",
          },
          {
            status: 404,
          }
        );
      }
        
        await prisma.upvote.create({
            data:{ 
                userId:user.id,
                streamId:data.streamId  
            }
        });
        return NextResponse.json({
            msg:"Upvoted"
        })
    }
    catch(e){
        console.error("Error while upvoting:", e);
        return NextResponse.json({
            msg:"Invalid while upvoting"
        },{
            status:411,
        })
        
    }
}





