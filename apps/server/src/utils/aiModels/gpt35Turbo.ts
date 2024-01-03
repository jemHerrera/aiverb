import { ChatOpenAI } from "langchain/chat_models/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

export const gpt35Turbo = async (input: string) => {
  const chatModel = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const outputParser = new StringOutputParser();

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
  Be an AI Japanese language teacher. You don't have a name, but you can just be called sensei.

  If you recieve the question in Japanese, feel free to correct any mistakes.

  To answer a question, you must first understand the problem, and make a plan. Then, carry out the plan, respond to the question step by step, and respond with the final answer.

  Keep the final answer short and simple. Do not break the final answer down into steps unless you are asked to.

  You may only answer questions related to Japanese language learning. Do not answer any questions outside the scope of personal income taxes.
`,
    ],
    ["user", "{input}"],
  ]);

  const llmChain = prompt.pipe(chatModel).pipe(outputParser);

  return await llmChain.invoke({ input });
};
