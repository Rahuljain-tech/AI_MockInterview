"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

  
    import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAi'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { MockInterview } from '@/utils/schema'
import { v4 as uuidv4} from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { useRouter } from 'next/navigation'



const AddNewInterview = () => {
    const [openDialog,setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState();
    const [jobDesc, setJobDesc] = useState();
    const [jobExperience, setJobExperience] = useState(); 
    const [loading, setLoading] = useState(false);
    const [jsonResponse, setJsonResponse] = useState([]);
    const {user}= useUser();
    const router=useRouter();


    const onSubmit=async(e)=>{
        setLoading(true);
        e.preventDefault(); //used to stop automatic refresh after submitting the form.  AIzaSyDNIk61lCfGB8o74U2UzbjzTZNS0_RSPEs
        console.log(jobPosition,jobDesc,jobExperience);

        const InputPrompt ="Job Position: "+jobPosition+", Job Description: "+jobDesc+", Years of Experience : "+jobExperience+", Depending on given job role , job description and years of experience give 5 questions with answers for interview in json format "

        const result = await chatSession.sendMessage(InputPrompt);
        const MockJsonResp = (result.response.text()).replace('```json','').replace('```','');
        console.log(JSON.parse(MockJsonResp));
        setJsonResponse(MockJsonResp);

        if(MockJsonResp){
            const resp = await db.insert(MockInterview)
        .values({
            mockId:uuidv4(),
            jsonMockResp:MockJsonResp,
            jobPosition:jobPosition,
            jobDesc:jobDesc,
            jobExperience:jobExperience,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            createdAt:moment().format('DD-MM-yyyy')

        }).returning({mockId:MockInterview.mockId})

        console.log("Inserted ID:",resp)

        if(resp){
            setOpenDialog(false);
            router.push('/dashboard/interview'+resp[0]?.mockId)
        }
        }

        else{
            console.log("Error:")
        }
        

        // console.log(result.response.text());
        setLoading(false);
    }
  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary
        hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={()=>setOpenDialog(true)}>
            <h2 className='font-bold text-lg text-center'>+ Add New</h2>
        </div>
        <Dialog open={openDialog}> 
  
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle className="text-2xl">Tell us more about the job you want to be interviewed</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
        <div>
            <h2>Add details about your job position/role, Job Description, Years of Experience</h2>
            <div className='mt-7 my-3'>
                <label htmlFor="">Job Role/Job Position</label>
                <Input placeholder="Ex. Full Stack Developer" required
                onChange={(event)=>setJobPosition(event.target.value)}
                />
            </div>
            <div className='mt-7 my-3'>
                <label htmlFor="">Job Description/Tech Stack</label>
                <Textarea placeholder="Ex. React, Angular"
                onChange={(event)=>setJobDesc(event.target.value)}
                />
            </div>
            <div className='mt-7 my-3'>
                <label htmlFor="">Years of Experience</label>
                <Input placeholder="Ex. 5" type="number" max="30"
                onChange={(event)=>setJobExperience(event.target.value)}
                />
            </div>
        </div>
        <div className='flex gap-5 justify-end' >
            <Button type="submit" disabled={loading}>
                {loading?
                <>
                <LoaderCircle className='animate-spin'/>'Generating from AI'</>:'Start Interview'    
            }
                
                
                </Button>
            <Button variant="ghost" onClick={()=>setOpenDialog(false)}>Cancel</Button>
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>

    </div>
  )
}

export default AddNewInterview