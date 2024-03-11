import { TextToSpeechClient } from "@google-cloud/text-to-speech";

type Voice = {
  languageCode: string;
  name: string;
  ssmlGender: "FEMALE" | "MALE" | "NEUTRAL" | null | undefined;
};

export async function tts(
  text: string,
  voice: Voice = {
    languageCode: "ja-JP",
    name: "ja-JP-Neural2-B",
    ssmlGender: "FEMALE" as const,
  }
) {
  const client = new TextToSpeechClient();

  const request = {
    input: { text: text },
    voice,
    audioConfig: { audioEncoding: "MP3" as const },
  };

  const [response] = await client.synthesizeSpeech(request);

  return response;
}
