'use client'
import Image from "next/image";
import { cn } from "@/lib/utils";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {vapi} from '@/lib/vapi.sdk'

enum CallStatus {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    CONNECTING = "CONNECTING",
    FINISHED = "FINISHED",

}
interface SavedMessage {
    role: 'user' | 'system' | 'assistant';
    content: string;
}

const Agent = ({ userName,type,userId }: AgentProps) => {

  const router = useRouter()
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus,setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE)
  const [messages, setMessages] = useState<SavedMessage[]>([]);
 

  

  useEffect(() => {
    const onCallSrart = () => setCallStatus(CallStatus.ACTIVE)
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED)
    const onMessage = (message: Message) => {
      if(message.type === 'transcript' && message.transcriptType === 'final') {
        const newMessage = {role: message.role, content: message.transcript}

        setMessages((prev) => [...prev,newMessage])
      }
    }

    const onSpeechStart = () => setIsSpeaking(true)
    const onSpeechEnd = () => setIsSpeaking(false)

    const onError = (error: Error) => console.log(error);

    vapi.on('call-start', onCallSrart)
    vapi.on('call-end', onCallEnd) 
    vapi.on('message', onMessage)
    vapi.on('speech-start', onSpeechStart)
    vapi.on('speech-end', onSpeechEnd)
    vapi.on('error', onError)

    return () => {
      vapi.off('call-start', onCallSrart)
      vapi.off('call-end', onCallEnd) 
      vapi.off('message', onMessage)
      vapi.off('speech-start', onSpeechStart)
      vapi.off('speech-end', onSpeechEnd)
      vapi.off('error', onError)
    }
  },[])

  useEffect(() => {
     if(callStatus === CallStatus.FINISHED) router.push('/')
  },[messages,callStatus,userId,type])

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING)
    console.log(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID)
    console.log(userName,userId,type)
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!,{
      variableValues: {
        username: userName,
        userid: userId,
      }
    })
  }
  const handleDisconnect = async () => {
    setCallStatus(CallStatus.FINISHED)
     vapi.stop()
  }

  const latestMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED;

  return (
    <>
      <div className="call-view">
        <div className=" card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              width={65}
              height={54}
              alt="vapi"
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI interviewer</h3>
        </div>
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className=" transcript-border">
          <div className="transcript">
            <p key={latestMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className=" flex w-full justify-center">
         {callStatus !== 'ACTIVE' ? (
            <button className="relative btn-call" onClick={handleCall}>
                <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' && 'hidden')}/>
                 <span>

                  {isCallInactiveOrFinished ? 'Call' : '...'}
                 </span>
            </button>
         ): (
            <button className=" btn-disconnect" onClick={handleDisconnect}>End</button>
         )}
      </div>
    </>
  );
};

export default Agent;
