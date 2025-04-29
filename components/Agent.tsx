import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";

enum CallStatus {
    INACTIVE = "INACTIVE",
    ACTIVE = "ACTIVE",
    CONNECTING = "CONNECTING",
    FINISHED = "FINISHED",

}

const Agent = ({ userName }: AgentProps) => {
  const callStatus = CallStatus.FINISHED; // This should be dynamic based on the call status
  const isSpeaking = true;

  const messages = [
    'Whats your name?',
    'My name is joh doe'
  ]

  const lastMessage = messages[messages.length - 1];

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
              width={540}
              height={540}
              alt="user-avatar"
              className="object-cover rounded-full size-[120px"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className=" transcript-border">
          <div className="transcript">
            <p key={lastMessage} className={cn('transition-opacity duration-500 opacity-0','animate-fadeIn opacity-100')}>
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className=" flex w-full justify-center">
         {callStatus !== 'ACTIVE' ? (
            <button className="relative btn-call">
                <span className={cn('absolute animate-ping rounded-full opacity-75', callStatus !== 'CONNECTING' & 'hidden')}/>
                 <span>

                  {callStatus === 'INACTIVE' || callStatus === 'FINISHED' ? 'Call' : '...'}
                 </span>
            </button>
         ): (
            <button className=" btn-disconnect">End</button>
         )}
      </div>
    </>
  );
};

export default Agent;
