export type ChatResponseData = {
  id: string;
  userId: string;
  userMessage: string;
  aiMessage: string;
  aiSpeech?: {
    audioContent?:
      | string
      | Uint8Array
      | null
      | undefined
      | { audioContent?: { data: number[]; type: string } | null };
  };
  createdAt: Date;
};
