import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/db";


export async function GET(req:NextRequest) {

    const session = await getServerSession();
    const user = await prisma.user.findFirst({
            where:{
                email:session?.user?.email ?? ""
            }
    })

    if(!user){
        return NextResponse.json({
            msg:"Unauthenticated"
        },{
            status:403
        })
    }

    const streams = await prisma.stream.findMany({
            where:{
                userId:user.id
            },
            include:{
                _count:{
                    select:{
                        upvotes:true
                    }
                },
                upvotes:{
                    where:{
                        userId:user.id
                    }
                }
            }
    })

    return NextResponse.json({
            streams: streams.map(({_count, ...rest})=>({
                ...rest,
                upvotesCount:_count.upvotes,
                haveUpvoted: rest.upvotes.length ? true : false
            }))
    })
} 