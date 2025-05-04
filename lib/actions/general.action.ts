'use server'
import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { create } from "domain";


interface SavedMessage {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

interface CreateFeedbackParams {
  interviewId: string;
  userId: string;
  transcript: SavedMessage[];
  feedbackId?: string;
}

export async function getInterviewByUserId(
    userId: string
  ): Promise<Interview[] | null> {
    const interviews = await db
      .collection("interviews")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
  
    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  }

export async function getLatesInterviews(
    params: GetLatestInterviewsParams
  ): Promise<Interview[] | null> {
    const { userId, limit = 20 } = params;
    const interviews = await db
      .collection("interviews")
      .orderBy("createdAt", "desc")
      .where('finalized', '==', true)
      .where("userId", "!=", userId)
      .limit(limit)
      .get();
  
    return interviews.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Interview[];
  }

export async function getInterviewById(
    id: string
  ): Promise<Interview | null> {
    const interview = await db
      .collection("interviews")
      .doc(id)
      .get();
  
    return interview.data() as Interview | null;
  }

  // export async function createFeedback(params: CreateFeedbackParams) {
  //   const { interviewId, userId, transcript, feedbackId } = params;
  
  //   try {
  //     // const formattedTranscript = transcript
  //     //   .map(
  //     //     (sentence: { role: string; content: string }) =>
  //     //       `- ${sentence.role}: ${sentence.content}\n`
  //     //   )
  //     //   .join("");
  
  //     // const { object:{totalScore,categoryScores,strengths,areasForImprovement,finalAssessment} } = await generateObject({
  //     //   model: google("gemini-2.0-flash-001", {
  //     //     structuredOutputs: false,
  //     //   }),
  //     //   schema: feedbackSchema,
  //     //   prompt: `
  //     //     You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
  //     //     Transcript:
  //     //     ${formattedTranscript}
  
  //     //     Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
  //     //     - **Communication Skills**: Clarity, articulation, structured responses.
  //     //     - **Technical Knowledge**: Understanding of key concepts for the role.
  //     //     - **Problem-Solving**: Ability to analyze problems and propose solutions.
  //     //     - **Cultural & Role Fit**: Alignment with company values and job role.
  //     //     - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
  //     //     `,
  //     //   system:
  //     //     "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
  //     // });
  
  //     // const feedback = await db.collection('feedback').add({
  //     //   interviewId,
  //     //   userId,
  //     //   totalScore,
  //     //   categoryScores,
  //     //   strengths,
  //     //   areasForImprovement,
  //     //   finalAssessment,
  //     //   createdAt: new Date().toISOString(),
  //     // }) 
        
      
  //     console.log(interviewId, userId, transcript, feedbackId)
      
  
  //     return { success: true, feedbackId: '1234'};
      
  //   } catch (error) {
  //     console.error("Error saving feedback:", error);
  //     return { success: false };
  //   }
  // }
  export async function createFeedback(params: CreateFeedbackParams) {
    const { interviewId, userId, transcript, feedbackId } = params;
    
    try {
      // Format the transcript for AI processing
      const formattedTranscript = transcript
        .map(
          (sentence: { role: string; content: string }) =>
            `- ${sentence.role}: ${sentence.content}\n`
        )
        .join("");
      
      console.log("Processing feedback for interview:", interviewId, "user:", userId);
      
      // AI processing code
      const { object } = await generateObject({
        model: google("gemini-2.0-flash-001", {
          structuredOutputs: false,
        }),
        schema: feedbackSchema,
        prompt: `
          You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
          Transcript:
          ${formattedTranscript}
          
          Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
          - **Communication Skills**: Clarity, articulation, structured responses.
          - **Technical Knowledge**: Understanding of key concepts for the role.
          - **Problem-Solving**: Ability to analyze problems and propose solutions.
          - **Cultural & Role Fit**: Alignment with company values and job role.
          - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
          `,
        system:
          "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
      });
      
      const { totalScore, categoryScores, strengths, areasForImprovement, finalAssessment } = object 
      
      // Uncomment when ready to use your database
      
      // Save to database
      const feedback = await db.collection('feedback').add({
        interviewId,
        userId,
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
        createdAt: new Date().toISOString(),
      });
      
      return { success: true, feedbackId: feedback.id };
      
      
      
      // console.log("Generated feedback:", {
      //   totalScore,
      //   categoryScores,
      //   strengths,
      //   areasForImprovement,
      //   finalAssessment
      // });
      
      
      // return { success: true, feedbackId: feedbackId || '1234' };
      
    } catch (error) {
      console.error("Error saving feedback:", error);
      return { success: false };
    }
  }
  

  export async function getFeedbackByInterviewId(
    params: GetFeedbackByInterviewIdParams
  ): Promise<Feedback | null> {
    const { interviewId, userId } = params;
  
    const querySnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .where("userId", "==", userId)
      .limit(1)
      .get();
  
    if (querySnapshot.empty) return null;
  
    const feedbackDoc = querySnapshot.docs[0];
    return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
  }
  
  // async function generateObject({ model, schema, prompt, system }: {
  //   model: any;
  //   schema: any;
  //   prompt: string;
  //   system: string;
  // }) {
  //   try {
  //     // Call the AI model
  //     const response = await model.generateContent({
  //       contents: [
  //         {
  //           role: "system",
  //           parts: [{ text: system }]
  //         },
  //         {
  //           role: "user",
  //           parts: [{ text: prompt }]
  //         }
  //       ],
  //       generationConfig: {
  //         temperature: 0.2,
  //         maxOutputTokens: 2048,
  //       },
  //       safetySettings: [
  //         {
  //           category: "HARM_CATEGORY_HARASSMENT",
  //           threshold: "BLOCK_ONLY_HIGH"
  //         }
  //       ]
  //     });
      
  //     const responseText = response.response.text();
  //     const object = JSON.parse(responseText);
      
  //     return { object };
  //   } catch (error) {
  //     console.error("Error generating object from AI:", error);
  //     throw error;
  //   }
  // }