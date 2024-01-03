import { HuggingFaceInference } from "langchain/llms/hf";

export const gpt2 = async (message: string) => {
  const model = new HuggingFaceInference({
    model: "gpt2",
    apiKey: process.env.HUGGING_FACE_ACCESS_TOKEN,
    temperature: 0.0,
  });

  return model.call(message);
};
