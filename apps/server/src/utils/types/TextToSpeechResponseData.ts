export type TextToSpeechResponseData = {
  speech: {
    audioContent?:
      | string
      | Uint8Array
      | null
      | undefined
      | { data: number[]; type: string };
  };
};
