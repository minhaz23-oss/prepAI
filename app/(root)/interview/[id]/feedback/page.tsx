// import { getCurrentUser } from '@/lib/actions/auth.action';
// import { getFeedbackByInterviewId, getInterviewById } from '@/lib/actions/general.action';
// import { redirect } from 'next/navigation';


// const page = async ({params}: RouteParams) => {

//   const {id} = await params;
//   const user = await getCurrentUser();
//   const interview = await getInterviewById(id);
//   if(!interview) redirect('/');

//   const feedback = await getFeedbackByInterviewId({
//     interviewId: id,
//     userId: user?.id!
//   })
  
//   return (
//     <div>
//       this is the feedback page
//     </div>
//   )
// }

// export default page


const page = () => {
  return (
    <div>
      <h1>this is the feedback page</h1>
    </div>
  )
}

export default page
