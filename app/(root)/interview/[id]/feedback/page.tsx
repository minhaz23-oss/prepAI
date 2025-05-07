
import { redirect } from "next/navigation";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import FeedbackContent from "@/components/FeedbackContent";


const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/sign-in");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  

  return (
    <FeedbackContent
     id={id}
     userId={user?.id!}
      interview={interview}
      feedback={feedback!}
    />
  );
};

export default Feedback;
