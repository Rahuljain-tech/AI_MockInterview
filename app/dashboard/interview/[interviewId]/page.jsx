
"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { WebcamIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'

const Interview = ({params}) => {

    const [interviewData,setInterviewData]= useState();
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    useEffect(()=>{
        console.log(params.interviewId)
        GetInterviewDetails();

    },[])

    const GetInterviewDetails=async()=>{
        const result=await db.select().from(MockInterview)
        .where(eq(MockInterview.mockId,params.interviewId))

        // console.log(result);
        setInterviewData(result[0]);
    }
  return (
    <div className='my-10 flex justifu-center flex-col items-center'>
        <h2 className='font-bold text-2xl'>Let's Get Started</h2>
        <div>
            {webCamEnabled? <Webcam
            onUserMedia={()=>setWebCamEnabled(true)}
            onUserMediaError={()=>setWebCamEnabled(false)} 
            mirrored={true}
            style={{
                height:300,
                width:300
            }}/>:
            <>
            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border'/>
            <Button onclick={()=>setWebCamEnabled(true)}>Enable Web Camera</Button>
            </>
            
      }
            
              </div>
    </div>
  )
}

export default Interview