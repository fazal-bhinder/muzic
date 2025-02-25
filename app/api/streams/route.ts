import { NextRequest, NextResponse } from "next/server";
import {number, z} from "zod";
import { prisma } from "../lib/db";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";

export var YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;
  
const CreateStreamSchema = z.object({
    creatorId:z.string(),
    url:z.string().includes("youtube.com")
})

export async function POST(req:NextRequest){
    try{
        const data =  CreateStreamSchema.parse(await req.json());
        const match = data.url.match(YT_REGEX);
        if(!match){
            return NextResponse.json({
                message:"Invalid URL"
            },{
                status:411,
            })
        }
       
        const extractedId = data.url.split("v=")[1];
        if (!extractedId) {
            return NextResponse.json({
                message: "Failed to extract video ID"
            }, {
                status: 411,
            });
        }

        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        const thumbnails = res.thumbnail.thumbnails;

        thumbnails.sort((a: {width: number}, b: {width: number}) => a.width < b.width ? -1 : 1);

        console.log(data.url)
        const streamId = "cm51ou8x50080s8g3duj5huho"
        const stream = await prisma.stream.create({
            data:{
                userId: data.creatorId,
                url: data.url,
                extractedId:extractedId || "",
                type: "Youtube",
                active:true,
                title:res.title ?? "can't find title",
                smallImg: thumbnails.length > 1 ? thumbnails[thumbnails.length - 2].url : thumbnails[thumbnails.length - 1].url ?? "https://imgs.search.brave.com/mXaqtSmNocenhkUyY670RUQ6y8kvg84PmT-Qfq3f2hs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jaW1n/LmNvL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDI0LzExLzI5MTEx/MzQzLzE3MzI4Nzg4/MjMtZ2RhZjdsZnhr/YWF4MmhxLmpwZw",
                bigImg:thumbnails[thumbnails.length - 1].Url ?? "https://imgs.search.brave.com/mXaqtSmNocenhkUyY670RUQ6y8kvg84PmT-Qfq3f2hs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jaW1n/LmNvL3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDI0LzExLzI5MTEx/MzQzLzE3MzI4Nzg4/MjMtZ2RhZjdsZnhr/YWF4MmhxLmpwZw"
            }
        });

        return NextResponse.json({
            ...stream,
            hasUpvoted: false,
            upvotes: 0
        })
    }
    catch(error){
        return NextResponse.json({
            msg:"Error while adding stream",
            error: console.error(error)
        },{
            status:411,
        })
    }
} 

export async function GET(req:NextRequest){
    const createrId = req.nextUrl.searchParams.get("creatorId"); 
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
    if(!createrId){
        return NextResponse.json({
            msg : "Error while getting streams"
        },{
            status:411,
        })
    }
    const [streams, activeStream] = await Promise.all([await prisma.stream.findMany({
        where:{
            userId:createrId
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
    }),prisma.currentStream.findFirst({
        where:{
            userId:createrId
        },
        include:{
            stream:true
        }

    })])

return NextResponse.json({
        streams: streams.map(({_count, ...rest})=>({
            ...rest,
            upvotesCount:_count.upvotes,
            haveUpvoted: rest.upvotes.length ? true : false
        })),
        activeStream
    })
}
