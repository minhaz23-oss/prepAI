
'use client';

import { useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteFeedback } from "@/lib/actions/general.action";

interface CategoryScore {
    name: string;
    score: number;
    comment: string;
  }
  
  interface FeedbackData {
    totalScore: number;
    createdAt: string | Date;
    finalAssessment: string;
    categoryScores: CategoryScore[];
    strengths: string[];
    areasForImprovement: string[];
  }
  
  interface Interview {
    role: string;
    // Add other interview properties as needed
  }
  
  interface FeedbackContentProps {
    id: string;
    userId: string;
    interview: Interview;
    feedback: FeedbackData;
  }

const FeedbackContent = ({id,userId,interview,feedback} : FeedbackContentProps) => {

    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRetake = async () => {
        setIsDeleting(true);
        setError(null);
        
        try {
          const result = await deleteFeedback(id, userId);
          
          if (result?.success) {
            router.push(`/interview/${id}`);
          } else {
            console.log('Error deleting feedback:', result?.message);
            setError(result?.message || 'Failed to delete feedback');
          }
        } catch (error) {
          console.error('Error:', error);
          setError('An unexpected error occurred');
        } finally {
          setIsDeleting(false);
        }
      };

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback on the Interview -{" "}
          <span className="capitalize">{interview.role}</span> Interview
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="star" />
            <p>
              Overall Impression:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image src="/calendar.svg" width={22} height={22} alt="calendar" />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4">
        <h2>Breakdown of the Interview:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}. {category.name} ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      {feedback?.strengths?.length! > 0 && (
        <div className="flex flex-col gap-3">
          <h3>Strengths</h3>
          <ul>
            {feedback?.strengths?.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Back to dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p onClick={handleRetake} className="text-sm font-semibold text-black text-center">
              Retake Interview
            </p>
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default FeedbackContent
