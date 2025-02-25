import StreamView from "@/app/components/StreamView"

export default async function({
    params :{
        creatorId
    }
}:{
    params:{
        creatorId:string
    }
}){
    return <div>
        <StreamView creatorId={creatorId} playSong={false} />
    </div>
}