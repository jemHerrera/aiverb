import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Chat } from "../db/entities";
import { SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "langchain/chat_models/openai";

export const summarizeChat = async (
  chat: Chat,
  aiName: string = "AI",
  userName: string = "User"
) => {
  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const outputParser = new StringOutputParser();

  const conversation = `
    \n${chat.createdAt} - ${userName}: "${chat.userMessage}"
    \n${chat.createdAt} - ${aiName} : "${chat.aiMessage}"
  `;

  const summaryPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
      Use the following examples as reference to summarize the conversation in the format given.

      Example 1:
      
      Feb 14, 2024, 09:15 AM - Jem: Can you teach me Japanese?
      Feb 14, 2024, 09:15 AM - Kaori: Absolutely! I'd be more than happy to teach you Japanese. Whether you're a beginner or looking to enhance your skills, I'll do my best to help you learn. Just let me know what areas you'd like to focus on or if you have any specific questions. がんばりましょう! (Let's do our best!)
      
      Expected Output:
      On February 14, 2024, at 09:15 AM, Jem initiated a chat with Kaori, expressing an interest in learning Japanese. Kaori enthusiastically accepted the request, assuring Jem that she would be delighted to help him with his Japanese learning journey. Kaori also encouraged Jem to specify the areas he wanted to focus on or ask any questions. She concluded with a motivational phrase, "がんばりましょう! (Let's do our best!)"
    
      Example 2:

      Feb 14, 2024, 09:25 AM - Jem: Can we talk to one another in both English and Japanese? I think we can learn better that way
      Feb 14, 2024, 09:25 AM - Kaori: Absolutely! We can definitely communicate in both English and Japanese. Using both languages during our conversations can be a helpful and immersive way to learn. If there's a specific topic or concept you'd like to discuss or practice in Japanese, feel free to let me know, and we can switch to using Japanese. Otherwise, we can continue in English for now. Just let me know how you'd like to proceed!

      Expected Output:
      On February 14, 2024, at 09:25 AM, Jem proposed the idea of communicating in both English and Japanese for an enhanced learning experience. Kaori responded affirmatively, expressing enthusiasm for the suggestion. She agreed to the use of both languages, highlighting the benefits of such an approach for immersive learning. Kaori also offered flexibility, suggesting that they could switch to Japanese when discussing specific topics or concepts if Jem preferred. She concluded by giving Jem the freedom to decide whether to continue in English or transition to Japanese based on his preferences.
      `,
    ],
    ["user", "{input}"],
  ]);

  const summaryChain = summaryPrompt.pipe(chatModel).pipe(outputParser);

  return await summaryChain.invoke({
    input: `Conversation : 
    ${conversation}`,
  });
};

export const summarizeChats = async (
  chats: Chat[],
  aiName: string = "AI",
  userName: string = "User"
) => {
  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const outputParser = new StringOutputParser();

  let chatHistory: string = `
    Chat history:\n
  `;

  chats.forEach((chat) => {
    const userMessage = `\n${chat.createdAt} - ${userName}: "${chat.userMessage}"`;
    const aiMessage = `\n${chat.createdAt} - ${aiName} : "${chat.aiMessage}"`;

    chatHistory = chatHistory.concat(userMessage, aiMessage);
  });

  // The summarizer AI takes the recentSummary + last 8 chat then outputs an array of summaries, separated by context.
  const summaryPrompt = ChatPromptTemplate.fromMessages([
    ["system", "Consider the following recent summary and chat log:"],
    new SystemMessage(chatHistory),
    ["user", "{input}"],
  ]);

  const summaryChain = summaryPrompt.pipe(chatModel).pipe(outputParser);

  return await summaryChain.invoke({
    input: `
    Provide an array of concise summaries of the key points in the chat history, segmented by context.
    
    Take this example as a reference:

    Recent Summary: On Feb 12, 2024, Jem expresses the intention to integrate a chatbot for customer support. Camille responds positively, highlighting the potential benefits. Jem seeks recommendations for chatbot frameworks, and Camille suggests considering Dialogflow or Rasa. Jem appreciates the advice and indicates they will explore the options with the tech team, to which Camille offers further assistance.

    Chat History:
    Feb 14, 2024, 09:15 AM - Jem: "I spoke with the tech team, and they're on board with integrating Dialogflow for the chatbot."
    Feb 14, 2024, 09:15 AM - Camille: "That's fantastic news! Dialogflow's natural language processing capabilities will enhance the user interaction."
    Feb 14, 2024, 09:20 AM - Jem: "We want to customize the chatbot's responses. Any tips on making it sound more human?"
    Feb 14, 2024, 09:20 AM - Camille: "Consider adding variations to responses and injecting a bit of personality. Also, leverage small delays for a more natural flow."
    Feb 14, 2024, 09:25 AM - Jem: "Good suggestions! I'll share these with the team as we work on refining the chatbot's behavior."
    Feb 14, 2024, 09:25 AM - Camille: "Sounds like a plan. If you need further assistance, feel free to reach out. Good luck with the implementation!"
    Feb 14, 2024, 7:00 PM - Jem: "The chatbot integration is progressing well, but we're debating whether to add emojis for a friendlier touch. What do you think?"
    Feb 14, 2024, 7:00 PM - Camille: "Emojis can indeed add a more approachable feel. Just ensure they're contextually appropriate and not overused to maintain professionalism."
    Feb 14, 2024, 7:05 PM - Jem: "Got it! We'll keep it subtle. Also, any thoughts on the chatbot's working hours? Should it be 24/7 or follow our support team's schedule?"
    Feb 14, 2024, 7:05 PM - Camille: "Consider aligning the chatbot's hours with your support team to ensure consistent service. You can always provide information about support hours during off times."
    Feb 14, 2024, 7:10 PM - Jem: "That makes sense. Thanks for the advice! We'll proceed with these adjustments and launch a beta version soon."
    Feb 14, 2024, 7:10 PM - Camille: "Exciting times! Best of luck with the beta launch. If you have any more questions, feel free to ask."
    Mar 20, 2024, 11:45 AM - Jem: "The chatbot beta went well, but users want more personalized responses. Any ideas on improving its understanding of individual preferences?"
    Mar 20, 2024, 11:45 AM - Camille: "Consider implementing user profiling. Collect feedback and interactions to tailor responses based on individual preferences over time."
    Mar 20, 2024, 11:50 AM - Jem: "That sounds like a great addition! How can we balance personalization without compromising user privacy?"
    Mar 20, 2024, 11:50 AM - Camille: "Use anonymized data and allow users to opt-in for personalized experiences. Clearly communicate your privacy policy to build trust."

    Expected Response:

    {
      "summaries":[
        "On Feb 12, 2024, Jem expresses the intention to integrate a chatbot for customer support. Camille responds positively, highlighting potential benefits. Jem seeks recommendations for chatbot frameworks, and the AI suggests considering Dialogflow or Rasa.",
        "On Feb 14, 2024, Jem updates that the tech team is on board with integrating Dialogflow. Camille expresses enthusiasm and discusses the potential enhancements in user interaction. Jem seeks advice on customizing the chatbot's responses to sound more human, and the AI provides suggestions.",
        "On Feb 14, 2024, at 7:00 PM, Jem discusses the progress of chatbot integration and considers adding emojis for a friendlier touch. Camille advises on using emojis appropriately. Jem also seeks input on the chatbot's working hours and receives guidance on aligning them with the support team's schedule. Jem expresses gratitude for the advice, mentions their plan to proceed with adjustments, and anticipates a beta version launch. Camille wishes them luck and offers continued support.",
        "On Mar 20, 2024 Jem provides an update on the chatbot beta's success and user feedback for more personalized responses. Camille suggests implementing user profiling and balancing personalization with user privacy through anonymized data and opt-in features."
      ]
    }

    🔒 : [Mandatory Protocol]: The response should be a valid JSON object.
    🔒 : [Mandatory Protocol]: Remove any \\n in the string.
  `,
  });
};
