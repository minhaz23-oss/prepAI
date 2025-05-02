import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import {
  getCurrentUser,
} from "@/lib/actions/auth.action";
import { getInterviewByUserId,getLatesInterviews } from "@/lib/actions/general.action";

const page = async () => {
  const user = await getCurrentUser();

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatesInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = latestInterviews?.length! > 0;

  return (
    <>
      <section className=" card-cta">
        <div className=" flex flex-col gap-6 max-w-lg">
          <h2>Get interview-ready with AI porwered practice and feedback</h2>
          <p className=" text-lg">
            Practice on real world interview question and get instant feedback
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image
          src="/robot.png"
          alt="hero"
          width={400}
          height={400}
          className=" max-sm:hidden"
        />
      </section>
      <section className=" flex flex-col gap-6 mt-8 ">
        <h2>Your interviews</h2>
        <div className=" interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            
            <p>You have'nt taken any interviews yet</p>
          )}
        </div>
      </section>
      <section className=" flex flex-col gap-6 mt-8">
        <h2>Take an interview</h2>
        <div className=" interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>There are no interviews available</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
